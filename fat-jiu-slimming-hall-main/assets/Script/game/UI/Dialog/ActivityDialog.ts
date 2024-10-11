import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, LabelOutline, Vec3, } from 'cc';
import { NATIVE, WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { comm } from '../../../easyFramework/mgr/comm';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../../Util/RechargeManager';
import { userData } from '../../comm/UserData';
import { MonthCard } from '../money/MonthCard';

const { ccclass, property } = _decorator;



@ccclass('ActivityDialog')
export class ActivityDialog extends BaseView {
    @property({ type: Node, tooltip: "滚动列表" }) giftScroll: Node = null!;
    _MonthCardVal: any = null
    _clickItem: any = null

    start() {
        this.bindButton(find("root/node/btnClose", this.node)!, this.close)
    }

    onEnable() {
        // console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        //console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(value: any) {
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data) {
            this._MonthCardVal = {}
            this._MonthCardVal.have = MonthCard.checkMonthCard(value) ? 1 : 0
            if (this._clickItem) {
                //   this.dealClickItem()
            }
        }
    }

    show(args: any) {
        super.show(args)
        let giftData = tables.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, giftData, this.initItem, this)
        if (!WECHAT) {
            ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        }
        tyqSDK.eventSendCustomEvent("查看免费礼物")
    }

    initItem(itemUI: Node, item: any, index: number, self: comm) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
        find("numLabel", itemUI)!.getComponent(Label)!.string = "已领取次数" + receiveTime
        find("titleLabel", itemUI)!.getComponent(Label)!.string = item.typename
        find("titleLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()
        find("infoLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()

        self.addButtonHander(itemUI.getChildByName("btnbg")!, self.node, "ActivityDialog", "onClickGet", item)

        self.setSpriteFrame(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.freeGiftIcon + item.icon)

        if (item.typeson == 3) {
            find("numNode", itemUI)!.active = true
            find("numNode/numLabel", itemUI)!.getComponent(Label)!.string = "x" + userData.dressMoney
        } else {
            find("numNode", itemUI)!.active = false
        }
        if (item.price3 == "") {
            itemUI.getChildByName("btnbg")!.active = false
            find("titleLabel", itemUI)!.position = v3(0, 0, 0)
        }

        // if (receiveTime < item.receiveTime) {
        //     self.addButtonHander(itemUI.getChildByName("btnbg")!, self.node, "ActivityDialog", "onClickGet", item)
        //     find("timelabel", itemUI)!.getComponent(Label)!.string = ""
        // } else {
        //     find("timelabel", itemUI)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, item.dataKey, item.cdTime)
        //     itemUI.getChildByName("btnbg")!.getComponent(Button)?.destroy()
        // }
    }

    onClickGet(event: any, item: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
        if (receiveTime >= item.receiveTime) {
            this.toast("请等待次数恢复哦~")
            return
        }
        if (item.type == 1) {
            // if (!NATIVE && this._MonthCardVal == null) {
            //     ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
            //     this.toast("数据请求中")
            //     return
            // }
            this._clickItem = item
            let startNode = find("numNode", event.target.parent)!
            let pos = startNode ? startNode.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)) : this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0))
            this.dealClickItem(pos)
        }
    }

    dealClickItem(startpos: Vec3) {
        let receiveTime = userData.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
        RechargeManager.showVideo(this._clickItem!.info + "" + receiveTime + "次", () => {
            this.onVideoBack(this._clickItem, startpos)
        })
        return
        if (this._MonthCardVal.have == 1 && !NATIVE) {
            //月卡免广告
            this.onVideoBack(this._clickItem, startpos)
        } else {
            //等待接入广告
            let receiveTime = userData.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
            RechargeManager.showVideo(this._clickItem!.info + "" + receiveTime + "次", () => {
                this.onVideoBack(this._clickItem, startpos)
            })
            //   this.onVideoBack(item)
        }
    }

    onVideoBack(item: any, startpos: Vec3) {
        userData.getProp(item.price3, startpos, v3(0, 0, 0))
        // this.emit(GD.event.updateMoney)
        userData.setReceiveTime(item.dataKey, item.cdTime)
        let giftData = tables.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, giftData, this.initItem, this)
        this._clickItem = null
    }


}

