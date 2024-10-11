import { Button, find, Label, Node, Sprite, tween, UITransform, v3, Vec3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { composeModel } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('FuBagReceiveLayer')
export class FuBagReceiveLayer extends BaseView {


    @property({ type: Node })
    fuBag: Node = null!;

    @property({ type: Node })
    btnSure: Node = null!;

    bagId: number = 0;
    _curIndex = 1

    _rewardList: any = []

    start() {
        this.bindButton(this.btnSure, this.onClickBtnSure);
        this.bindButton(this.fuBag, this.onClickFuBag);

    }

    show(args: any) {
        super.show(args);
        this.bagId = this._layerData.id;
        this.btnSure.active = false
        this.fuBag.active = true
        this._curIndex = 1
        this._rewardList = []
        for (let i = 1; i <= 3; i++) {
            find("root/item" + i, this.node)!.active = false
        }
    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        composeModel.openPropInfoLayer(propRow.id);
    }

    onClickBtnSure() {
        for (let index = 0; index < this._rewardList.length; index++) {
            const element = this._rewardList[index];
            console.log("prop : " + element[0] + "  num: " + element[1])
            composeModel.addPropNum(element[0], element[1], this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
        }
        this.close();
    }

    onClickFuBag() {
        let item = find("root/item" + this._curIndex, this.node)!
        item.active = true

        let fuBagData = tables.ins().getTableValueByID(Const.Tables.fuBag, this.bagId).price
        let curReward = fuBagData[Math.floor(fuBagData.length * Math.random())]
        let propId = curReward[0]
        let num = curReward[1]
        this._rewardList.push(curReward)
        let propData = tables.ins().getTableValueByID(Const.Tables.prop, propId)
        this.setSpriteFrame(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + propData.icon, undefined, 100)
        find("num", item)!.getComponent(Label)!.string = "x" + num
        tween(item).set({ scale: v3(0, 0, 0) }).to(0.2, { scale: v3(1.1, 1.1, 1.1) }).to(0.1, { scale: v3(1, 1, 1) }).call(() => {

        }).start()
        this._curIndex++

        if (this._curIndex > 3) {
            this.fuBag.active = false
            this.btnSure.active = true
        }
    }


}

