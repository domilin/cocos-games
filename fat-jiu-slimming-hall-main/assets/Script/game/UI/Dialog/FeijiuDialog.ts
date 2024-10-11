import { _decorator, Node, Label, find, Sprite, SpriteFrame, tween, v3, UITransform, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { comm } from '../../../easyFramework/mgr/comm';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { SceneData } from '../../comm/SceneData';
const { ccclass, property } = _decorator;



@ccclass('FeijiuDialog')
export class FeijiuDialog extends BaseView {
    @property({ type: Node, tooltip: "角色列表详情" }) roleInfoScroll: Node = null!;

    _propdata: any = null

    _totalNum = 0
    _unlockNum = 0
    start() {
    }

    show(args: any) {
        super.show(args)
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        this.openTujianArr()
        tyqSDK.eventSendCustomEvent("查看肥啾图鉴")
    }

    openTujianArr() {

        let propData = tables.ins().getTable(Const.Tables.scene_guest)
        let dataArr: any = []

        propData.forEach((element: any) => {
            if(element.type >0){
                if (!dataArr[element.type - 1]) {
                    dataArr[element.type - 1] = []
                }
                dataArr[element.type - 1].push(element)
            }
        });
        let content = find("view/content", this.roleInfoScroll)
        content!.removeAllChildren()
        this.setScrollViewData(content!, dataArr, find("root/Layout", this.node)!, this.initItemInfo, this)

        find("root/xk/totalLabel", this.node)!.getComponent(Label)!.string = "肥啾(" + this._unlockNum + "/" + this._totalNum + ")"
    }

    initItemInfo(itemUI: Node, itemData: any, index: number, self: FeijiuDialog) {
        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].typename + ""
            let layer = itemUI.getChildByName("Layout")
            layer!.removeAllChildren()
            layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                if (SceneData.ins.getSceneSkinById(element.skin) == GSceneSkinState.gotted) {
                    self._unlockNum++
                }
                self._totalNum++
                self.addPrefab(Const.Prefabs.FeijiuItem, layer!, () => { }, { roleData: element })
            }
        }
    }


}

