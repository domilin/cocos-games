import { _decorator, Label, find, Node, director, Button, UITransform, v3 } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GoodsType } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../../Util/RechargeManager';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { MonthCard } from '../money/MonthCard';

const { ccclass, property } = _decorator;

@ccclass('ShopPowerDialog')
export class ShopPowerDialog extends BaseView {
    @property({ type: Label }) freeLabel: Label = null!
    @property({ type: Label }) diamonsLabel: Label = null!
    @property({ type: Label }) needDiamLabel: Label = null!

    @property({ type: Label }) cardAddPower: Label = null!

    @property({ type: Node }) videoPower: Node = null!
    @property({ type: Node }) cardPower: Node = null!

    _MonthCardVal: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        this.initData()
        //userData.diamonds += 10000
        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        this._MonthCardVal = {}
        this._MonthCardVal.have = false
        this.videoPower.active = true
        this.cardPower.active = false
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
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data) {
            this._MonthCardVal = {}
            this._MonthCardVal.have = MonthCard.checkMonthCard(value) ? 1 : 0
            // this._MonthCardVal.dayReceive = data.val["dayReceive"] && data.val["dayReceive"] == 1 ? 1 : 0
        }
    }

    initData() {
        this.freeLabel.string = "+" + tables.ins().config[Const.config.freePower]
        this.diamonsLabel.string = "+" + tables.ins().config[Const.config.diamonsPower][0]
        this.needDiamLabel.string = "X" + tables.ins().config[Const.config.diamonsPower][1] * userData.buyPowerTime
        this.cardAddPower.string = "+" + tables.ins().config[Const.config.CardAddPower]

        let videoData = tables.ins().getTableValuesByType2ByOne(Const.Tables.giftFree, "type", "1", "typeson", "2")
        if (videoData) {
            this.initItem(this.videoPower, videoData)
        } else {
            this.videoPower.active = false
            this.cardPower.active = true
        }
    }

    initItem(itemUI: Node, item: any) {
        //  itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
        //  console.log("item = ", item)
        //  console.log("item.receiveTime = ", item.receiveTime)
        if (receiveTime < item.receiveTime) {
            find("numLabel", itemUI)!.getComponent(Label)!.string = "已领取次数" + receiveTime
            this.addButtonHander(itemUI.getChildByName("btnbg")!, this.node, "ShopPowerDialog", "onClickGet", item)
            find("timelabel", itemUI)!.getComponent(Label)!.string = ""
        } else {
            find("numLabel", itemUI)!.getComponent(Label)!.string = ""
            let timelabel = find("timelabel", itemUI)!.getComponent(Label)!
            find("timelabel", itemUI)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, item.dataKey, item.cdTime, () => {
                timelabel.string = ""
            })
            itemUI.getChildByName("btnbg")!.getComponent(Button)?.destroy()
            // this.videoPower.active = false
            // this.cardPower.active = true
        }
    }

    onClickGet(event: any, item: any) {
        audioManager.instance.playSound(Const.Audio.btn)

        if (item.type == 1) {
            let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
            RechargeManager.showVideo("免费体力" + receiveTime + "次", () => {
                this.onVideoBack(item)
            })
            return
            if (this._MonthCardVal.have) {
                // 月卡免广告
                this.onVideoBack(item)
            } else {
                // 等待接入广告
                let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
                RechargeManager.showVideo("免费体力" + receiveTime + "次", () => {
                    this.onVideoBack(item)
                })
            }
        }
    }

    onVideoBack(item: any) {
        userData.getProp(item.price3, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
        this.emit(GD.event.updateMoney)
        userData.setReceiveTime(item.dataKey, item.cdTime)
        let videoData = tables.ins().getTableValuesByType2ByOne(Const.Tables.giftFree, "type", "1", "typeson", "2")
        if (videoData) {
            this.initItem(this.videoPower, videoData)
        } else {
            this.videoPower.active = false
            this.cardPower.active = true
        }
    }

    onClickFreePower() {

    }

    onClickDiamonsPower() {
        // if (this._MonthCardVal == null) {
        //     ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        //     this.toast("数据请求中")
        //     return
        // }

        audioManager.instance.playSound(Const.Audio.btn)

        if (userData.checkAndUseDiamonds(tables.ins().config[Const.config.diamonsPower][1] * userData.buyPowerTime)) {
            tyqSDK.eventSendCustomEvent("钻石购买体力 " + (tables.ins().config[Const.config.diamonsPower][1] * userData.buyPowerTime) + "钻石")
            userData.getProp([GoodsType.Power, tables.ins().config[Const.config.diamonsPower][0] + (this._MonthCardVal.have == 1 ? tables.ins().config[Const.config.CardAddPower] : 0)], this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
            userData.addBuyPowerTime()
            this.emit(GD.event.updateMoney)
            this.initData()
            composeModel.addManagerVal(Const.ManagerTypes.diamondBuyPower);
        } else {
            this.toast("钻石不足")
        }
    }

    onOpenCard() {
        uiManager.instance.showDialog(Const.Dialogs.MonthCard)
    }
}

