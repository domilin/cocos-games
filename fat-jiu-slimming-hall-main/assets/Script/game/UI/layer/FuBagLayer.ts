import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { composeModel } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('FuBagLayer')
export class FuBagLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    propList: Node = null!;
    @property({ type: Node })
    btnSure: Node = null!;

    bagId: number = 0;

    start() {

        this.bindButton(this.btnSure, this.onClickBtnSure);
        this.bindButton(this.btnClose, this.onClickBtnClose);

    }

    show(args: any) {
        super.show(args);

        this.bagId = args;

        this.initUI();

    }

    initUI() {
        let row = tables.ins().getTableValueByID(Const.Tables.fuBag, this.bagId);
        this.scrollViewSetData(this.propList, row.price, this.refreshPropItem.bind(this));
    }

    refreshPropItem(itemUI: Node, prop: any) {
        let id = prop[0];
        let num = prop[1];
        let row = tables.ins().getTableValueByID(Const.Tables.prop, id);

        this.setSpriteFrame2(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + row.icon);
        this.setString(find("num", itemUI), num);

        let infoNode = find("info", itemUI)!;
        if (composeModel.propCanCreateNewProp(id)) {
            infoNode.active = true;
            this.bindButton(itemUI, this.onClickPropItem);
        } else {
            infoNode.active = false;
        }

    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        composeModel.openPropInfoLayer(propRow.id);
    }

    onClickBtnSure() {
        this.close();
    }

    onClickBtnClose() {
        this.close();
    }


}

