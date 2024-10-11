import { _decorator, Node, Prefab, instantiate, find, Layout, UITransform, Vec3 } from 'cc';
import { Const } from '../../../config/Const';
import { GoodsType, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { composeModel } from '../../comm/composeModel';
import { SceneData } from '../../comm/SceneData';
import { PropItem, PropItemFlag } from '../Dialog/PropItem';
const { ccclass, property } = _decorator;

@ccclass('RewardLayer')
export class RewardLayer extends BaseView {
    @property({ type: Node, tooltip: "奖励列表" }) layer: Node = null!;

    _drawArr: any = []

    start() {
        this.bindButton(find("btnReward", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        this.layer.removeAllChildren()
        this._layerData.reward.forEach((element: any, index: number) => {
            if (element instanceof Array) {
                this.addProp(element[0], element[1], element[2] || GoodsType.prop)
            } else {
                this.addProp(element.propId, element.num, element.type || GoodsType.prop)
            }
        });

        if (this._layerData.reward.length <= 5) {
            this.layer.getComponent(Layout)!.type = Layout.Type.HORIZONTAL
            this.layer.getComponent(UITransform)!.height = 260
        }
    }

    addProp(id: number, num: number, type = GoodsType.prop) {
        if (type == GoodsType.prop) {
            composeModel.addPropNum(id, num, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
            this.addPrefab(Const.Prefabs.PropItem, this.layer, (item: any) => {
                item.getComponent(PropItem).setData(id, PropItemFlag.TouchInfo | PropItemFlag.HideName | PropItemFlag.ShowNum, num)
                item.getComponent(PropItem).setSize(120)
            })
        } else {
            SceneData.ins.setSceneSkinById(id, GSceneSkinState.gotted)
            this.addPrefab(Const.Prefabs.PropItem, this.layer, (item: any) => {
                item.getComponent(PropItem).setSkinData(id)
                item.getComponent(PropItem).setSize(300)
            })
        }
    }
}

