import { Button, color, director, find, instantiate, Label, LabelOutline, Node, Sprite, UITransform, v3, Vec3, _decorator } from 'cc';
import { WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import { GodWealthData } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { Wechat } from '../../../tyqSDK/SDK/platform/wechat/wechat';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('GodWealthOther')
export class GodWealthOther extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    btnReceive: Node = null!;

    @property({ type: Label })
    receiveTimeLabel: Label = null!;

    @property({ type: Node })
    selectLayer: Node = null!;

    @property({ type: Node })
    selectItem: Node = null!;

    @property({ type: Label })
    shareLabel: Label = null!;

    @property({ type: Node })
    receivedLabel: Node = null!;

    _curRewardData: any = []
    _curSelectIndex = -1
    _timeData: any = null
    _curShareUserID: string = ""

    _godWealthData: any = null;

    _isReceived = false


    private static key_receiveOther = "receiveOther"
    private static key_shareUserID = "shareUserID"
    private static Key_fubag = "fubagreceive"
    private static Key_shareReceiveTime = "shareReceiveTime"


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
        this.bindButton(this.btnReceive, this.onClickBtnReceive);

        //  director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onEnable() {
        director.off(GNetCmd.ReceiveGodWealth.toString(), this.onMessageEventReceive, this);
        director.on(GNetCmd.ReceiveGodWealth.toString(), this.onMessageEventReceive, this);
    }

    onDisable() {
        director.off(GNetCmd.ReceiveGodWealth.toString(), this.onMessageEventReceive, this);
    }

    show(args: any) {
        super.show(args);

        let params = this._layerData.params
        this._curShareUserID = params.shareUserId
        this._curRewardData = params.propList
        // ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.DataKeys.GodWealthData + "_" + this._curShareUserID))
        ServerCtrJSF.GetInstance().reqReceiveGodWealth(this._curShareUserID + "", -1)

        this.refreshSelectLayer();
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


    onMessageEventReceive(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: userData.roleID, shareName: this._layerData.params.shareName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) }
        if (value.shareData) {
            godWealthData = value.shareData
            console.error("godWealthData = ", value.shareData)

            if (!TimeCtrJSF.isSameInterval(Math.floor(TimeCtrJSF.GetInstance().ServerTime), godWealthData.shareTime, this.timeData.cdTime)) {
                this.toast("领取超时")
                this.close()
                return
            }
            if (godWealthData.shareUserId == this._curShareUserID) {
                this._godWealthData = godWealthData
                this.updateSelectLayer(godWealthData)
            }
        }
    }


    onMessageEvent(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: userData.roleID, shareName: this._layerData.params.shareName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) }
        if (value.key.indexOf(GameStorage.Key(Const.DataKeys.GodWealthData)) >= 0) {
            if (value.val != "") {
                godWealthData = JSON.parse(value.val)
                this._godWealthData = godWealthData
                this.updateSelectLayer(godWealthData)
            }
        }
    }

    updateSelectLayer(godWealthData: GodWealthData) {
        if (godWealthData.shareUserId != this._curShareUserID + "") {
            return
        }
        find("root/shareLabel", this.node)!.getComponent(Label)!.string = "财神" + godWealthData.shareName + "送了你一个礼包，选择一个你想要的拿走吧"
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
                console.error("receiveData" + i, receiveData[i])

                if (receiveUser) {
                    if (receiveUser.userID == userData.roleID + "") {
                        myChose.active = true
                        receiveTime++

                        this._isReceived = true
                        let curTime = userData.getReceiveTime(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)
                        if (curTime < 1 || userData.getIntervalData(this.timeData.dataKey + GodWealthOther.key_shareUserID + (curTime - 1), this.timeData.cdTime, this._curShareUserID + "") != this._curShareUserID + "") {
                            composeModel.addPropNum(this._curRewardData[i], 1)
                            userData.setIntervarData(this.timeData.dataKey + GodWealthOther.key_shareUserID + curTime, this.timeData.cdTime, this._curShareUserID + "")
                            userData.setReceiveTime(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)
                        }

                    } else if (receiveUser.userID != "") {
                        otherChose.active = true
                        receiveTime++
                        if (receiveUser.avatar != "") {
                            //动态加载图片的方法
                            resourceUtil.setRemoteImage(receiveUser.avatar, find("head/icon", otherChose)!.getComponent(Sprite)!, () => { })
                        }

                        if (receiveUser.userID == this._curShareUserID) {
                            if (receiveUser.avatar != "") {
                                //动态加载图片的方法
                                resourceUtil.setRemoteImage(receiveUser.avatar, find("root/shareicon", this.node)!.getComponent(Sprite)!, () => { })
                            }
                        }
                    }
                }
            }
        }

        let btnReceive = find("root/btnReceive", this.node)!
        if (this._isReceived) {
            btnReceive.getComponent(Button)!.interactable = false
            btnReceive.getChildByName("bg")!.getComponent(Sprite)!.grayscale = true
            btnReceive.getChildByName("text")!.getComponent(Label)!.string = "已领取"
            btnReceive.getChildByName("text")!.getComponent(LabelOutline)!.color = color(30, 30, 30, 255)
        } else {
            btnReceive.getComponent(Button)!.interactable = true
            btnReceive.getChildByName("bg")!.getComponent(Sprite)!.grayscale = false
            btnReceive.getChildByName("text")!.getComponent(Label)!.string = "领取"
            btnReceive.getChildByName("text")!.getComponent(LabelOutline)!.color = color(68, 86, 9, 255)
        }

        this.initBtns()
    }

    initBtns() {
        let curTime = userData.getReceiveTime(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)

        if (curTime >= Const.GodWealthReceiveOtherTime) {
            this.btnReceive.active = false
            this.receivedLabel.active = true
            if(userData.getIntervalData(this.timeData.dataKey + GodWealthOther.key_shareUserID + (0), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + "" ||userData.getIntervalData(this.timeData.dataKey + GodWealthOther.key_shareUserID + (1), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + ""){
                this.receivedLabel.getComponent(Label)?.string +"已领取"
            }else{
                this.receivedLabel.getComponent(Label)?.string +"领取次数已用完"
            }
        } else {
            if (curTime == 1 && userData.getIntervalData(this.timeData.dataKey + GodWealthOther.key_shareUserID + (curTime - 1), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + "") {
                this.btnReceive.active = false
                this.receivedLabel.active = true
                this.receivedLabel.getComponent(Label)?.string +"已领取"
            } else {
                this.btnReceive.active = true
                this.receivedLabel.active = false
            }
        }
        this.receiveTimeLabel.string = "还可领取" + curTime + "/" + Const.GodWealthReceiveOtherTime + "次财神的礼物！"
    }

    refreshSelectLayer(force = false) {
        this.selectLayer.removeAllChildren();
        for (let i = 0; i < this._curRewardData.length; i++) {
            let item = instantiate(this.selectItem)
            item.position = v3(0, 0, 0)
            item.active = true
            item.name = "selectItem" + i
            this.selectLayer.addChild(item)
            this.initPropItem(this._curRewardData[i], item, i)
        }
    }

    initPropItem(id: number, item: Node, index: number) {
        let data = tables.ins().getTableValueByID(Const.Tables.prop, id)
        this.bindButton(find("btnPropInfo", item)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PropDetailLayer, id);
        })
        this.setSpriteFrame(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + data.icon, () => { }, 120)
        find("val", item)!.getComponent(Label)!.string = data.name
        this.addButtonHander(item, this.node, "GodWealthOther", "onClickSelectItem", index)
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
            this.toast("请先选择一个礼物")
            return
        }
        ServerCtrJSF.GetInstance().reqReceiveGodWealth(this._curShareUserID + "", this._curSelectIndex)

        // let curTime = userData.getReceiveTime(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)

        // if (curTime >= Const.GodWealthReceiveOtherTime) {
        //     return
        // } else {
        //     if (curTime == 1 && userData.getIntervalData(this.timeData.dataKey + GodWealthOther.key_shareUserID + (curTime - 1), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + "") {
        //         return
        //     }
        // }

        // let propID = this._curRewardData[this._curSelectIndex]
        // composeModel.addPropNum(propID, 1, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
        //  userData.setIntervarData(this.timeData.dataKey + GodWealthOther.key_shareUserID + curTime, this.timeData.cdTime, this._curShareUserID + "")
        // userData.setReceiveTime(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)
        // this.initBtns()
    }

    wxScopeHead() {
        if (WECHAT) {
            Wechat.wxScopeHead().then((res: any) => {
                //   console.error("res = ", res)
                userData.roleAvatar = res.avatarUrl
                //  console.error("userData.roleAvatar = ", userData.roleAvatar)
            })
        }
    }


}

