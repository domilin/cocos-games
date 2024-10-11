import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel, propIds } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('BagLayer')
export class BagLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    roomList: Node = null!;

    @property({ type: Node })
    capcityNode: Node = null!;

    row: number = 0;
    col: number = 0;
    getOutArr: any;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);
        this.row = args.row;
        this.col = args.col;

        this.getOutArr = [];

        this.initUI();

    }

    initUI() {
        let bagRoomData = composeModel.roomArr[this.row][this.col];
        let arr = JSON.parse(JSON.stringify(bagRoomData.roomArr));

        let hasNum = 0;
        for (let room of arr) {
            if (room.id > 0) {
                hasNum++;
            }
        }
        this.setString(this.capcityNode, localText.capcity.format(hasNum, arr.length));

        let nextRow = tables.ins().getTableValueByID(Const.Tables.bagGrid, arr.length + 1);
        if (nextRow) {
            arr.push(null);
        }
        this.scrollViewSetData(this.roomList, arr, this.refreshGridItem.bind(this));
    }

    refreshGridItem(itemUI: Node, info: any, index: number) {
        let btnAdd = find("btnAdd", itemUI)!;
        let iconNode = find("icon", itemUI)!;
        let addNode = find("add", itemUI)!;
        let btnInfo = find("btnInfo", itemUI)!;
        if (info) {
            addNode.active = false;
            btnAdd.active = false;
            if (info.id > 0) {
                iconNode.active = true;
                btnInfo.active = true;
                let propRow = tables.ins().getTableValueByID(Const.Tables.prop, info.id);
                this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
                // @ts-ignore
                btnInfo.propRow = propRow;
                this.bindButton(btnInfo, this.onClickBtnInfo);
            } else {
                iconNode.active = false;
                btnInfo.active = false;
            }
        } else {
            addNode.active = true;
            btnInfo.active = false;
            btnAdd.active = true;
            iconNode.active = false;
            this.bindButton(btnAdd, this.onClickBtnAdd);
            let bagRow = tables.ins().getTableValueByID(Const.Tables.bagGrid, index + 1);
            this.setString(find("num", btnAdd), bagRow.coin);
        }
        this.bindButton(itemUI, this.onClickGridItem);
    }

    onClickBtnAdd(btn: Button) {
        let bagRoomData = composeModel.roomArr[this.row][this.col];
        let bagRow = tables.ins().getTableValueByID(Const.Tables.bagGrid, bagRoomData.roomArr.length + 1);
        if (!bagRow) {
            return;
        }

        if (composeModel.getPropNumById(propIds.coin) < bagRow.coin) {
            // 金币不足
            return;
        }

        // 扣除金币
        composeModel.subPropNum(propIds.coin, bagRow.coin);
        // 增加格子
        composeModel.bagRoomAddGrid(this.row, this.col);

        this.initUI();
    }

    onClickGridItem(btn: Button) {
        // @ts-ignore
        let roomData = btn.node.item;
        // @ts-ignore
        let index = btn.node.index;

        UtilPub.log(roomData, index);
        if (!roomData || !roomData.id) {
            return;
        }

        let ret: any = composeModel.getOutDataFromRoomBag(index, this.row, this.col);
        if (!ret) {
            // 取出失败
            UtilPub.log("棋盘上没有空房间了");
            return;
        }

        // 取出成功，记录一下，等待页面关闭，一起显示飞出的动画
        this.getOutArr.push(ret);

        this.initUI();

    }

    onClickBtnInfo(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow
        composeModel.openPropInfoLayer(propRow.id);
    }

    onClickBtnClose() {
        this.close();

        let obj: any = {};
        obj.row = this.row;
        obj.col = this.col;
        obj.getOutArr = this.getOutArr;
        this.emit(GD.event.composeGetOutFromBag, obj);
    }


}

