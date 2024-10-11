import { _decorator, Node, Label, find, Sprite, SpriteFrame, tween, v3, UITransform, UIOpacity, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { SceneData } from '../../comm/SceneData';
const { ccclass, property } = _decorator;

@ccclass('FeijiuInfoDialog')
export class FeijiuInfoDialog extends BaseView {
    @property({ type: Node }) icon: Node = null!;

    _propdata: any = null

    show(args: any) {
        super.show(args)
        this.initInfo()
    }

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    initInfo() {
        let data = this._layerData.roleData
        this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.roleIcon + data.icon, undefined, 300)

        let scene_skin = tables.ins().getTableValueByID(Const.Tables.scene_skin, data.skin)

        let tmd = find("root/di1/tmd", this.node)!
        find("limitLabel", tmd)!.getComponent(Label)!.string = "购买【" + scene_skin.name + "】"

        if (SceneData.ins.getSceneSkinById(data.skin) == GSceneSkinState.gotted) {
            this.icon.getComponent(Sprite)!.color = Const.color.white
            this.icon.getComponent(UIOpacity)!.opacity = 255
            find("root/titl2/Label", this.node)!.getComponent(Label)!.string = data.name
            find("root/infoLabel", this.node)!.getComponent(Label)!.string = data.desc
            let bodyinfo = data.body.split(",")
            find("label1", tmd)!.getComponent(Label)!.string = "身高：" + bodyinfo[0]
            find("label2", tmd)!.getComponent(Label)!.string = "体重：" + bodyinfo[1]
            find("label3", tmd)!.getComponent(Label)!.string = "生日：" + bodyinfo[2]
            find("label4", tmd)!.getComponent(Label)!.string = "星座：" + bodyinfo[3]
        } else {
            this.icon.getComponent(Sprite)!.color = Const.color.black
            this.icon.getComponent(UIOpacity)!.opacity = 80
            find("root/titl2/Label", this.node)!.getComponent(Label)!.string = "?????"
            find("root/infoLabel", this.node)!.getComponent(Label)!.string = "?????"
            find("label1", tmd)!.getComponent(Label)!.string = "身高：" + "?????"
            find("label2", tmd)!.getComponent(Label)!.string = "体重：" + "?????"
            find("label3", tmd)!.getComponent(Label)!.string = "生日：" + "?????"
            find("label4", tmd)!.getComponent(Label)!.string = "星座：" + "?????"
        }
    }

}

