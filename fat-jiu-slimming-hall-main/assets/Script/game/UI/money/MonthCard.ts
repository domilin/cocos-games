import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Prefab, instantiate, director, Button, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { shopType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('MonthCard')
export class MonthCard extends BaseView {

    @property({ type: Node, tooltip: "月卡奖励列表" }) monthNode: Node = null!;
    @property({ type: Node, tooltip: "周卡奖励列表" }) weeksNode: Node = null!;
    @property({ type: Node, tooltip: "月卡奖励列表" }) rewardItem: Node = null!;

    _MonthCardVal = false
    _weekCardVal = false


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    public static get MonthCardData() {
        return tables.ins().getTableValuesByType2ByOne(Const.Tables.shopTable, "type", shopType.MonthCard + "", "dc", "2")
    }

    public static get WeekCardData() {
        return tables.ins().getTableValuesByType2ByOne(Const.Tables.shopTable, "type", shopType.MonthCard + "", "dc", "1")
    }

    public static checkMonthCard(value: any) {
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data && data.val["buyTime"]) {
            let buyTime = parseInt(data.val["buyTime"] + "")
            let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            if (curTime - buyTime < MonthCard.MonthCardData.totalLimit * 24 * 60 * 60 * 1000) {
                return true
            }
        }
        return false
    }

    public static checkWeekCard(value: any) {
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.WeekCharge)
        if (data && data.val["buyTime"]) {
            let buyTime = parseInt(data.val["buyTime"] + "")
            let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            if (curTime - buyTime < MonthCard.WeekCardData.totalLimit * 24 * 60 * 60 * 1000) {
                return true
            }
        }
        return false
    }

    show(args: any) {
        super.show(args)

        this.initDialog(this.monthNode, MonthCard.MonthCardData)
        this.initDialog(this.weeksNode, MonthCard.WeekCardData)

        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.WeekCharge))
    }

    onEnable() {
        console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data) {
            this._MonthCardVal = MonthCard.checkMonthCard(value)
            this.initMonthCardBtn()
        }
        data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.WeekCharge)
        if (data) {
            this._weekCardVal = MonthCard.checkWeekCard(value)
            this.initWeekCardBtn()
        }
    
    }

    initMonthCardBtn() {
        if (this._MonthCardVal) {
            find("btnBuy", this.monthNode)!.active = false
            find("btnReceive", this.monthNode)!.active = true
        } else {
            find("btnBuy", this.monthNode)!.active = true
            find("btnReceive", this.monthNode)!.active = false
        }
    }

    initWeekCardBtn() {
        if (this._weekCardVal) {
            find("btnBuy", this.weeksNode)!.active = false
            find("btnReceive", this.weeksNode)!.active = true
        } else {
            find("btnBuy", this.weeksNode)!.active = true
            find("btnReceive", this.weeksNode)!.active = false
        }
    }

    initDialog(dialog: Node, monthCardData: any) {
        let monthRewardList = dialog.getChildByName("rewardList")!
        let nowRewardList = dialog.getChildByName("Layout")!
        let totalList = dialog.getChildByName("totalList")!

        monthRewardList.removeAllChildren()
        nowRewardList.removeAllChildren()
        totalList.removeAllChildren()

        if (monthCardData) {
            let rechargeData = tables.ins().getTableValueByID(Const.Tables.recharge, monthCardData.recharge)
            find("btnBuy/Label", dialog)!.getComponent(Label)!.string = "$" + rechargeData.cash
            let privilegeList = monthCardData.price3
            for (let index = 0; index < privilegeList.length; index++) {
                let element = privilegeList[index];
                let privilegeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", element[0])
                if (privilegeData.type == 1) {
                    let item = instantiate(this.rewardItem)
                    item.position = v3(0, 0, 0)
                    monthRewardList.addChild(item)
                    this.setSpriteFrame(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + privilegeData.icon, () => { }, 80)
                    find("Label", item)!.getComponent(Label)!.string = privilegeData.ps
                } else if (privilegeData.type == 2) {
                    let rewardData = privilegeData.value
                    rewardData.forEach((element: any) => {
                        let item = instantiate(this.rewardItem)
                        item.position = v3(0, 0, 0)
                        nowRewardList.addChild(item)
                        let propdata = tables.ins().getTableValueByID(Const.Tables.prop, element[0])
                        this.setSpriteFrame(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + propdata.icon, () => { }, 80)
                        find("Label", item)!.getComponent(Label)!.string = "" + element[1]

                        let item2 = instantiate(this.rewardItem)
                        item2.position = v3(0, 0, 0)
                        totalList.addChild(item2)
                        this.setSpriteFrame(find("icon", item2)!.getComponent(Sprite)!, Const.resPath.icon + privilegeData.icon, () => { }, 80)
                        find("Label", item2)!.getComponent(Label)!.string = "" + element[1] * monthCardData.totalLimit
                    });
                    this.initReceiveBtn(dialog, privilegeData)
                }
            }
        }
    }


    initReceiveBtn(itemUI: Node, item: any) {
        // itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = userData.getReceiveTime(item.dataKey, item.cdTime)
        // find("numLabel", itemUI)!.getComponent(Label)!.string = "已领取次数" + receiveTime
        if (receiveTime < item.receiveTime) {
            this.addButtonHander(itemUI.getChildByName("btnReceive")!, this.node, "MonthCard", "onClickGet", item)
            find("timelabel", itemUI)!.getComponent(Label)!.string = ""
        } else {
            find("timelabel", itemUI)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, item.dataKey, item.cdTime)
            itemUI.getChildByName("btnReceive")!.getComponent(Button)?.destroy()
        }
    }

    onClickGet(event: any, item: any) {
        console.log("event = ", event)
        // let reward = item.value
        this.onVideoBack(item.value)
        this.emit(GD.event.updateMoney)
        userData.setReceiveTime(item.dataKey, item.cdTime)
        this.initReceiveBtn(event.target.parent, item)
    }

    onVideoBack(item: any) {
        userData.getProp(item,null,null)
    }

    onClickBuyMonth() {
        if (this._MonthCardVal) {
            // if (this._MonthCardVal.dayReceive) {
            //     return
            // } else {
            //     let monthCardData = tables.ins().getTableValuesByType2ByOne(Const.Tables.shopTable, "type", "3", "typeson", "2")
            //     let privilegeList = monthCardData.price3
            //     for (let index = 0; index < privilegeList.length; index++) {
            //         let element = privilegeList[index];
            //         let privilegeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", element[0])
            //         if (privilegeData.type == 2) {
            //             let id = privilegeData.value
            //             let num = element[1]
            //             userData.getProp([id, num])
            //         }
            //     }
            //     GameStorage.setObject(Const.MoneyKeys.MonthCharge, { month: 1, dayReceive: 1 })
            //     ServerCtr.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
            //     this.emit(GD.event.updateMoney)
            // }
        } else {
            let fisrtData = tables.ins().getTableValueByKey(Const.Tables.shopTable, "type", 2)
            userData.getProp(fisrtData.first,null,null)
            this.emit(GD.event.updateMoney)
            GameStorage.setObject(Const.MoneyKeys.MonthCharge, { month: 1, dayReceive: 0, buyTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) })
            ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        }
    }

    onClickBuyWeeks() {
        if (this._weekCardVal) {

        } else {
            GameStorage.setObject(Const.MoneyKeys.WeekCharge, { week: 1, weekdayReceive: 0, buyTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) })
            ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.WeekCharge))
        }
    }
}

