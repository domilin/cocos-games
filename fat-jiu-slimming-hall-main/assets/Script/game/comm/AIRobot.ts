import { Button, find, instantiate, Label, Node, Tween, tween, UIOpacity, v2, v3, Vec3, view } from "cc";
import { Const } from "../../config/Const";
import { GameStorageJSF } from "../../easyFramework/mgr/gameStorage";
import tables from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { canvas_game } from "../UI/canvas_game";
import { ComposeLayer } from "../UI/layer/ComposeLayer";
import { build_list } from "../UI/main/build_list";
import { build_list_item } from "../UI/main/build_list_item";
import { build_prompt } from "../UI/main/build_prompt";
import { float_star } from "../UI/main/float_star";
import { main } from "../UI/main/main";
import { scene_ui_ops } from "../UI/scene/scene_ui_ops";
import { composeModel } from "./composeModel";
import { UtilScene } from "./UtilScene";

enum AIRobotStatus {
    idle = 1,
    clickNew,
    compose,
    taskDone,
    clcikBtnBuild,
    goBuild,
    clickStar,
    clickBuild,
    clickGou,
    goCompose,
};

class AIRobot {
    private static instance: AIRobot = null!;
    public static getInstance(): AIRobot {
        if (this.instance == null) {
            this.instance = new AIRobot();
        }
        return this.instance;
    }

    canvasGame: canvas_game = null!;
    updateInterval: any = null;

    aiRobotStatus: AIRobotStatus = AIRobotStatus.idle;

    clickPos: any = null;
    composeSearchId: any = 0;
    composeTargetId: any = 0;

    buildId: number = 0;
    starCost: number = 0;

    broadcastUINode: Node = null!;
    textLayer: Node = null!;
    textItem: Node = null!;

    public initRobot() {
        this.canvasGame = find("Canvas")!.getComponent(canvas_game)!;
        this.broadcastUINode = find("Canvas2/broadcastLayer/ui")!;
        this.broadcastUINode.active = false;
        this.textLayer = find("pmd/textLayer", this.broadcastUINode)!;
        this.textItem = instantiate(this.textLayer.children[0]);
        this.textLayer.destroyAllChildren();

        if (!this.isRobot()) {
            return;
        }

        this.starCost = 0;

        this.stopUpdate();

        this.canvasGame.schedule(aiRobot.update, 2);

        this.canvasGame.scheduleOnce(() => {
            aiRobot.aiRobotStatus = AIRobotStatus.goCompose;
        }, 3);

        this.showBroadcast();
    }

    public stopUpdate() {
        aiRobot.canvasGame.unschedule(aiRobot.update);
        aiRobot.aiRobotStatus = AIRobotStatus.idle;
    }

    public goComposeLayer() {
        find("Canvas/main")?.getComponent(main)?.onClickBtnCompose();
        aiRobot.canvasGame.scheduleOnce(() => {
            aiRobot.clickPos = null;
            aiRobot.aiRobotStatus = AIRobotStatus.clickNew;
        }, 5);
    }

    public getPropNum(id: number) {
        let num = 0;
        UtilPub.for2Arr(composeModel.roomArr, (roomData: any) => {
            if (roomData.id == id) {
                num++;
            }
        });
        return num;
    }

    public hasTaskDone() {
        let task = composeModel.taskArr[0];
        if (aiRobot.getPropNum(task.propArr[0].id) > 0) {
            return true;
        }
        return false;
    }

    public showBroadcast(info?: string) {
        if (!this.isRobot()) {
            return;
        }
        this.canvasGame.scheduleOnce(() => {
            let arr = ["微", "信", "搜", "索", "：", "肥", "宅", "打", "工", "人"];
            this.textLayer.destroyAllChildren();
            for (let i in arr) {
                let text = arr[i];
                let textItem = instantiate(this.textItem);
                textItem.parent = this.textLayer;
                textItem.getComponent(Label)!.string = text;
            }
            Tween.stopAllByTarget(this.broadcastUINode);
            this.broadcastUINode.active = true;
            let pos = this.broadcastUINode.position;
            let width = view.getVisibleSize().width;
            this.broadcastUINode.position = v3(width, pos.y);
            tween(this.broadcastUINode).to(1, { position: v3(0, pos.y) }).call(() => {
                let chs = this.textLayer.children;
                for (let i = 0; i < chs.length; i++) {
                    let ch = chs[i];
                    tween(ch).delay(1 + i * 0.1).by(0.1, { position: v3(0, 50) }).by(0.1, { position: v3(0, -50) }).delay(0.9).union().repeat(2).start();
                }
            }).delay(6).to(1, { position: v3(-width, pos.y) }).call(() => {
                this.broadcastUINode.active = false;
                this.showBroadcast();
            }).start();
        }, 5 + Math.random() * 5);
    }

    update() {
        try {
            aiRobot.updateLogic();
        } catch (e) { }
    }

