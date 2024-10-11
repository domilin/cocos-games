import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, instantiate, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { PriceType, shopType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
const { ccclass, property } = _decorator;


@ccclass('ShopSynthesisDialog')
export class ShopSynthesisDialog extends BaseView {
    @property({ type: Node, tooltip: "图鉴列表" }) shopScroll: Node = null!;

    _itemUI: Node = null!

    start() {

    }

    show(args: any) {
        super.show(args)
        this.bindButton(find("root/btnClose", this.node)!, this.close)
        //   userData.setGetPropTujian(10005, Const.TujianState.geted)
        this.showList()


    }

    onEnable() {
        this.on(GD.event.updateShopItem, this.updateShopItem)
        // setTimeout(() => {
        //     let hadnIdnex = composeModel.getHandIndex();
        //     let node = find("root/ScrollView2/view/content", this.node)!
        //     if (node.children.length > 0) {
        //         let node1 = find("Layout", node.children[0])!.children[0]
        //         if (node1 && hadnIdnex == handIndexs.shopbuy) {
        //             composeModel.closeHandLayer()
        //             let obj: any = {};
        //             obj.id = hadnIdnex;
        //             obj.node = node1;
        //             obj.delayTime = 0.2;
        //             uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        //         }
        //     }
        // }, 800);
    }

    onDisable() {
        this.off(GD.event.updateShopItem, this.updateShopItem)
    }

    showList() {
        let propData = tables.ins().getTableValuesByType(Const.Tables.shopTable, "type", shopType.ToolBox)
        let propData2 = tables.ins().getTableValuesByType(Const.Tables.shopTable, "type", shopType.ResourceBox)
        let propData3 = tables.ins().getTableValuesByType(Const.Tables.shopTable, "type", shopType.LimitProp)

        let dataArr: any = []
        if (propData2.length > 0) {
            let element = propData2[Math.floor(propData2.length * Math.random())]
            if (!dataArr[element.typeson - 1]) {
                dataArr[element.typeson - 1] = []
            }
            let timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", "10007")
            dataArr[element.typeson - 1].push(userData.getLimitTimeData(timeData.dataKey, timeData.cdTime, element))
        }
        if (propData3.length > 0) {
            let element = propData3[0]
            dataArr[element.typeson - 1] = this.initLimitData()
        }

        propData.forEach(element => {
            if (!dataArr[element.typeson - 1]) {
                dataArr[element.typeson - 1] = []
            }
            dataArr[element.typeson - 1].push(element)
        });

        let content = find("view/content", this.shopScroll)!
        content!.removeAllChildren()
        dataArr.forEach((element: any, index: number) => {
            console.log("element.type = ", element)
            if (element[0].type != 5) {
                let item = instantiate(element[0].type == 5 ? find("Layout2", this.node)! : find("Layout", this.node)!)!
                item.position = v3(0, 0, 0)
                content.addChild(item)
                this.initItemInfo(item, element);
            }
        });
    }

    initLimitData(force: boolean = false) {
        let propData3 = tables.ins().getTableValuesByType(Const.Tables.shopTable, "type", shopType.LimitProp)

        if (propData3.length > 0) {
            let element = propData3[0]
            // if (!dataArr[element.typeson - 1]) {
            //     dataArr[element.typeson - 1] = []
            // }
            let propArr = tables.ins().getTableValuesByType(Const.Tables.prop, "xian", "1")
            let limitProp = []
            let isHave: any = {}
            for (let index = 0; index < 6;) {
                let propItem = propArr[Math.floor(propArr.length * Math.random())]
                if (isHave[propItem.id] == null) {
                    isHave[propItem.id] = 1
                    let element2 = JSON.parse(JSON.stringify(element));
                    element2.price3 = [[propItem.id, 1]]
                    let priceType = Math.random() < 0.5 ? PriceType.Coin : PriceType.Diamonds
                    let priceNum = 0
                    if (priceType == PriceType.Coin) {
                        priceNum = Math.floor(Math.random() * 790) + 10
                    } else {
                        priceNum = Math.floor(Math.random() * 24) + 1
                    }
                    element2.price2 = [[priceType, priceNum], [priceType, priceNum], [priceType, priceNum], [priceType, priceNum], [priceType, priceNum], [1, 1]]
                    limitProp.push(element2)
                    index++
                }
            }
            let timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", "10009")
            //  dataArr[element.typeson - 1] = userData.getLimitTimeData(timeData.dataKey, timeData.cdTime, limitProp)
            return userData.getLimitTimeData(timeData.dataKey, timeData.cdTime, limitProp, force)
        }
    }

    initItemInfo(itemUI: Node, itemData: any) {
        //  console.log("itemData = ", itemData)
        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].typename + ""
            if (itemData[0].cdKey > 0) {
                let timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", itemData[0].cdKey)
                find("titl2/cdtime", itemUI)!.active = true
                find("titl2/cdtime", itemUI)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, timeData.dataKey, timeData.cdTime)
            } else {
                find("titl2/label", itemUI)!.active = false
                find("titl2/timeIcon", itemUI)!.active = false
                find("titl2/cdtime", itemUI)!.active = false
            }

            if (itemData[0].specialOffer > 0 && find("titl2/rate", itemUI)) {
                find("titl2/rate", itemUI)!.getComponent(Label)!.string = "" + itemData[0].specialOffer
            }

            let layer = itemUI.getChildByName("Layout")
            layer!.removeAllChildren()
            if (itemData.length < 3) {
                layer!.getComponent(Layout)!.type = Layout.Type.HORIZONTAL
                layer!.getComponent(UITransform)!.height = 260
            } else {
                layer!.getComponent(UITransform)!.height = 200 * Math.ceil(itemData.length / 3)
            }
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                this.addPrefab(Const.Prefabs.ShopSynthesisItem, layer!, (item: any) => { }, { data: element, item: element.price3 })
            }

            if (itemData[0].autoReflesh > 0) {
                itemUI.getChildByName("btnlayer")!.active = true
                let btnReflesh = find("btnlayer/btnReflesh", itemUI)!
                this.addButtonHander(btnReflesh, this.node, "ShopSynthesisDialog", "reflashItemData", itemData[0])
                this._itemUI = itemUI
            } else {
                itemUI.getChildByName("btnlayer")!.active = false
                let btnReflesh = find("btnlayer/btnReflesh", itemUI)!
                this.clearButtonHander(btnReflesh)
            }
        }
    }

    reflashItemData(event: any, data: any) {

        uiManager.instance.showDialog(Const.Dialogs.RefleshDialog, { itemData: data })

    }


    updateShopItem() {
        if (this._itemUI)
            this.initItemInfo(this._itemUI, this.initLimitData(true))
    }
}

