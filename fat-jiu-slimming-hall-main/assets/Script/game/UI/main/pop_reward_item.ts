import { _decorator, Component, Node, UITransform } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { PropItem, PropItemFlag } from '../Dialog/PropItem';
const { ccclass, property } = _decorator;

@ccclass('pop_reward_item')
export class pop_reward_item extends BaseView {

    @property({ type: Node, tooltip: "list" }) list: Node = null!;
    @property({ type: Node, tooltip: "root" }) root: Node = null!;


    start() {

    }

    update(deltaTime: number) {

    }


    show(args: any) {
        super.show(args)
        let rewardData = this._layerData.rewardData
        this.list.removeAllChildren()
        rewardData.forEach((element: any) => {
            this.addPrefab(Const.Prefabs.PropItem, this.list, (propItem: any) => {
                propItem.getComponent(PropItem).setData(element[0], PropItemFlag.HideName | PropItemFlag.ShowNum , element[1]).setSize(120)
            })
        });

        this.root.position = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(this._layerData.pos!)
    }
}