    updateLogic() {
        if (!aiRobot.isRobot()) {
            aiRobot.stopUpdate();
            return;
        }
        switch (aiRobot.aiRobotStatus) {
            case AIRobotStatus.clickNew:
                if (aiRobot.clickPos == null) {
                    aiRobot.clickPos = aiRobot.getClickNewPos();
                }
                if (composeModel.getEmptyRoomPos() && aiRobot.clickPos && !composeModel.roomArr[aiRobot.clickPos.row][aiRobot.clickPos.col].cdSum) {
                    // 可点击
                    aiRobot.composeClickRoomItem(aiRobot.clickPos.row, aiRobot.clickPos.col);
                    return;
                }
                // 自动合成需要的任务物品
                let needId = composeModel.taskArr[0].propArr[0].id;
                aiRobot.composeTargetId = needId;
                aiRobot.aiRobotStatus = AIRobotStatus.compose;
                break;
            case AIRobotStatus.compose:
                if (aiRobot.hasTaskDone()) {
                    aiRobot.aiRobotStatus = AIRobotStatus.taskDone;
                    return;
                }
                let searchId = aiRobot.composeTargetId;
                let retInfo = null;
                while (true) {
                    searchId--;
                    if (!aiRobot.isPropSameType(searchId, aiRobot.composeTargetId)) {
                        break;
                    }
                    if (aiRobot.getPropNum(searchId) >= 2) {
                        retInfo = aiRobot.searchCompoeId(searchId);
                        break;
                    }
                }
                if (retInfo) {
                    aiRobot.composeComposeRoomItem(retInfo.startPos.row, retInfo.startPos.col,
                        retInfo.endPos.row, retInfo.endPos.col);
                } else {
                    aiRobot.stopUpdate();
                }
                break;
            case AIRobotStatus.taskDone:
                aiRobot.composeClickTaskDone();
                aiRobot.aiRobotStatus = AIRobotStatus.clcikBtnBuild;
                break;
            case AIRobotStatus.clcikBtnBuild:
                if (!UtilScene.isSceneItemCouldBeBuild()) {
                    // 不能建造
                    aiRobot.aiRobotStatus = AIRobotStatus.clickNew;
                    return;
                }
                aiRobot.composeClickBtnBuild();
                aiRobot.aiRobotStatus = AIRobotStatus.goBuild;
                break;
            case AIRobotStatus.goBuild:
                let buildListItem = find("Canvas/build_list")!.getComponent(build_list)!.buildListLayout.children[0].getComponent(build_list_item)!;
                buildListItem.onClickBtnGo();
                aiRobot.buildId = buildListItem.buildId;
                aiRobot.aiRobotStatus = AIRobotStatus.clickStar;
                break;
            case AIRobotStatus.clickStar:
                Const.FloatStarParent.children.forEach((node: Node) => {
                    let floatStar = node.getComponent(float_star)!;
                    UtilPub.log(floatStar.id, aiRobot.buildId);
                    if (floatStar.id == aiRobot.buildId) {
                        floatStar.onClickBtnPrompt();
                    }
                });
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot.canvasGame.scheduleOnce(() => {
                    aiRobot.aiRobotStatus = AIRobotStatus.clickBuild;
                }, 2);
                break;
            case AIRobotStatus.clickBuild:
                find("Canvas/build_prompt")!.getComponent(build_prompt)!.onClickBtnBuild();
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot.canvasGame.scheduleOnce(() => {
                    aiRobot.aiRobotStatus = AIRobotStatus.clickGou;
                }, 3);
                break;
            case AIRobotStatus.clickGou:
                Const.SelBuildingParent.children[0].getComponent(scene_ui_ops)?.sureHandler();
                aiRobot.aiRobotStatus = AIRobotStatus.goCompose;
                break;
            case AIRobotStatus.goCompose:
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot.goComposeLayer();
                break;
            case AIRobotStatus.idle:
                break;
            default:
                break;
        }
    }

    public composeClickBtnBuild() {
        let composeLayer = aiRobot.getComposeLayer()!;
        composeLayer.onClickBtnBuild();
    }

    public composeClickTaskDone() {
        let composeLayer = aiRobot.getComposeLayer()!;
        composeLayer.onClickBtnTaskDone(find("btnTaskDone", composeLayer.taskLayer.children[0])!.getComponent(Button)!);
    }

    public searchCompoeId(id: number) {
        let ret: any = null;
        let arr: any = [];
        UtilPub.for2Arr(composeModel.roomArr, (roomData: any, row: number, col: number) => {
            if (roomData.id == id) {
                arr.push({ row: row, col: col });
            }
        });
        if (arr.length >= 2) {
            ret = {};
            ret.startPos = UtilPub.getRandomItemByArr(arr, true);
            ret.endPos = UtilPub.getRandomItemByArr(arr, true);
        }
        return ret;
    }

