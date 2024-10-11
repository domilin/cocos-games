import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('TaskListLayer')
export class TaskListLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;
    @property({ type: Node })
    listNode: Node = null!;

    @property({ type: Node })
    listContent: Node = null!;

    @property({ type: Node })
    tempBg: Node = null!;


    @property({ type: Node })
    tempItem: Node = null!;


    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);
        this.initUI();
    }

    initUI() {
        let arr2 = composeModel.createTask2();

        this.listContent.removeAllChildren()
        for (const key in arr2) {
            if (Object.prototype.hasOwnProperty.call(arr2, key)) {
                const element = arr2[key];
                let tempBg = instantiate(this.tempBg)
                tempBg.position = Vec3.ZERO
                tempBg.parent = this.listContent
                tempBg.active = true
                let taskData = tables.ins().getTableValueByID(Const.Tables.taskUnlock, parseInt(key))
                this.setString(find("title", tempBg)!, taskData.name);
                let progress = composeModel.getTaskProgress(parseInt(key))
                this.setString(find("ProgressBar/roomBar/Label", tempBg)!, Math.floor(progress * 100) + "%");
                find("ProgressBar/roomBar", tempBg)!.getComponent(ProgressBar)!.progress = progress
                for (let index = 0; index < element.length; index++) {
                    let item = element[index];
                    let tempItem = instantiate(this.tempItem)
                    tempItem.position = Vec3.ZERO
                    tempItem.parent = find("Layout", tempBg)!
                    this.refreshTaskItem(tempItem, item)
                }
                let giftBtn = find("ProgressBar/gift", tempBg)!
                let btnReceive = find("btnReceive", tempBg)!

                this.bindButton(giftBtn, () => {
                    //弹出奖励提示框
                    let pos = UtilPub.convertToWorldSpace(giftBtn)
                    uiManager.instance.showDialog(Const.Dialogs.pop_reward_item, { rewardData: taskData.taskReward, pos: pos })
                })
                if (element.length > 0) {
                    btnReceive.active = false
                } else {
                    btnReceive.active = true
                    // tween(giftBtn).to(0.5, { scale: v3(1.3, 1.3, 1.3) }).to(0.5, { scale: v3(1, 1, 1) }).union().repeatForever().start()
                    this.bindButton(btnReceive, () => {
                        for (let i = 0; i < taskData.taskReward.length; i++) {
                            const element = taskData.taskReward[i];
                            composeModel.addPropNum(element[0], element[1])
                        }
                        composeModel.setTaskGetReward(parseInt(key))
                        this.initUI()
                    })
                }
            }
        }
        // let arr = composeModel.taskArr;
        // this.scrollViewSetData(this.listNode, arr, this.refreshTaskItem.bind(this));
    }

    refreshTaskItem(itemUI: Node, task: any) {
        let chs = find("propLayer", itemUI)!.children;
        let done = true
        chs.forEach((propItem: Node, i: number) => {
            let prop = task.propArr[i];
            if (prop) {
                propItem.active = true;
                let propRow = tables.ins().getTableValueByID(Const.Tables.prop, prop.id);
                if (!propRow) {
                    propItem.active = false;
                    return;
                }
                this.setSpriteFrame2(find("icon", propItem)!.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
                let hasInfo = composeModel.getRoomDataHasInfoById(prop.id);
                let showNum = hasInfo.num;
                if (showNum >= prop.num) {
                    showNum = prop.num;
                }
                this.setString(find("num", propItem), showNum + "/" + prop.num);
                let bgNode = find("bg", propItem)!;
                let gouNode = find("gou", propItem)!;
                if (hasInfo.num >= prop.num) {
                    gouNode.active = true;
                    bgNode.active = true;
                } else {
                    gouNode.active = false;
                    bgNode.active = false;
                    done = false
                }
                // @ts-ignore
                propItem.propRow = propRow;
                this.bindButton(propItem, this.onClickTaskPropItem);

            } else {
                propItem.active = false;
            }
        });

        this.setString(find("awardLayer/prop/num", itemUI)!, task.starNum);

        this.setString(find("id", itemUI)!, "id" + task.id);


        let btnRefresh = find("btnRefresh", itemUI)!;
        let btnFinish = find("btnFinish", itemUI)!;


        // @ts-ignore
        btnRefresh.task = task;
        // @ts-ignore
        btnFinish.task = task;

        this.bindButton(btnRefresh, this.onClickBtnRefresh);
        this.bindButton(btnFinish, this.onClickBtnFinish);




        if (done) {
            btnFinish.active = true
            btnRefresh.active = false
        } else {
            btnFinish.active = false
            btnRefresh.active = true
        }

        if (composeModel.getHandIndex() >= 8) {

        } else {
            btnRefresh.active = false;
            btnFinish.active = false

        }
    }


    onClickTaskPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        composeModel.openPropInfoLayer(propRow.id);
    }


    onClickBtnFinish(btn: Button) {

        // @ts-ignore
        let task = btn.node.task;

        this.emit(GD.event.onClickTaskDone, { node: btn.node })

        this.close()
    }


    onClickBtnRefresh(btn: Button) {
        this.close()
        return
        // @ts-ignore
        let task = btn.node.task;

        composeModel.openAd("刷新任务", (isAward: boolean) => {
            if (isAward) {
                composeModel.refreshTask(task);
                this.initUI();
            }
        });
    }

    onClickBtnClose() {
        this.close();
    }

}

