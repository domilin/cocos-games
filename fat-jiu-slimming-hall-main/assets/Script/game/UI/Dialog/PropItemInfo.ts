import { _decorator, Node, Prefab, instantiate, Sprite, find, ProgressBar, Label, SpriteComponent, SpriteFrame, v3, UITransform } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;

@ccclass('PropItemInfo')
export class PropItemInfo extends BaseView {
    @property({ type: Node, tooltip: "当前项" }) curItem: Node = null!;
    @property({ type: Node, tooltip: "当前项" }) curItemGrid: Node = null!;

    @property({ type: Node, tooltip: "列表" }) listLayer: Node = null!;
    @property({ type: Label, displayName: "道具名字label" }) nameLab: Label = null!

    @property({ type: SpriteFrame }) iconbg: SpriteFrame = null!
    @property({ type: SpriteFrame }) iconbg2: SpriteFrame = null!


    _propdata: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.close)
    }

    show(args: any) {
        super.show(args)
        this._propdata = this._layerData.propdata
        this.curItem.removeAllChildren()
        this.curItemGrid.removeAllChildren()
        if (this._propdata.type < 10) {
            this.addPrefab(Const.Prefabs.PropItem, this.curItem, (item: any) => {
                item.getComponent(PropItem).setData(this._propdata.id, PropItemFlag.ShowLevel | PropItemFlag.HideName).setBg(this.iconbg)
            })
        } else {
            let xilie = tables.ins().getTableValuesByType(Const.Tables.prop, "type", this._propdata.type)
            if (xilie.length > 0) {
                let parent = xilie.length >= 4 ? this.curItemGrid : this.curItem
                let maxSize = xilie.length >= 4 ? 115 : 170
                let minSize = xilie.length >= 4 ? 105 : 150
                xilie.forEach((element: any) => {
                    this.addPrefab(Const.Prefabs.PropItem, parent, (item: any) => {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.ShowLevel | PropItemFlag.HideName)
                        if (element.id == this._propdata.id) {
                            item.getComponent(PropItem).setSize(maxSize).setBg(this.iconbg)
                        } else {
                            item.getComponent(PropItem).setSize(minSize).setBg(this.iconbg2)
                        }
                        this.addButtonHander(item, this.node, "PropItemInfo", "changePropInfo", element.id)
                    })
                });
                if (xilie.length >= 4) {
                    this.curItemGrid.getComponent(UITransform)!.height = 130 * Math.ceil(xilie.length / 4)
                }
            }
        }

        this.initPropList(this._propdata)
    }

    changePropInfo(event: any, id: number) {
        let propData = tables.ins().getTableValueByID(Const.Tables.prop, id)
        this.initPropList(propData)

        let children = this.curItemGrid.children
        children.forEach(element => {
            let propItem = element.getComponent(PropItem)
            if (propItem!.getPropId() == id) {
                propItem!.setSize(115)
            } else {
                propItem!.setSize(105)
            }
        });

        let children2 = this.curItem.children
        children2.forEach(element => {
            let propItem = element.getComponent(PropItem)
            if (propItem!.getPropId() == id) {
                propItem!.setSize(170)
            } else {
                propItem!.setSize(150)
            }
        });
    }

    initPropList(propData: any) {
        this.nameLab.string = propData.name
        this.listLayer.removeAllChildren()
        if (propData.atom != "" && propData.atom) {
            if (propData.atom != "") {
                let atom = (propData.atom + "").split(",")
                atom.forEach((element: any) => {
                    this.addPrefab(Const.Prefabs.PropItem, this.listLayer, (item: any) => {
                        item.getComponent(PropItem).setData(element, PropItemFlag.HideBg).setSize(110)
                    })
                });
                this.listLayer.getComponent(UITransform)!.height = 110 * Math.ceil(atom.length / 4) + 15 * (Math.ceil(atom.length / 4) - 1)
            }
        }
    }

}

