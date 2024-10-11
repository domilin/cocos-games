import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, } from 'cc';
import { Const } from '../../../config/Const';
import { ActivityLockType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { comm } from '../../../easyFramework/mgr/comm';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('RewardActivityDialog')
export class RewardActivityDialog extends BaseView {
    @property({ type: Node, tooltip: "滚动列表" }) giftScroll: Node = null!;
    @property({ type: Node }) item: Node = null!;

    _MonthCardVal: any = null
    _clickItem = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        let activityArr = tables.ins().getTable(Const.Tables.saleshop_totalRecharge)
        for (let i = 0; i < activityArr.length; i++) {
            let activity = activityArr[i]
            let lockData = tables.ins().getTableValueByID(Const.Tables.lockActivity_item, activity.lockType)

        }

        this.scrollViewSetData(this.giftScroll, activityArr, this.initItem, this)
        //  ServerCtr.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
    }

    initItem(itemUI: Node, item: any, index: number, self: comm) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.typename
        if (RewardActivityDialog.checkActivityLock(item)) {
            self.addButtonHander(itemUI, self.node, "RewardActivityDialog", "openActivity", item)
            itemUI.getChildByName("lockLabel")!.getComponent(Label)!.string = ""
            let lockData = tables.ins().getTableValueByID(Const.Tables.lockActivity_item, item.lockType)
            itemUI.getChildByName("timeLabel")!.getComponent(CdComponent)!.setCD(CDType.CDCondition, lockData.dataKey, lockData.activityTime)
        } else {
            let lockData = tables.ins().getTableValueByID(Const.Tables.lockActivity_item, item.lockType)
            itemUI.getChildByName("lockLabel")!.getComponent(Label)!.string = "达到等级" + lockData.openLevel + "解锁"
            itemUI.getChildByName("timeLabel")!.getComponent(Label)!.string = ""
            self.clearButtonHander(itemUI)
        }
    }

    openActivity(event: any, data: any) {
        uiManager.instance.showDialog(data.openDialog, { activityData: data })
    }

    public static checkActivityLock(activity: any) {
        let lockData = tables.ins().getTableValueByID(Const.Tables.lockActivity_item, activity.lockType)
        if (lockData.cdType == ActivityLockType.type_Level) {
            if (userData.roleLv >= lockData.openLevel) {
                if (userData.checkLimitTime(lockData.dataKey, lockData.activityTime * 60 * 1000) > 0) {
                    return true
                }
            }
        }
        return false
    }


}