    public getClickNewPos() {
        let arr = [[0, 0], [0, 1], [0, 2]];
        let pArr: any = [];
        for (let i in arr) {
            let pos = arr[i];
            let row = pos[0];
            let col = pos[1];
            let roomData = composeModel.roomArr[row][col];
            if (roomData.cdSum) {
                continue;
            }
            pArr.push({ row: row, col: col });
        }
        if (pArr.length > 0) {
            return UtilPub.getRandomItemByArr(pArr);
        }
        return 0;
    }

    public composeClickRoomItem(row: number, col: number) {
        let composeLayer = aiRobot.getComposeLayer()!;
        let roomItem = composeLayer.roomItemUIArr[row][col];
        let touchEvent = aiRobot.getTouchEvent(roomItem);
        composeLayer.roomListTouchStart(touchEvent);
        composeLayer.roomListTouchEnd(touchEvent);
    }

    public composeComposeRoomItem(startRow: number, startCol: number, endRow: number, endCol: number) {
        let composeLayer = aiRobot.getComposeLayer()!;
        let startRoomItem = composeLayer.roomItemUIArr[startRow][startCol];
        let endRoomItem = composeLayer.roomItemUIArr[endRow][endCol];
        let touchEvent = aiRobot.getTouchEvent(startRoomItem);
        composeLayer.roomListTouchStart(touchEvent);
        let roomItem = instantiate(startRoomItem);
        roomItem.parent = startRoomItem.parent;
        roomItem.addComponent(UIOpacity).opacity = 0;

        let dis = Vec3.distance(startRoomItem.position, endRoomItem.position);
        let time = dis / 1000;
        if (time > 0.6) {
            time = 0.6;
        }
        tween(roomItem).to(time + Math.random() * 0.05, {
            position: endRoomItem.position.clone()
        }, {
            onUpdate(target, ratio) {
                let tEvent = aiRobot.getTouchEvent(roomItem);
                composeLayer.roomListTouchMove(tEvent);
            }
        }).call(() => {
            composeLayer.roomListTouchEnd(aiRobot.getTouchEvent(roomItem));
            roomItem.destroy();
        }).start();
    }

    public getTouchEvent(node: Node) {
        let pos = UtilPub.convertToWorldSpace(node);
        let touchEvent: any = {};
        touchEvent.getUILocation = () => {
            return v2(pos.x, pos.y);
        };
        return touchEvent;
    }

    public createTask() {
        let infoObj: any = {};
        UtilPub.for2Arr(composeModel.roomArr, (roomData: any, row: number, col: number) => {
            if (!composeModel.isRoomNormal(row, col)) {
                return;
            }
            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            if (propRow.anc) {
                return;
            }
            if (!infoObj[roomData.id]) {
                infoObj[roomData.id] = [];
            }
            infoObj[roomData.id].push({ data: roomData, row: row, col: col });
        });
        // 优先要合成的物品当做任务
        let idArr: any = [];
        for (let i in infoObj) {
            let id = parseInt(i);
            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
            let arr = infoObj[i];
            if (arr.length < 2) {
                continue;
            }
            let addLv: any = [];
            if (arr.length >= 16) {
                addLv = [1, 2, 3, 4];
            } else if (arr.length >= 8) {
                addLv = [1, 2, 3];
            } else if (arr.length >= 4) {
                addLv = [1, 2];
            } else {
                addLv = [1];
            }
            for (let tmp in addLv) {
                let add = addLv[tmp];
                let id2 = id + add;
                if (aiRobot.isPropSameType(propRow.id, id2)) {
                    idArr.push(id2);
                }
            }
        }
        if (idArr.length <= 0) {
            // 现有随机一个
            UtilPub.for2Arr(composeModel.roomArr, (roomData: any, row: number, col: number) => {
                if (!composeModel.isRoomNormal(row, col)) {
                    return;
                }
                let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
                if (propRow.anc) {
                    return;
                }
                idArr.push(roomData.id);
            });
        }
        let retId = UtilPub.getRandomItemByArr(idArr);

        let starNum = 2;
        let rVal = Math.random();
        if (rVal > 0.8) {
            starNum = 4;
        } else if (rVal > 0.4) {
            starNum = 3;
        }
        return {
            propArr: [{ id: retId, num: 1 }],
            starNum: starNum
        };
    }

    public isPropSameType(id: number, id2: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        let tmpRow = tables.ins().getTableValueByID(Const.Tables.prop, id2);
        if (propRow && tmpRow && propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
            return true;
        }
        return false;
    }

    public getComposeLayer(): ComposeLayer | null {
        let composeLayer = find("Canvas/ComposeLayer");
        if (composeLayer) {
            return composeLayer.getComponent(ComposeLayer);
        }
        return null;
    }

    public addStarCost(num: number) {
        if (aiRobot.isRobot()) {
            aiRobot.starCost += num;
            UtilPub.log("=====================", aiRobot.starCost, num);
            if (aiRobot.starCost >= 130) {
                aiRobot.stopUpdate();
                UtilScene.restartGame();
            }
        }
    }

    public isRobot() {
        return GameStorageJSF.ins.isRobot;
    }

}

const aiRobot = AIRobot.getInstance();

export { aiRobot };

