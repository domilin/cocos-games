import { Button, director, find, instantiate, Label, Node, ProgressBar, Sprite, UITransform, v3, Vec3, _decorator } from 'cc';
import { WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import { GodWealthData, GodWealthReceiveUser } from '../../../config/global';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { Wechat } from '../../../tyqSDK/SDK/platform/wechat/wechat';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../../Util/RechargeManager';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('GodWealthLayer')
export class GodWealthLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    btnChange: Node = null!;

    @property({ type: Node })
    btnShare: Node = null!;


    @property({ type: Node })
    btnReceive: Node = null!;

    @property({ type: Node })
    hintNode: Node = null!;

    @property({ type: Node })
    selectLayer: Node = null!;
    @property({ type: Node })
    selectItem: Node = null!;

    _curRewardData: any = null
    _curSelectIndex = -1
    _isReceived = false

    _godWealthData: any = null;

    private static key_receive = "receive"
    private static key_reflesh = "reflesh"
    private static Key_fubag = "fubagreceive"
    private static Key_shareReceiveTime = "shareReceiveTime"

    _timeData: any = null
    get timeData() {
        if (this._timeData == null) {
            this._timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", "10011")
        }
        return this._timeData!
    }

    onLoad() {

        this.selectItem.parent = this.node;
        this.selectItem.active = false;

        this.bindButton(this.btnClose, this.onClickBtnClose);
        this.bindButton(this.btnChange, () => {
            this.videoRefreshSelectLayer()
        });

        this.bindButton(this.btnShare, this.onClickBtnShare)


    }

    onEnable() {
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    show(args: any) {
        super.show(args);
        this.refreshAwardLayer();
        this.refreshSelectLayer();

        this.schedule(this.updateSecond, 1);
        this.updateSecond();

        this.initBtns()
        ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.DataKeys.GodWealthData + "_" + userData.roleID))

    }

    onMessageEvent(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: userData.roleID, shareName: userData.roleName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) }
        if (value.key.indexOf(GameStorage.Key(Const.DataKeys.GodWealthData)) >= 0) {
            if (value.val != "") {
                godWealthData = JSON.parse(value.val)
                this._godWealthData = godWealthData
                this.updateSelectLayer(godWealthData)
                console.log("this._godWealthData = ", this._godWealthData)
            }
        }
    }

    updateSelectLayer(godWealthData: GodWealthData) {
        if (godWealthData.shareUserId != userData.roleID) {
            return
        }
        let receiveData = godWealthData.receiveUser
        let receiveTime = 0
        this._isReceived = false
        for (let i = 0; i < 6; i++) {
            let item = this.selectLayer.getChildByName("selectItem" + i)
            if (item) {
                let myChose = item.getChildByName("myChose")!
                myChose.active = false
                let otherChose = item.getChildByName("otherChose")!
                otherChose.active = false
                let receiveUser = receiveData[i]
                if (receiveUser) {
                    if (receiveUser.userID == userData.roleID + "") {
                        myChose.active = true
                        receiveTime++
                        this._isReceived = true
                    } else if (receiveUser.userID != "") {
                        otherChose.active = true
                        receiveTime++
                        if (receiveUser.avatar != "") {
                            //动态加载图片的方法
                            resourceUtil.setRemoteImage(receiveUser.avatar, find("head/icon", otherChose)!.getComponent(Sprite)!, () => { })
                        }
                    }
                }
            }
        }

        let chs = find("root/top/progress/awardLayer", this.node)!.children;
        for (let i = 0; i < chs.length; i++) {
            let awardItem = chs[i];
            let getNode = find("get", awardItem)!;
            getNode.active = receiveTime >= (i + 1) * 2 && userData.getReceiveTime(this.timeData.dataKey + GodWealthLayer.Key_fubag + (i + 1), this.timeData.cdTime) <= 0;
        }

        let progress = find("root/top/progress", this.node)!.getComponent(ProgressBar)!
        progress.progress = receiveTime / 6
        find("root/top/progress/val", this.node)!.getComponent(Label)!.string = receiveTime + "/6"
    }

    initBtns() {
        if (userData.getReceiveTime(this.timeData.dataKey + "receive", this.timeData.cdTime) >= this.timeData.receiveTime) {
            this.btnReceive.active = false
            this.btnShare.active = true
            this.btnChange.active = false
        } else {
            this.btnReceive.active = true
            this.btnShare.active = false
            this.btnChange.active = true
        }
    }

    refreshSelectLayer(force = false) {
        this.selectLayer.removeAllChildren();
        let curRewardData = this.initLimitData(force)
        this._curRewardData = curRewardData
        for (let i = 0; i < curRewardData.length; i++) {
            let item = instantiate(this.selectItem)
            item.position = v3(0, 0, 0)
            item.active = true
            item.name = "selectItem" + i
            this.selectLayer.addChild(item)
            this.initPropItem(curRewardData[i], item, i)
        }
    }

    initLimitData(force: boolean = false) {
        let propArr = tables.ins().getTableValuesByType(Const.Tables.prop, "fudai", "1")
        let godProp = []
        for (let index = 0; index < 6; index++) {
            let propItem = propArr[Math.floor(propArr.length * Math.random())]
            godProp.push(propItem.id)
        }
        let fun = (isUpdate: boolean) => {
            if (isUpdate) {
                GameStorage.setObject(Const.DataKeys.GodWealthData + "_" + userData.roleID, "")
            }
        }
        return userData.getLimitTimeData(this.timeData.dataKey, this.timeData.cdTime, godProp, force, fun)
    }

    initPropItem(id: number, item: Node, index: number) {
        let data = tables.ins().getTableValueByID(Const.Tables.prop, id)
        this.bindButton(find("btnPropInfo", item)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PropDetailLayer, id);
        })
        this.setSpriteFrame(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + data.icon, () => { }, 120)
        find("val", item)!.getComponent(Label)!.string = data.name

        this.addButtonHander(item, this.node, "GodWealthLayer", "onClickSelectItem", index)
    }

    onClickSelectItem(event: any, data: number) {
        if (this._isReceived) {
            return
        }
        this._curSelectIndex = data
        for (let i = 0; i < 6; i++) {
            let item = this.selectLayer.getChildByName("selectItem" + i)
            if (item) {
                find("chose", item)!.active = i == data
            }
        }
    }

    refreshAwardLayer() {
        let chs = find("root/top/progress/awardLayer", this.node)!.children;
        // let fubagTime = userData.getReceiveTime(this.timeData.dataKey + GodWealthLayer.Key_fubag, this.timeData.cdTime)
        for (let i = 0; i < chs.length; i++) {
            let awardItem = chs[i];
            let btnPropInfo = find("btnPropInfo", awardItem)!;
            // @ts-ignore
            btnPropInfo.bagId = i + 1;
            this.bindButton(btnPropInfo, this.onClickPropInfo);

            let getNode = find("get", awardItem)!;
            getNode.active = false;
            this.addButtonHander(getNode, this.node, "GodWealthLayer", "receiveFuBag", i + 1)
        }

        let progress = find("root/top/progress", this.node)!.getComponent(ProgressBar)!
        progress.progress = 0
    }

    updateSecond() {
        let dayTime = 24 * 60 * 60 * 1000;
        let nowTime = composeModel.getCurrentTimestamp();
        let dayTimeStart = new Date(nowTime);
        dayTimeStart.setHours(0);
        dayTimeStart.setMinutes(0);
        dayTimeStart.setSeconds(0);
        dayTimeStart.setMilliseconds(0);

        let remain = dayTimeStart.getTime() + dayTime - nowTime;
        if (remain <= 0) {
            remain = 0;
        }
        let str = localText.godWealthHint.format(UtilPub.getTimeStr(remain));
        this.setString(this.hintNode, str);
    }

    close() {
        super.close();
        this.unschedule(this.updateSecond);
    }

    onClickBtnClose() {
        this.close();
    }

    onClickPropInfo(btn: Button) {
        // @ts-ignore
        let bagId = btn.node.bagId;
        uiManager.instance.showDialog(Const.Dialogs.FuBagLayer, bagId);
    }

    onClickBtnReceive() {
        if (this._curSelectIndex < 0) {
            this.toast("请先选择一个礼物！")
            return
        }
        if (userData.getReceiveTime(this.timeData.dataKey + GodWealthLayer.key_receive, this.timeData.cdTime) >= this.timeData.receiveTime) {
            return
        }

        let propID = this._curRewardData[this._curSelectIndex]
        composeModel.addPropNum(propID, 1, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
        userData.setReceiveTime(this.timeData.dataKey + GodWealthLayer.key_receive, this.timeData.cdTime)

        let receiveUsers = []
        for (let index = 0; index < 6; index++) {
            let use: GodWealthReceiveUser = index == this._curSelectIndex ? {
                userID: userData.roleID,
                avatar: userData.roleAvatar,
            } : {
                userID: "",
                avatar: "",
            }
            receiveUsers.push(use)
        }
        let godWealthData: GodWealthData = { shareUserId: userData.roleID, shareName: userData.roleName, propList: this._curRewardData, receiveUser: receiveUsers, shareTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) }
        this._godWealthData = godWealthData
        GameStorage.setObject(Const.DataKeys.GodWealthData + "_" + userData.roleID, godWealthData)
        this.updateSelectLayer(this._godWealthData)
        this.initBtns()
        if (GameStorage.getInt(Const.DataKeys.authSetting, 0) == 0) {
            if (WECHAT) {
                Wechat.wxGetSetting().then((res: any) => {
                    console.error("res = ", res)
                    userData.roleAvatar = res.userInfo.avatarUrl
                    console.error("userData.roleAvatar = ", userData.roleAvatar)
                })
                GameStorage.setInt(Const.DataKeys.authSetting, 1)
            }
        } else {
            this.wxScopeHead()
        }
    }

    videoRefreshSelectLayer() {
        // let timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", "10011")
        if (userData.getReceiveTime(this.timeData.dataKey + GodWealthLayer.key_reflesh, this.timeData.cdTime) >= Const.GodWealthRefleshTime) {
            this.toast("刷新次数已用完")
            return
        }
        RechargeManager.showVideo("财神礼包刷新", () => {
            this.refreshSelectLayer(true)
            userData.setReceiveTime(this.timeData.dataKey + GodWealthLayer.key_reflesh, this.timeData.cdTime)
        })
    }

    onClickBtnShare() {
        // params: { shareUserId: "443344673366511616", shareName: "胖胖的", propList: [40028, 50017, 50012, 40027, 50013, 20022] } 
        // if (WECHAT) {
        //     Wechat.wxGetSetting().then((res: any) => {
        //         console.log("success res : ", res)
        //     }).catch((res: any) => {
        //         console.log("fail res : ", res)
        //     })
        // }
        this.wxScopeHead()

        let str = ""
        for (let index = 0; index < this._curRewardData.length; index++) {
            str += this._curRewardData[index]
            if (index < this._curRewardData.length - 1) {
                str += ","
            }
        }
        let args = "shareUserId=" + userData.roleID + "&shareName=" + userData.roleName + "&propList=" + str
        tyqSDK.share(args)
    }

    receiveFuBag(event: any, data: any) {
        uiManager.instance.showDialog(Const.Dialogs.FuBagReceiveLayer, { id: data });
        userData.setReceiveTime(this.timeData.dataKey + GodWealthLayer.Key_fubag + data, this.timeData.cdTime)
        if (this._godWealthData) {
            this.updateSelectLayer(this._godWealthData)
        }
    }

    wxScopeHead() {
        if (WECHAT) {
            Wechat.wxScopeHead().then((res: any) => {
                //  console.error("res = ", res)
                userData.roleAvatar = res.avatarUrl
                //    console.error("userData.roleAvatar = ", userData.roleAvatar)
            })
        }
    }

}

