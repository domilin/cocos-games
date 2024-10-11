import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { composeModel, managerInfoTypeArr } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('ManagerLayer')
export class ManagerLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    taskList: Node = null!;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);

        this.initUI();

        this.on(GD.event.managerCreateTask, this.managerCreateTaskRet, this);

    }

    close() {
        super.close();

        this.off(GD.event.managerCreateTask, this);
    }

    managerCreateTaskRet() {
        this.scrollViewRefreshList(this.taskList);
    }

    initUI() {
        let tb = tables.ins().getTable(Const.Tables.manager);
        this.scrollViewSetData(this.taskList, tb, this.refreshTaskItem.bind(this));
        let index = -1;
        for (let i = 0; i < composeModel.managerArr.length; i++) {
            let manager = composeModel.managerArr[i];
            if (!manager.get) {
                index = i;
                break;
            }
        }
        this.scrollViewScrollToIndex(this.taskList, index + 4, 0.6);
    }

    refreshTaskItem(itemUI: Node, row: any) {
        // @ts-ignore
        itemUI.index = row.id - 1;
        this.bindButton(itemUI, this.onClickTaskItem);
        this.setString(find("id", itemUI), row.id);
        this.setString(find("info", itemUI), managerInfoTypeArr[row.taskType - 1].format(row.p1));
        let propId = row.price[0];
        let propNum = row.price[1];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        this.setSpriteFrame2(find("prop/icon", itemUI)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);

        this.setString(find("prop/num", itemUI), "x" + propNum);

        let lockNode = find("lock", itemUI)!;
        let doneNode = find("done", itemUI)!;
        let getNode = find("get", itemUI)!;
        doneNode.active = false;
        getNode.active = false;

        let manager = composeModel.managerArr[row.id - 1];

        if (manager) {
            lockNode.active = false;
            let val = composeModel.getManagerVal(manager);
            this.setProgressBar(find("progress", itemUI)!, val / row.p1);
            this.setString(find("progress/num", itemUI), val + "/" + row.p1);
            if (val >= row.p1) {
                if (manager.get) {
                    doneNode.active = true;
                } else {
                    getNode.active = true;
                }
            }
        } else {
            // 还未解锁
            lockNode.active = true;
        }
    }

    onClickTaskItem(btn: Button) {
        // @ts-ignore
        let index = btn.node.index;
        let manager = composeModel.managerArr[index];
        if (!manager) {
            return;
        }
        let row = tables.ins().getTableValueByID(Const.Tables.manager, manager.id);
        if (composeModel.getManagerVal(manager) >= row.p1 && !manager.get) {
            composeModel.managerGetAward(index,UtilPub.convertToWorldSpace(find("prop/icon",btn.node!)!));
            this.scrollViewRefreshItemUIByIndex(this.taskList, index);
        }
    }

    onClickBtnClose() {
        this.close();
    }


}

