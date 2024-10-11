import { _decorator, Node, Prefab, instantiate, Sprite, find, ProgressBar, Label } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;

@ccclass('PropMinInfo')
export class PropMinInfo extends BaseView {

    @property({ type: Label, displayName: "道具名字label" }) nameLab: Label = null!
    @property({ type: Label, displayName: "道具详情label" }) infoLab: Label = null!


    _propdata: any = null

    start() {

    }

    show(args: any) {
        super.show(args)
        this._propdata = this._layerData.propdata
        this.nameLab.string = this._propdata.name + "  " + this._propdata.luna + "级"
        this.infoLab.string = this._propdata.mask
        this.addPrefab(Const.Prefabs.PropItem, find("root/Node1/Node", this.node)!, (item: any) => {
            item.getComponent(PropItem).setData(this._propdata.id, PropItemFlag.HideName)
            item.getComponent(PropItem).setSize(100)
            item.getComponent(PropItem).setBg(Const.resPath.Tujian + "itembg2")
        })
        if (this._propdata.atom != "") {
            find("root/Node2", this.node)!.active = true
            let atomArr = (this._propdata.atom + "").split(",")
            find("root/Node2/Layout", this.node)!.removeAllChildren()
            atomArr.forEach((element: any) => {
                this.addPrefab(Const.Prefabs.PropItem, find("root/Node2/Layout", this.node)!, (item: any) => {
                    item.getComponent(PropItem).setData(element, PropItemFlag.HideName)
                    item.getComponent(PropItem).setSize(90)
                })
            });
        } else {
            find("root/Node2", this.node)!.active = false
        }
    }

    setData(id: any) {
        let data = tables.ins().getTableValueByID(Const.Tables.prop, id)
    }

}

