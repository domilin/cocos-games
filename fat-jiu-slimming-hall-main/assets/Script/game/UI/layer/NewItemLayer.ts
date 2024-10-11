import { find, instantiate, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { composeModel } from '../../comm/composeModel';
import { handIndexs } from '../../data/handData';
const { ccclass, property } = _decorator;

@ccclass('NewItemLayer')
export class NewItemLayer extends BaseView {


    @property({ type: Node })
    nameNode: Node = null!;
    @property({ type: Node })
    lvNode: Node = null!;
    @property({ type: Node })
    iconNode: Node = null!;
    @property({ type: Node })
    infoNode: Node = null!;

    @property({ type: Node })
    produceLayer: Node = null!;
    @property({ type: Node })
    propItem: Node = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    onLoad() {
        this.propItem.parent = this.node;
        this.propItem.active = false;
    }

    show(propId: any) {
        super.show(propId);

        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        this.setString(this.nameNode, propRow.name);
        this.setString(this.lvNode, propRow.luna + localText.lv);
        this.setSpriteFrame2(this.iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this.setString(this.infoNode, propRow.mask);

        this.bindButton(this.btnClose, this.onClickBtnClose);

        let handIndex = composeModel.getHandIndex();
        if (handIndex == handIndexs.composeGetNew) {
            composeModel.addHandIndex();
            let obj: any = {};
            obj.id = handIndex;
            obj.node = this.btnClose;
            obj.delayTime = 0.5;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }

        this.produceLayer.removeAllChildren();
        if (propRow.atom) {
            let arr = (propRow.atom + "").split(",");
            for (let i = 0; i < arr.length; i++) {
                let id = parseInt(arr[i]);
                let itemUI = instantiate(this.propItem);
                itemUI.parent = this.produceLayer;
                itemUI.active = true;
                let pRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
                this.setString(find("name", itemUI), pRow.name);
                this.setSpriteFrame2(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + pRow.icon);
            }
        }
    }

    onClickBtnClose() {
        this.close();
        composeModel.closeHandLayer();
        this.emit(GD.event.refreshHandLayer);
    }

}

