import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { comm } from '../../../easyFramework/mgr/comm';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;



@ccclass('SaleDailyDialog')
export class SaleDailyDialog extends BaseView {
    @property({ type: Node }) dataContent: Node = null!;
    @property({ type: Node }) item: Node = null!;

    @property({ type: Node }) timelabel: Node = null!;
    @property({ type: Label }) titlelabel: Label = null!;


    _priceType = 0
    _priceNum = 0

    _isCanBuyAll = true

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.addButtonHander(find("root/btnday", this.node)!, this.node, "SaleDailyDialog", "initData", 1)
        this.addButtonHander(find("root/btnWeek", this.node)!, this.node, "SaleDailyDialog", "initData", 2)
        this.addButtonHander(find("root/btnMonth", this.node)!, this.node, "SaleDailyDialog", "initData", 3)
    }

    show(args: any) {
        super.show(args)
        this.initShop(1)
        //  TimeCtr.isSameWeek(TimeCtr.GetInstance().ServerTime,TimeCtr.GetInstance().ServerTime + 1440*60000)
    }

    initData(event: any, data: number) {
        this.initShop(data)
    }

    initShop(type: number) {
        let shopdata = tables.ins().getTableValueByID(Const.Tables.saleShop, type)
        this.titlelabel.string = shopdata.typename

        this.timelabel.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, shopdata.dataKey, shopdata.cdTime)

        let data = tables.ins().getTableValuesByType(Const.Tables.saleShopItem, "type", shopdata.typeson)
        if (data.length > 0) {
            this._isCanBuyAll = true
            this.setScrollViewData(this.dataContent, data, this.item, this.initItem, this)
        }

        if (shopdata.recharge > 0) {
            let rechargeData = tables.ins().getTableValueByID(Const.Tables.recharge, shopdata.recharge)
            let btnBuyAll = find("root/btnBuyAll", this.node)!
            find("Label", btnBuyAll)!.getComponent(Label)!.string = "￥" + rechargeData.cash
            if (this._isCanBuyAll) {
                this.addButtonHander(btnBuyAll, this.node, "SaleDailyDialog", "onClickBtnBuyAll", shopdata)
                btnBuyAll.getComponent(Sprite)!.grayscale = false
            } else {
                this.clearButtonHander(btnBuyAll)
                btnBuyAll.getComponent(Sprite)!.grayscale = true
            }
        }
    }

    onClickBtnBuyAll(event: any, shopdata: any) {
        let data = tables.ins().getTableValuesByType(Const.Tables.saleShopItem, "type", shopdata.typeson)
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                this.onClickFreeSaleShop(null, data[index])
            }
        }
        this.initShop(shopdata.id)
    }

    initItem(itemUi: Node, data: any, index: number, self: SaleDailyDialog) {
        find("Layout", itemUi)!.removeAllChildren()
        let reward = data.reward
        reward.forEach((element: any) => {
            self.addPrefab(Const.Prefabs.PropItem, find("Layout", itemUi)!, (propItem: Node) => {
                propItem.getComponent(PropItem)!.setData(element[0], PropItemFlag.ShowNum, element[0])!.setSize(80)
            })
        });
        let btnFree = find("btnyellow", itemUi)!
        let btnBuy = find("btnGreenbg", itemUi)!
        let time = userData.getReceiveTime(data.dataKey, data.cdTime)
        if (data.recharge > 0) {
            btnFree.active = false
            btnBuy.active = true
            let btnLabel = btnBuy.getChildByName("Label")!.getComponent(Label)!
            if (time < data.buyUpLimit) {
                self.addButtonHander(btnBuy, self.node, "SaleDailyDialog", "onClickBuySaleShop", data)
                let rechargeData = tables.ins().getTableValueByID(Const.Tables.recharge, data.recharge)
                btnLabel.string = "￥" + rechargeData.cash
            } else {
                btnLabel.string = "已领取"
                self.clearButtonHander(btnBuy)
                self._isCanBuyAll = false
            }
        } else {
            btnFree.active = true
            btnBuy.active = false
            if (time < data.buyUpLimit) {
                self.addButtonHander(btnFree, self.node, "SaleDailyDialog", "onClickFreeSaleShop", data)
            } else {
                btnFree.getChildByName("Label")!.getComponent(Label)!.string = "已领取"
                self.clearButtonHander(btnFree)
            }
        }
    }

    onClickBuySaleShop(event: any, data: any) {
        this.onClickFreeSaleShop(event, data)
    }

    onClickFreeSaleShop(event: any, data: any) {
        data.reward.forEach((element: any) => {
            composeModel.addPropNum(element[0], element[1])
        });
        userData.setReceiveTime(data.dataKey, data.cdTime)
        this.initShop(data.type)
        //  this.initItem(event.target.parent, data, 0, this)
    }
}

