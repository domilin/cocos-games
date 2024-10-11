import { Button, find, instantiate, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { TujianState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('PropDetailLayer')
export class PropDetailLayer extends BaseView {


    @property({ type: Node })
    nameNode: Node = null!;
    @property({ type: Node })
    propLayer: Node = null!;
    @property({ type: Node })
    propItem: Node = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    bottomLayer: Node = null!;
    @property({ type: Node })
    fromList: Node = null!;

    propId: number = 0;

    onLoad() {
        this.propItem.parent = this.node;
        this.propItem.active = false;
    }

    show(propId: any) {
        super.show(propId);

        UtilPub.log("show propId:" + propId);
        this.initUI(propId);
    }

    initUI(propId: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        this.propId = propId;
        this.setString(this.nameNode, propRow.sonname);

        this.propLayer.removeAllChildren();
        let arr = this.getPropRowArr();
        for (let i = 0; i < arr.length; i++) {
            let itemUI = instantiate(this.propItem);
            itemUI.active = true;
            itemUI.parent = this.propLayer;
            let pRow = arr[i];
            let createIcon = find("create", itemUI)!;
            createIcon.active = false;
            let wenhaoNode = find("wenhao", itemUI)!;
            wenhaoNode.active = false;
            if (pRow.anc || pRow.fair) {
                createIcon.active = true;
            }

            let iconNode = find("icon", itemUI)!;
            iconNode.active = true;
            this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + pRow.icon);
            this.setString(find("lv", itemUI), pRow.luna);
            let bgName = "grid_normal";
            if (pRow.id == propId) {
                bgName = "grid_chose";
            } else {
                if (userData.isGetPropTujian(pRow.id) == TujianState.unGet) {
                    wenhaoNode.active = true;
                    iconNode.active = false;
                    createIcon.active = false;
                }
            }

            this.setSpriteFrame2(find("bg", itemUI)!.getComponent(Sprite)!, Const.resPath.composeIcon + "prop_detail/" + bgName);
            this.bindButton(itemUI, this.onClickPropItem);
            // @ts-ignore
            itemUI.propRow = pRow;
        }

        arr = this.getPropFromArr();
        if (arr.length > 0) {
            this.bottomLayer.active = true;
            this.scrollViewSetData(this.fromList, arr, this.refreshFromItemUI.bind(this));
        } else {
            this.bottomLayer.active = false;
        }

        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    refreshFromItemUI(itemUI: Node, pRow: any) {
        // @ts-ignore
        itemUI.propRow = pRow;
        this.setSpriteFrame2(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + pRow.icon);
        this.bindButton(itemUI, this.onClickBtnFromItem);
    }

    getPropRowArr() {
        let arr: any = [];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, this.propId);
        let tb = tables.ins().getTable(Const.Tables.prop);
        for (let i in tb) {
            let row = tb[i];
            if (propRow.type == row.type && propRow.typeson == row.typeson) {
                arr.push(row);
            }
        }
        return arr;
    }

    getPropFromArr() {
        let arr: any = [];
        let tb = tables.ins().getTable(Const.Tables.prop);
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, this.propId);
        let tempId = this.propId - propRow.luna + 1;

        let firstPropId = -1;
        let firstPropRow = tables.ins().getTableValueByID(Const.Tables.prop, tempId);
        if (tempId != this.propId && firstPropRow && firstPropRow.type == propRow.type && firstPropRow.typeson == propRow.typeson) {
            firstPropId = tempId;
        }

        let typeFlagObj: any = {};
        for (let i in tb) {
            let row = tb[i];
            let type = row.type * 10000 + row.typeson;
            if (row.fair == this.propId || row.fair == firstPropId) {
                if (!typeFlagObj[type]) {
                    typeFlagObj[type] = 1;
                    arr.push(row);
                }
                continue;
            }
            if (row.atom) {
                let idArr = (row.atom + "").split(",");
                if (idArr.indexOf(this.propId + "") != -1 || idArr.indexOf(firstPropId + "") != -1) {
                    if (!typeFlagObj[type]) {
                        typeFlagObj[type] = 1;
                        arr.push(row);
                    }
                    continue;
                }
            }
            if (row.blessId == this.propId) {
                if (!typeFlagObj[type]) {
                    typeFlagObj[type] = 1;
                    arr.push(row);
                }
            }
        }

        return arr;
    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        // if (userData.isGetPropTujian(propRow.id) == TujianState.unGet) {
        //     composeModel.showToast(localText.lockNoLook);
        //     return;
        // }
        uiManager.instance.showDialog(Const.Dialogs.PropMinInfo, { propdata: propRow });
    }

    onClickBtnFromItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        if (propRow.tan) {
            uiManager.instance.showDialog(Const.Dialogs.PropItemInfo, { propdata: propRow });
        } else {
            this.show(propRow.id);
        }
    }

    onClickBtnClose() {
        this.close();
    }

}

