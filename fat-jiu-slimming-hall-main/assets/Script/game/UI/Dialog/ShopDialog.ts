import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
const { ccclass, property } = _decorator;



@ccclass('ShopDialog')
export class ShopDialog extends BaseView {
    @property({ type: Node, tooltip: "图鉴列表" }) shopScroll: Node = null!;

    start() {
    }

    show(args: any) {
        super.show(args)
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        //   userData.setGetPropTujian(10005, Const.TujianState.geted)
        this.showList()
    }

    showList() {
        let propData = tables.ins().getTableValuesByType(Const.Tables.shopTable, "type", "1")
        let dataArr: any = []
        propData.forEach(element => {
            if (!dataArr[element.typeson - 1]) {
                dataArr[element.typeson - 1] = []
            }
            dataArr[element.typeson - 1].push(element)
        });
        let content = find("view/content", this.shopScroll)
        content!.removeAllChildren()
        this.setScrollViewData(content!, dataArr, find("root/Layout", this.node)!, this.initItemInfo, this)
    }

    initItemInfo(itemUI: Node, itemData: any, index: number, self: any) {
        //  console.log("itemData = ", itemData)
        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].typename + ""
            let layer = itemUI.getChildByName("Layout")
            layer!.removeAllChildren()
            if (itemData[0].cdKey > 0) {
                let timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", itemData[0].cdKey)
                find("titl2/cdtime", itemUI)!.active = true
                find("titl2/cdtime", itemUI)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, timeData.dataKey, timeData.cdTime)
            } else {
                find("titl2/label", itemUI)!.active = false
                find("titl2/timeIcon", itemUI)!.active = false
                find("titl2/cdtime", itemUI)!.active = false
            }

            if (itemData.length < 3) {
                layer!.getComponent(Layout)!.type = Layout.Type.HORIZONTAL
                layer!.getComponent(UITransform)!.height = 260 
            }else{
                layer!.getComponent(UITransform)!.height = 200 * Math.ceil(itemData.length / 3)
            }
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                self.addPrefab(Const.Prefabs.ShopMoneyItem, layer!, (item: any) => { }, { data: element })
            }
            ///   self.tujianInfoScroll.getComponent(ScrollViewUtil).resizeContentNodeAuto()
        }
    }



}

