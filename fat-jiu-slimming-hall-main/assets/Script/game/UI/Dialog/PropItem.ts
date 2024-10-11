import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, SpriteFrame } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
const { ccclass, property } = _decorator;


export enum PropItemFlag {
    HideName = 1,
    HideBg = 1 << 2,
    TouchInfo = 1 << 3,
    ShowLevel = 1 << 4,
    ShowMinInfo = 1 << 5,
    HideInfo = 1 << 6,
    ShowNum = 1 << 7,

}
@ccclass('PropItem')
export class PropItem extends BaseView {
    @property({ type: Node, tooltip: "背景" }) bg: Node = null!;
    @property({ type: Node, tooltip: "icon" }) icon: Node = null!;
    @property({ type: Label, tooltip: "名字" }) nameLab: Label = null!;
    @property({ type: Node, tooltip: "感叹号" }) gantan: Node = null!;
    @property({ type: Node, tooltip: "等级" }) lvLabel: Node = null!;

    @property({ type: Label, tooltip: "数量" }) numLabel: Label = null!;

    _propid: number = 0
    _propdata: any = null
    start() {

    }

    show(args: any) {
        super.show(args)
    }

    setData(id: number, flag: number = 0, num: number = 0) {
        //console.log("setData id = ", id)
        this._propid = id
        let data = tables.ins().getTableValueByID(Const.Tables.prop, id)
        this._propdata = data

        if (!this._propdata) {
            this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.propItembg + "wenhao", () => { }, 120)
            this.nameLab.node.active = true
            this.nameLab.string = id + ""
            this.gantan.active = false
            this.lvLabel.active = false
            this.numLabel.node.active = false
            return this
        }
        if (flag & PropItemFlag.HideInfo) {
            this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.propItembg + "wenhao", () => { }, 120)
            this.nameLab.node.active = false
            this.gantan.active = false
            this.lvLabel.active = false
            this.numLabel.node.active = false
            return this
        }

        this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.icon + data.icon, () => { }, 150)
        this.nameLab.string = this._propdata!.name

        if (flag & PropItemFlag.TouchInfo) {
            this.bindButton(this.node, this.onOpenPropInfo)
            this.gantan.active = true
        } else {
            this.gantan.active = false
        }

        if (flag & PropItemFlag.ShowMinInfo) {
            this.bindButton(this.node, this.onOpenPropMinInfo)
        }

        if (flag & PropItemFlag.ShowLevel) {
            this.lvLabel.active = true
            this.lvLabel.getComponent(Label)!.string = data.luna
        } else {
            this.lvLabel.active = false
        }

        if (flag & PropItemFlag.HideName) {
            this.nameLab.node.active = false
        }

        if (flag & PropItemFlag.HideBg) {
            this.bg.getComponent(Sprite)!.spriteFrame = null
        }

        if (flag & PropItemFlag.ShowNum) {
            this.numLabel.node.active = true
            this.numLabel.string = "X" + num
        } else {
            this.numLabel.node.active = false
        }
        // this.numLabel.string = id+""
        // this.numLabel.node.active = true

        return this
    }

    setSkinData(id: number) {
        this.gantan.active = false
        this.numLabel.node.active = false
        this.lvLabel.active = false
        this.bg.getComponent(Sprite)!.spriteFrame = null

        let data = tables.ins().getTableValueByID(Const.Tables.scene_skin, id)
        this._propdata = data

        this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.icon + data.icon0, () => { }, 300)
        this.nameLab.string = data.name
        return this
    }

    setSize(width: number) {
        let bgWidth = this.bg.getComponent(UITransform)!.width
        let bgHeight = this.bg.getComponent(UITransform)!.height
        let scale = width / bgWidth
        this.bg.scale = v3(scale, scale, 1)
        this.node.getComponent(UITransform)!.width = bgWidth * scale
        this.node.getComponent(UITransform)!.height = bgHeight * scale
        return this
    }

    setIconScale(scale: number) {
        this.icon.scale = v3(scale, scale, scale)
        return this
    }

    setBg(path: string | SpriteFrame) {
        if (path instanceof SpriteFrame) {
            this.bg.getComponent(Sprite)!.spriteFrame = path
        } else {
            this.setSpriteFrame(this.bg.getComponent(Sprite)!, path)
        }
        return this
    }

    setItemBg(path: number) {
        this.setSpriteFrame(this.bg.getComponent(Sprite)!, Const.resPath.propItembg + "propItembg" + path)
        return this
    }

    onOpenPropInfo() {
        if (this._propdata.type <= 6 || this._propdata.type > 100 || this._propdata.type == 15 || this._propdata.type == 16 || this._propdata.type == 17 || this._propdata.type == 18) {
            uiManager.instance.showDialog(Const.Dialogs.PropDetailLayer, this._propdata.id);
        } else {
            uiManager.instance.showDialog(Const.Dialogs.PropItemInfo, { propdata: this._propdata })
        }
    }

    onOpenPropMinInfo() {
        uiManager.instance.showDialog(Const.Dialogs.PropMinInfo, { propdata: this._propdata })
    }

    getPropId() {
        return this._propid
    }
}

