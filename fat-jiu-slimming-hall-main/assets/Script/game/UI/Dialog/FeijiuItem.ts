import { _decorator, Node, Label, find, Sprite, SpriteFrame, tween, v3, UITransform, color, UIOpacity, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { SceneData } from '../../comm/SceneData';
const { ccclass, property } = _decorator;

@ccclass('FeijiuItem')
export class FeijiuItem extends BaseView {
    @property({ type: Node }) icon: Node = null!;

    _propdata: any = null

    start() {
        let data = this._layerData.roleData
        this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.roleIcon + data.icon, undefined, 200)

        if (SceneData.ins.getSceneSkinById(data.skin) == GSceneSkinState.gotted) {
            this.icon.getComponent(Sprite)!.color = Const.color.white
            this.icon.getComponent(UIOpacity)!.opacity = 255
            find("roleItembg/name", this.node)!.getComponent(Label)!.string = data.name
        } else {
            this.icon.getComponent(Sprite)!.color = Const.color.black
            this.icon.getComponent(UIOpacity)!.opacity = 80
            find("roleItembg/name", this.node)!.getComponent(Label)!.string = "?????"
        }
        this.bindButton(this.node, () => {
            uiManager.instance.showDialog(Const.Dialogs.FeijiuInfoDialog, { roleData: data });
        })
    }

}

