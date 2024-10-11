import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, LabelOutline, } from 'cc';
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



@ccclass('FreeGiftDialog')
export class FreeGiftDialog extends BaseView {

    _clickItem: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.close)
    }

    show(args: any) {
        super.show(args)
        let giftData = tables.ins().getTableValuesByType2ByOne(Const.Tables.giftFree, "type", "1", "typeson", this._layerData.type)
        this.initItem(find("root/Node", this.node)!, giftData)

        tyqSDK.eventSendCustomEvent("主页资源获得免费礼物")
    }

    initItem(itemUI: Node, item: any) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
        find("numLabel", itemUI)!.getComponent(Label)!.string = "已领取次数" + receiveTime
        find("titleLabel", itemUI)!.getComponent(Label)!.string = item.typename
        find("titleLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()
        //  find("infoLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()

        this.addButtonHander(itemUI.getChildByName("btnbg")!, this.node, "FreeGiftDialog", "onClickGet", item)
        //  this.setSpriteFrame(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.freeGiftIcon + item.icon)

        if (item.typeson == 3) {
            find("numNode", itemUI)!.active = true
            find("numNode/numLabel", itemUI)!.getComponent(Label)!.string = "x" + userData.dressMoney
        } else {
            find("numNode", itemUI)!.active = false
        }
        find("numNode", itemUI)!.active = false
        if (item.price3 == "") {
            itemUI.getChildByName("btnbg")!.active = false
            find("titleLabel", itemUI)!.position = v3(0, 0, 0)
        } else {
            let porpID = item.price3.split(",")[0]
            let itemData = tables.ins().getTableValueByID(Const.Tables.prop, porpID)
            this.setSpriteFrame(find("propIcon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + itemData.icon, undefined, 100)
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
            this.toast("领取次数已用完！")
            return
        }
        if (item.type == 1) {
            this._clickItem = item
            this.dealClickItem()
        }
    }

    dealClickItem() {
        //等待接入广告
        let receiveTime = userData.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
        RechargeManager.showVideo(this._clickItem!.info + "" + receiveTime + "次", () => {
            this.onVideoBack(this._clickItem)
        })
    }

    onVideoBack(item: any) {
        userData.getProp(item.price3,  this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
        this.emit(GD.event.updateMoney)
        userData.setReceiveTime(item.dataKey, item.cdTime)
        let giftData = tables.ins().getTableValuesByType2ByOne(Const.Tables.giftFree, "type", "1", "typeson", this._layerData.type)
        this.initItem(find("root/Node", this.node)!, giftData)
        this._clickItem = null
    }

}

