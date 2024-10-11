import { find, math, v3, Vec3, view, Node } from "cc";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { TujianState } from "../../config/global";
import { localText } from "../../config/localText";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { Notifications } from "../../easyFramework/mgr/notifications";
import { uiManager } from "../../easyFramework/mgr/uiManager";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";
import tables from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { tyqSDK } from "../../tyqSDK/SDK/tyqSDK";
import { handData } from "../data/handData";
import { ComposeLayer } from "../UI/layer/ComposeLayer";
import { HandLayer } from "../UI/layer/HandLayer";
import { aiRobot } from "./AIRobot";
import { playerModel } from "./playerModel";
import { userData } from "./UserData";


export const nineAroundArr = [
    [1, -1, 135], [1, 0, 90], [1, 1, 45],
    [0, -1, 180], [0, 1, 0],
    [-1, -1, 225], [-1, 0, 270], [-1, 1, 315]
];
export const tenAroundArr = [
    [1, 0],
    [0, -1], [0, 1],
    [-1, 0]
];

export const designConfig = {
    // 气泡自动戳破时间
    bubbleTime: 60 * 1000,
    // 气泡破了，产生的物品id
    bubbleBombPropId: 203,
};
export const propIds = {
    coin: 101,
    diamond: 102,
    power: 103,
    exp: 104,
    star: 105,

    coinMaxLv: 205,
    bag: 401,
    powerMaxLv: 805,

    pinkBag: 1003,
    pinkBag2: 1004,

    superCard: 60020,
};
export const roomStatus = {
    normal: 0,
    // 蜘蛛网
    spider: 1,
    // 纸箱
    carton: 2,
}

export const managerInfoTypeArr = [
    "达到%d级",
    "发射任意发生器%d次",
    "完成%d个订单",
    "解锁%d次蓝色手提包",
    "在棋盘合成%d次",
    "为健身房建造%d次",
    "消耗钻石购买%d次能量",
    "在棋盘上出售%d次任意物品",
    "加速%d次发射器",
    "累计消耗%d能量",
    "合成%d个最高等级金币",
    "合成%d个最高等级能量球",
    "累计消耗%d金币",
];

class ComposeModule {

    private static instance: ComposeModule;
    private constructor() { }
    public static getInstane(): ComposeModule {
        if (this.instance == null) {
            this.instance = new ComposeModule();
        }
        return this.instance;
    }

    // 合成按钮位置
    btnComposePos: Vec3 = v3(0, 0, 0);

    // 棋盘大小
    colNum = 7;
    rowNum = 9;

    // 棋盘数据
    roomArr: any;
    roomDataKey: string = "";

    // 任务列表
    taskArr: any;
    taskDataKey: string = "";

    // 店长值班日
    managerArr: any;
    // 卡片列表
    cardArr: any;

    updateInterval: any;

    curTaskLineState: any = {}

    // get taskArr() {
    //     return this.createTask()
    // }

    // set taskArr(val:any) {

    // }

    initData() {
        // 卡片列表
        this.cardArr = [];
        let ret = GameStorage.getObject(Const.DataKeys.composeCardArr);
        if (ret) {
            // 从服务器加载
            this.cardArr = ret;
            UtilPub.log("从服务端加载卡片列表", this.cardArr);
        }
        // 棋盘数据
        this.roomArr = [];
        this.roomDataKey = Const.DataKeys.composeRoomData;

        ret = GameStorage.getObjectArrayByKey(this.roomDataKey);
        UtilPub.log("读取服务端棋盘数据：", ret);
        if (!ret.values || ret.values.length <= 0) {
            // 初始化数据，并且上传
            let tmpObj: any = {};

            // // test
            // // let idArr = [10001, 10012, 10026, 20001, 20011, 20021, 20026, 20030, 20041, 20052, 20059, 20065, 20069, 30001, 30008, 30019];
            // let idArr = [10001, 10012, 10026, 20001, 20011, 20021, 20026];
            // for (let i = 0; i < this.rowNum; i++) {
            //     this.roomArr[i] = [];
            //     for (let j = 0; j < this.colNum; j++) {
            //         let roomData: any = {};
            //         if (Math.random() > 0.3) {
            //             let id = UtilPub.getRandomItemByArr(idArr);
            //             roomData = this.initRoomData(id);
            //         }
            //         this.roomArr[i][j] = roomData;
            //         let key = this.getRoomDataKey(i, j);
            //         tmpObj[key] = roomData;
            //     }
            // }
            // // 加入背包
            // let emptyPos = this.getEmptyRoomPos();
            // if (emptyPos) {
            //     let emptyRoom = this.initRoomData(propIds.bag);
            //     this.roomArr[emptyPos.row][emptyPos.col] = emptyRoom;
            //     tmpObj[this.getRoomDataKey(emptyPos.row, emptyPos.col)] = emptyRoom;
            // }

            let tb = tables.ins().getTable(Const.Tables.composeRoomInit);
            if (aiRobot.isRobot()) {
                tb = tables.ins().getTable(Const.Tables.composeRoomInitRobot);
            }
            for (let i = 0; i < tb.length; i++) {
                let roomRow = tb[i];
                let row = roomRow.row - 1;
                let col = roomRow.col - 1;
                let roomData = this.initRoomData(roomRow.propId, undefined, roomRow.status, roomRow.clickPropId);
                if (!this.roomArr[row]) {
                    this.roomArr[row] = [];
                }
                this.roomArr[row][col] = roomData;
                let key = this.getRoomDataKey(row, col);
                tmpObj[key] = roomData;
            }

            // 将初始化的数据上传
            GameStorage.setObjectMulti(tmpObj);
            UtilPub.log("本地初始化棋盘数据：", this.roomArr);
        } else {
            // 解析服务端的数据
            for (let i = 0; i < ret.values.length; i++) {
                let val = ret.values[i];
                let key = ret.keys[i];
                let arr = key.split("_");
                let row = parseInt(arr[1]);
                let col = parseInt(arr[2]);
                if (!this.roomArr[row]) {
                    this.roomArr[row] = [];
                }
                this.roomArr[row][col] = val;
            }
            UtilPub.log("从服务端加载棋盘数据", this.roomArr);
        }

    }

    loadData() {
        console.log("loadData 1")
        this.taskArr = [];
        this.roomDataKey = Const.DataKeys.composeRoomData;
        console.log("loadData 2")

        // 任务列表
        if (this.roomDataKey == Const.DataKeys.composeRoomData) {
            this.taskDataKey = Const.DataKeys.composeTaskArr;
            console.log("loadData 3")

            let ret = GameStorage.getObject(this.taskDataKey);
            console.log("loadData 4")

            if (!ret) {
                // 本地初始化
                if (aiRobot.isRobot()) {
                    let retTask = aiRobot.createTask();
                    this.taskArr = [retTask];
                } else {
                    let retTask = this.createHandTask(1);
                    this.taskArr = [retTask];
                }
                // 将初始化的数据上传
                this.sendTaskArrToServer();
                UtilPub.log("本地初始化任务列表：", this.taskArr);

            } else {
                // 从服务器加载

                console.log("loadData 5 a")

                this.taskArr = this.createTask()//ret;
                UtilPub.log("从服务端加载任务列表", this.taskArr);
                console.log("loadData 5")

            }
        }
        console.log("loadData 6")

        // 店长值班日
        this.managerArr = [];
        let ret = GameStorage.getObjectArrayByKey(this.roomDataKey);
        ret = GameStorage.getObjectArrayByKey(Const.DataKeys.composeManagerArr);
        if (!ret.values || ret.values.length <= 0) {
            // 本地初始化
            this.createNextManager();
            UtilPub.log("本地初始化店长值班日：", this.managerArr);
        } else {
            // 从服务器加载
            for (let i = 0; i < ret.values.length; i++) {
                let val = ret.values[i];
                let key = ret.keys[i];
                let arr = key.split("_");
                this.managerArr[arr[1]] = val;
            }
            UtilPub.log("从服务端加载店长值班日", this.managerArr);
        }
        console.log("loadData 7")

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(this.update.bind(this), 500);
        this.update();
        console.log("loadData 8")


    }

    // 完全展示合成界面之后调用
    showComposeLayerEnd() {
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            this.refreshRoomAutoNew(row, col);
        });
    }

    close() {
        //this.roomArr = [];
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        let timestamp = this.getCurrentTimestamp();
        let tempArr: any = [];
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);

            // 主动点击cd
            if (roomData.cd && timestamp >= roomData.cd) {
                if (propRow.mdt == 11) {
                    // 加速装置 时间到了，自动消失
                    this.setRoomData(row, col, {});
                    let info = {
                        row: row,
                        col: col
                    };
                    Notifications.emit(GD.event.composeTimeSpeedUpEnd, info);
                } else {
                    delete roomData.cd;
                    delete roomData.cdSum;
                    // cd到了，补充库存
                    roomData.times = propRow.times;
                    this.sendRoomDataToServer(row, col);
                }
            }

            // 自动吐东西
            if (propRow.fair && roomData.timesAuto > 0) {
                this.refreshRoomAutoNew(row, col);
            }
            // 自动吐物品cd
            if (roomData.cdAuto && timestamp >= roomData.cdAuto && !this.isRoomBubble(row, col)) {
                // cd到了，补充库存
                delete roomData.cdAuto;
                roomData.timesAuto = propRow.kishu;
                this.sendRoomDataToServer(row, col);
                this.refreshRoomAutoNew(row, col);
            }

            // 气泡戳破
            if (roomData.cdBubble > 0 && timestamp >= roomData.cdBubble) {
                roomData = this.initRoomData(designConfig.bubbleBombPropId);
                this.setRoomData(row, col, roomData);
                this.sendToUIRoomBubbleBomb(row, col);
            }

            if (propRow.mdt == 11 && roomData.startTime) {
                // 加速装置
                let speedTime = timestamp - roomData.startTime;
                roomData.startTime = timestamp;
                // 九宫周围可加速房间
                for (let i = 0, len = nineAroundArr.length; i < len; i++) {
                    let posArr = nineAroundArr[i];
                    let r = row + posArr[0];
                    let c = col + posArr[1];
                    if (!this.isRoomNormal(r, c)) {
                        continue;
                    }
                    let pData = this.roomArr[r][c];
                    if (this.propCanSpeedUp(pData.id)) {
                        if (!pData.speedTime || pData.speedTime < speedTime) {
                            pData.speedTime = speedTime;
                        }
                        pData.row = r;
                        pData.col = c;
                        tempArr.push(pData);
                    }
                }
            }

        });

        tempArr.forEach((roomData: any) => {
            if (roomData.cd || roomData.cdAuto) {
                roomData.cd -= roomData.speedTime;
                roomData.cdAuto -= roomData.speedTime;
            }
            delete roomData.speedTime;
            let row = roomData.row;
            let col = roomData.col;
            delete roomData.row;
            delete roomData.col;
            this.setRoomData(row, col);
        });
    }

    getRoomDataKey(row: number, col: number) {
        return this.roomDataKey + "_" + row + "_" + col;
    }
    getManagerDataKey(index: number) {
        return Const.DataKeys.composeManagerArr + "_" + index;
    }

    initRoomData(id: number, data: any = {}, st?: number, clickPropId?: any) {
        data.id = id;
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        if (!propRow) {
            UtilPub.error("道具数据找不到，id:" + id);
        }

        if (clickPropId) {
            // 指定点击生成的道具
            data.clickPropId = clickPropId;
        }

        // 首次生成指定点击获得道具列表
        if (propRow.clickPropId) {
            let propCount = this.getComposePropCount(id);
            if (propCount == 0) {
                if (!clickPropId) {
                    clickPropId = [];
                }
                clickPropId = clickPropId.concat(propRow.clickPropId);
                data.clickPropId = clickPropId;
                this.setComposePropCount(id, propCount + 1);
                // UtilPub.log("%s create clickPropId".format(propRow.name), clickPropId);
            }
        }

        if (id == propIds.bag && st == roomStatus.spider) {
            st = undefined;
        }

        if (st && st > 0) {
            data.st = st;
        } else {
            delete data.st;
            if (propRow.anc && propRow.times > 0) {
                // 手动点击次数
                data.times = propRow.times;
            }

            if (propRow.kishu > 0) {
                // 自动生成次数，首次改成只生成一个
                // data.timesAuto = propRow.kishu;
                data.timesAuto = 1;
            }

            if (id == propIds.bag) {
                // 背包，初始化免费格子
                let roomArr = [];
                while (true) {
                    let id = roomArr.length + 1;
                    let bagRow = tables.ins().getTableValueByID(Const.Tables.bagGrid, id);
                    if (bagRow.coin != 0) {
                        break;
                    }
                    roomArr.push({});
                }
                data.roomArr = roomArr;
                UtilPub.log("背包初始化结束", data);
            }

            if (propRow.lock) {
                // 初始cd状态
                data.cd = this.getCurrentTimestamp() + propRow.milo * 1000;
                data.cdSum = propRow.milo * 1000;
                UtilPub.log("初始cd状态", data);
            }
        }

        if (!st) {
            // 解锁道具
            userData.setGetPropTujian(id, TujianState.geted);
        }

        return data;
    }

    /**
     * 寻找棋盘下的同子类物品的最高等级+lvAdd，溢出就取最高等级
     * @param id 物品id
     * @param lvAdd 等级增加值，为0，不作处理，返回传入的id本身
     * @returns 
     */
    getRoomPropIdByIdLvUp(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this.isRoomBubble(row, col)) {
                return;
            }
            let tmpRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            if (propRow.type != tmpRow.type || propRow.typeson != tmpRow.typeson) {
                // 不是同子类
                return;
            }
            if (propRow.luna > tmpRow.luna) {
                return;
            }
            propRow = tmpRow;
        });
        // 找到最高等级了
        id = propRow.id;

        id = this.getPropIdByIdLvUp(id, lvAdd);

        return id;
    }

    /**
     * 获得道具的最高等级id
     * @param id 
     */
    getPropMaxLvId(id: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        while (true) {
            id++;
            let nextRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
        }
        return id;
    }

    /**
     * 物品等级+lvAdd，溢出就取最高等级
     * @param id 物品id
     * @param lvAdd 等级增加值，为0，不作处理，返回传入的id本身
     */
    getPropIdByIdLvUp(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }

        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        for (let i = 0; i < lvAdd; i++) {
            id++;
            let nextRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
            propRow = nextRow;
        }

        return id;
    }

    /**
     * 是否已解锁 某道具的子类，有解锁1个，就算解锁了整个子类
     * @param id 
     */
    hasUnlockPropType(id: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        let tb = tables.ins().getTable(Const.Tables.prop);
        for (let i = 0; i < tb.length; i++) {
            let tmpRow = tb[i];
            if (propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
                if (userData.isGetPropTujian(tmpRow.id) != TujianState.unGet) {
                    return true;
                }
            }
        }
        return false;
    }

    // 解锁新任务到下一个卡点
    createNextManager() {
        let tmpObj: any = {};
        let id = this.managerArr.length;
        if (id >= tables.ins().getTableLastOne(Const.Tables.manager).id) {
            // 已全部解锁
            return;
        }
        let row = null;
        while (true) {
            row = tables.ins().getTableValueByID(Const.Tables.manager, id + 1);
            if (!row) {
                break;
            }
            let manager = {
                id: row.id,
                val: 0,
                get: 0
            };
            let index = row.id - 1;
            this.managerArr[index] = manager;
            let key = this.getManagerDataKey(index);
            tmpObj[key] = manager;
            if (row.kadian) {
                break;
            }
            id++;
        }
        GameStorage.setObjectMulti(tmpObj);
        UtilPub.log("解锁新任务", tmpObj);
        Notifications.emit(GD.event.managerCreateTask);
    }

    createHandTask(id: number) {
        let row = tables.ins().getTableValueByID(Const.Tables.handTask, id);
        if (!row) {
            return;
        }

        let propArr = [{
            id: row.prop,
            num: row.num
        }];

        return {
            id: id,
            propArr: propArr,
            starNum: row.taskReward,
            hand: 1
        };
    }

    getCurTaskLineStep(taskId: number = 1, line: number, ischeck: boolean = false) {
        let lineTaskData = tables.ins().getTableValuesByType2(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", line + "")
        if (lineTaskData.length <= 0) {
            return [0, 0]
        }
        // lineTaskData.sort((a: any, b: any) => {
        //     return a.secondLine - b.secondLine
        // })
        if (ischeck && this.curTaskLineState[taskId * 1000 + line]) {
            return this.curTaskLineState[taskId * 1000 + line]
        }
        let start = lineTaskData[0].secondLine
        let endIndex = start + lineTaskData.length - 1
        let curStep = GameStorage.getInt(Const.DataKeys.TaskLineStep + taskId + "_" + line, start)
        if (line == 1) {
            this.curTaskLineState[taskId * 1000 + line] = [curStep, endIndex]
            return [curStep, endIndex]
        }

        let isPass = true
        for (let stepLine = 1; stepLine <= line - 1; stepLine++) {
            let step = this.getCurTaskLineStep(taskId, stepLine, true)!
            if (step[0] < start && step[1] >= start) {
                //  let lineTaskData2 = tables.ins().getTableValuesByType3(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", stepLine + "", "secondLine", "" + step1)
                // if (step[1]) {
                isPass = false
                break;
                //  }
            }
        }

        if (isPass) {
            if (ischeck)
                this.curTaskLineState[taskId * 1000 + line] = [curStep, endIndex]
            return [curStep, endIndex]
        } else {
            if (ischeck)
                this.curTaskLineState[taskId * 1000 + line] = ischeck ? [start, endIndex] : [0, endIndex]
            return ischeck ? [start, endIndex] : [0, endIndex]
        }

    }

    submitLineTask(taskId: number, line: number) {
        let curStep = this.getCurTaskLineStep(taskId, line)[0]
        curStep++
        GameStorage.setInt(Const.DataKeys.TaskLineStep + taskId + "_" + line, curStep)
        let arr = this.createTaskLine(taskId)
        if (this.curTaskLineState[taskId * 1000 + line]) {
            this.curTaskLineState[taskId * 1000 + line][0] = curStep
        }
        //  let taskData = tables.ins().getTableValuesByType3(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", line + "", "secondLine", curStep + "")
        if (arr.length <= 0) {
            GameStorage.setInt(Const.DataKeys.TaskLineFinsh + taskId, 1)
        }
    }

    isTaskFish(taskId: number) {
        let isstate = GameStorage.getInt(Const.DataKeys.TaskLineFinsh + taskId, 0)
        return isstate == 1
    }

    isTaskGetReward(taskId: number) {
        // if (taskId == 4) {
        //     GameStorage.setInt(Const.DataKeys.TaskLineFinshReward + taskId, 0)
        //     return false
        // }
        let isstate = GameStorage.getInt(Const.DataKeys.TaskLineFinshReward + taskId, 0)
        return isstate == 1
    }

    setTaskGetReward(taskId: number) {
        GameStorage.setInt(Const.DataKeys.TaskLineFinshReward + taskId, 1)
    }

    createTask2() {
        let taskArr: any = {};

        let taskUnLockData = tables.ins().getTable(Const.Tables.taskUnlock)
        this.curTaskLineState = {}
        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];
            if (userData.roleLv >= element.level) {
                if (element.tid == 0 || this.isTaskFish(element.tid)) {
                    let arr = this.createTaskLine(element.taskId)
                    if (arr.length > 0 || !this.isTaskGetReward(element.taskId))
                        taskArr[element.taskId] = arr
                }
            }
        }
        return taskArr
    }


    getTaskProgress(taskId: number) {
        let firstLinenum = tables.ins().getTableValuesNumberByType(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        let taskData = tables.ins().getTableValuesByType(Const.Tables.taskMainType, "taskId", taskId + "")
        let finishNum = 0
        for (let index = 1; index <= firstLinenum; index++) {
            let lineTaskData = tables.ins().getTableValuesByType2(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "")
            if (lineTaskData.length > 0) {
                let start = lineTaskData[0].secondLine
                let taskMain1 = this.getCurTaskLineStep(taskId, index)[0]
                if (taskMain1 > 0) {
                    finishNum += taskMain1 - start
                }
            }
        }
        return finishNum / taskData.length
    }

    createTask() {
        let taskArr: any = [];

        let taskUnLockData = tables.ins().getTable(Const.Tables.taskUnlock)
        this.curTaskLineState = {}

        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];

            if (userData.roleLv >= element.level) {

                if (element.tid == 0 || this.isTaskFish(element.tid)) {
                    let arr = this.createTaskLine(element.taskId)

                    Array.prototype.push.apply(taskArr, arr);

                }
            }
        }

        composeModel.taskArr = taskArr
        return taskArr
    }

    createTaskLine(taskId: number = 1, num: number = 1) {
        let taskArr: any = [];
        let firstLinenum = tables.ins().getTableValuesNumberByType(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        for (let index = 1; index <= firstLinenum; index++) {

            let taskMain1 = this.getCurTaskLineStep(taskId, index)[0]

            if (taskMain1 > 0) {
                let taskData = tables.ins().getTableValuesByType3(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "", "secondLine", taskMain1 + "")[0]
                if (taskData) {

                    let task: any = {};
                    task.starNum = taskData.taskReward
                    let propArr = [];
                    for (let i = 0; i < taskData.res1.length; i++) {
                        propArr.push({
                            id: taskData.res1[i][0],
                            num: taskData.res1[i][1],
                        })
                    }

                    task.propArr = propArr
                    task.line = index
                    task.taskId = taskId
                    task.id = taskData.id
                    taskArr.push(task);
                }
            }
        }

        return taskArr
    }

    /**
     * 生成任务
     * @param num 生成任务数量 
     * @param funcType 指定任务类型 
     */
    createTaskMain(num: number = 1, funcType: number = 0) {
        let taskArr: any = [];

        for (let i = 0; i < num; i++) {
            let task: any = {};

            let arr = [];
            let tb = tables.ins().getTable(Const.Tables.taskType);
            for (let row of tb) {
                if (funcType > 0 && row.res1 != funcType) {
                    // 不是指定类型
                    continue;
                }
                let lv = userData.roleLv;
                if (lv >= row.levelMin && lv <= row.levelMax) {
                    // 过滤玩家等级
                    arr.push(row);
                }
            }
            let retRow = UtilPub.getRowByWeight(arr);

            // test
            // retRow = tables.ins().getTableValueByID(Const.Tables.taskType, 50);

            let idArr: any = [];
            let propTb = tables.ins().getTable(Const.Tables.prop);
            let unlockInfo: any = {};
            // 按照类型区分
            switch (retRow.res1) {
                case 2:
                    // 已拥有的
                    UtilPub.for2Arr(this.roomArr, (roomData: any, pRow: number, pCol: number) => {
                        let id = roomData.id;
                        if (!id || id == propIds.bag) {
                            return;
                        }
                        if (idArr.indexOf(id) != -1) {
                            return;
                        }
                        if (this.isRoomCarton(pRow, pCol) || this.isRoomSpider(pRow, pCol) || this.isRoomBubble(pRow, pCol)) {
                            return;
                        }

                        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
                        if (propRow.lunc > retRow.quality) {
                            // 过滤道具品质
                            return;
                        }
                        idArr.push(id);
                    });
                    break;
                case 3:
                    // 已解锁，但是未拥有的最高等级
                    let tmpInfo: any = {};
                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {
                            // 过滤道具品质
                            return;
                        }
                        // 过滤掉未解锁的
                        if (userData.isGetPropTujian(propRow.id) == TujianState.unGet) {
                            return;
                        }
                        // 过滤掉已拥有的
                        let hasInfo = this.getRoomDataHasInfoById(propRow.id);
                        if (hasInfo.num > 0) {
                            return;
                        }
                        // 同子类道具取最高等级
                        let key = propRow.type * 1000 + propRow.typeson;
                        let info = tmpInfo[key];
                        if (info) {
                            if (info.lv > propRow.luna) {
                                info.id = propRow.id;
                                info.lv = propRow.luna;
                            }
                        } else {
                            info = {};
                            info.id = propRow.id;
                            info.lv = propRow.luna;
                            tmpInfo[key] = info;
                        }
                    });
                    for (let tmp in tmpInfo) {
                        idArr.push(tmpInfo[tmp].id);
                    }
                    break;
                case 4:
                    // 已解锁子类，但是未解锁的道具
                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {
                            // 过滤道具品质
                            return;
                        }
                        // 过滤掉已解锁的
                        if (userData.isGetPropTujian(propRow.id) != TujianState.unGet) {
                            return;
                        }
                        // 过滤掉未解锁的子类
                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this.hasUnlockPropType(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (!hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 5:
                    // 未解锁子类，并且也未解锁的道具
                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {
                            // 过滤道具品质
                            return;
                        }
                        // 过滤掉已解锁的
                        if (userData.isGetPropTujian(propRow.id) != TujianState.unGet) {
                            return;
                        }
                        // 过滤掉已解锁的子类
                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this.hasUnlockPropType(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 6:
                    // 已解锁的道具
                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {
                            // 过滤道具品质
                            return;
                        }
                        // 已解锁的
                        if (userData.isGetPropTujian(propRow.id) != TujianState.unGet) {
                            idArr.push(propRow.id);
                        }
                    });
                    break;
                default:
                    break;
            }

            // 道具种类
            let needTypeNum = retRow.djzl;
            if (idArr.length <= 1) {
                needTypeNum = 1;
            }

            let propArr = [];
            let lvUp = retRow.djsj;
            let res1 = retRow.res1;
            for (let tmp = 0; tmp < needTypeNum; tmp++) {
                while (true) {
                    let retId = UtilPub.getRandomItemByArr(idArr, true);
                    if (retId > 0) {
                        // 等级增加，按照类型区分
                        switch (res1) {
                            case 2:
                                retId = this.getRoomPropIdByIdLvUp(retId, lvUp);
                                break;
                            case 3:
                            case 6:
                                retId = this.getPropIdByIdLvUp(retId, lvUp);
                                break;
                            default:
                                break;
                        }
                        if (propArr.length > 0 && retId == propArr[0].id) {
                            res1 = 2;
                            lvUp = 0;
                            UtilPub.log("任务道具重复了:" + retId);
                            continue;
                        }
                        let num = this.getValByDesignWeight("1,2,3", retRow.num);
                        propArr.push({
                            id: retId,
                            num: num
                        });
                    }
                    break;
                }
            }
            if (propArr.length > 0) {
                // task.id = retRow.id;
                task.propArr = propArr;
                // 任务奖励数量
                task.starNum = UtilPub.getRandomItemByArr(retRow.taskReward);
                taskArr.push(task);
            }

            // UtilPub.log("任务类型：" + retRow.res1);
        }

        if (taskArr.length <= 0) {
            // 如果没有任务了，要生成一个保底任务
            let leastTaskArr = tables.ins().getTable(Const.Tables.leastTask);
            let leastTaskRow = UtilPub.getRandomItemByArr(leastTaskArr);
            let propArr = [{
                id: leastTaskRow.prop,
                num: leastTaskRow.num
            }];
            let leastTask = {
                propArr: propArr,
                starNum: leastTaskRow.taskReward,
            };
            taskArr.push(leastTask);
            UtilPub.log("生成保底任务", leastTask);
        }

        UtilPub.log("生成任务：", taskArr);

        return taskArr;
    }

    // 刷新可以自动生成新物品的房间
    refreshRoomAutoNew(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || !roomData.timesAuto || roomData.timesAuto <= 0) {
            return;
        }
        if (this.isRoomBubble(row, col)) {
            return;
        }

        // 记录九宫周围的空房间
        let emptyArr: any = [];
        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (this.rowColInComposeLayer(r, c)) {
                let rData = this.roomArr[r][c];
                if (!rData.id) {
                    emptyArr.push([r, c]);
                }
            }
        });

        // 判断周边九宫有空房间才会生成
        if (emptyArr.length > 0) {
            let tmpObj: any = {};
            let newPosArr: any = [];
            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            while (roomData.timesAuto > 0 && emptyArr.length > 0 && propRow.fair > 0) {
                let roomDataNew = this.initRoomData(propRow.fair);
                let posArr = emptyArr.shift();
                let r = posArr[0];
                let c = posArr[1];
                this.roomArr[r][c] = roomDataNew;
                tmpObj[this.getRoomDataKey(r, c)] = roomDataNew;
                newPosArr.push(posArr);
                roomData.timesAuto--;
                if (roomData.timesAuto <= 0) {
                    roomData.cdAuto = this.getCurrentTimestamp() + propRow.faircd * 1000;
                }
            }

            // 将数据批量上传给服务端
            GameStorage.setObjectMulti(tmpObj);

            // 通知UI层
            this.sendToUIComposeRoomNew(row, col, newPosArr, true);

        }
    }

    /**
     * 通知UI层，有新的物品生成了
     * @param row 开始行
     * @param col 开始列
     * @param newPosArr 生成的物品位置数组 [[row,col],...]
     */
    sendToUIComposeRoomNew(row: number, col: number, newPosArr: any, isAuto: boolean = false) {
        let data: any = {};
        data.row = row;
        data.col = col;
        data.newPosArr = newPosArr;
        data.isAuto = isAuto;
        Notifications.emit(GD.event.composeRoomNew, data);
    }
    // 通知UI层气泡破了
    sendToUIRoomBubbleBomb(row: number, col: number) {
        let data: any = {};
        data.row = row;
        data.col = col;
        Notifications.emit(GD.event.composeRoomBubbleBomb, data);
    }

    // 拖动：交换位置
    roomDataExchange(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        this.setRoomData(srcRow, srcCol, targetData);
        this.setRoomData(targetRow, targetCol, srcData);
    }

    // 拖动：进行合成
    roomDataCompose(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, srcData.id);
        // 源房间清除掉
        this.setRoomData(srcRow, srcCol, {});
        // 目标房间生成合成后的物品
        if (userData.isGetPropTujian(propRow.blessId) == TujianState.unGet) {
            // 通知UI显示获得新元素
            let blessRow = tables.ins().getTableValueByID(Const.Tables.prop, propRow.blessId);
            if (blessRow.anc) {
                Notifications.emit(GD.event.composeGetNewItem, propRow.blessId);
            }
        }
        let roomData = this.initRoomData(propRow.blessId);
        let clickPropId: any = [];
        if (srcData.clickPropId) {
            clickPropId = clickPropId.concat(srcData.clickPropId);
        }
        if (targetData.clickPropId) {
            clickPropId = clickPropId.concat(targetData.clickPropId);
        }
        if (clickPropId.length > 0) {
            roomData.clickPropId = clickPropId;
        }
        this.setRoomData(targetRow, targetCol, roomData);

        // 按照十字型戳破周围的纸箱子，变成蜘蛛网包住
        let retObj: any = {};
        retObj.cartonArr = [];
        for (let i in tenAroundArr) {
            let posArr = tenAroundArr[i];
            let r = targetRow + posArr[0];
            let c = targetCol + posArr[1];
            if (this.rowColInComposeLayer(r, c)) {
                let rData = this.roomArr[r][c];
                if (rData.st == roomStatus.carton) {
                    rData = this.initRoomData(rData.id, rData, roomStatus.spider);
                    this.setRoomData(r, c, rData);
                    retObj.cartonArr.push({ row: r, col: c });
                }
            }
        }

        this.addManagerVal(Const.ManagerTypes.composeCount);
        if (roomData.id == propIds.coinMaxLv) {
            this.addManagerVal(Const.ManagerTypes.composeCoinMaxLv);
        }
        if (roomData.id == propIds.powerMaxLv) {
            this.addManagerVal(Const.ManagerTypes.composePowerMaxLv);
        }

        return retObj;
    }
    // 合成后，优先有概率生成额外东西
    roomDataComposeAfter(targetRow: number, targetCol: number) {
        // 新手阶段不出新东西
        if (!this.isHandDone() || aiRobot.isRobot()) {
            return;
        }

        let roomData = this.roomArr[targetRow][targetCol];
        let arr = tables.ins().getTable(Const.Tables.composeAward);
        // let retRow = UtilPub.getRowByWeight(arr);
        // UtilPub.log(retRow);
        let retRow = tables.ins().getTableValueByID(Const.Tables.composeAward, 1)
        // // test
        // let emptyPos = this.getEmptyRoomPos();
        // if (emptyPos) {
        //     let newRoom = null;
        //     // 生成相同等级的气泡物品
        //     // newRoom = this.initRoomData(roomData.id);
        //     // 金币
        //     newRoom = this.initRoomData(201);
        //     newRoom.cdBubble = this.getCurrentTimestamp() + designConfig.bubbleTime;

        //     if (newRoom) {
        //         this.setRoomData(emptyPos.row, emptyPos.col, newRoom);
        //         this.sendToUIComposeRoomNew(targetRow, targetCol, [[emptyPos.row, emptyPos.col]]);
        //     }
        // }
        // return;

        if (retRow.propId != 0) {
            let emptyPos = this.getEmptyRoomPos();
            if (emptyPos) {
                let newRoom = null;
                if (retRow.propId == -1) {
                    // 生成相同等级的气泡物品
                    newRoom = this.initRoomData(roomData.id);
                    newRoom.cdBubble = this.getCurrentTimestamp() + designConfig.bubbleTime;
                } else if (retRow.propId > 0) {
                    // 生成物品
                    newRoom = this.initRoomData(retRow.propId);
                }
                if (newRoom) {
                    this.setRoomData(emptyPos.row, emptyPos.col, newRoom);
                    this.sendToUIComposeRoomNew(targetRow, targetCol, [[emptyPos.row, emptyPos.col]]);
                }
            }
        }
    }

    /**
     * 将物品放入背包
     * 返回值：true 放入成功   false 放入失败，背包已满
     * @param row 物品行索引
     * @param col 物品列索引
     * @param bagRow 背包行索引
     * @param bagCol 背包列索引
     */
    putDataInRoomBag(row: number, col: number, bagRow: number, bagCol: number) {
        if (this.isRoomBubble(row, col)) {
            // 有气泡，不能放入
            this.showToast(localText.notInBag);
            return;
        }
        let bagRoomData = this.roomArr[bagRow][bagCol];
        if (bagRoomData.st == roomStatus.carton) {
            UtilPub.log("还未解锁背包");
            return;
        }
        // 寻找空位置
        let index = -1;
        for (let i = bagRoomData.roomArr.length - 1; i >= 0; i--) {
            let room = bagRoomData.roomArr[i];
            if (!room.id) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            // 背包已满
            UtilPub.log("背包已满");
            return false;
        }
        let roomData = this.roomArr[row][col];
        this.setRoomData(row, col, {});

        roomData.putTime = this.getCurrentTimestamp();
        bagRoomData.roomArr[index] = roomData;

        UtilPub.sortArr(bagRoomData.roomArr, (r1: any, r2: any) => {
            let id1 = r1.id;
            let id2 = r2.id;
            if (!id1) {
                id1 = 9999999999;
            }
            if (!id2) {
                id2 = 9999999999;
            }
            if (id1 > id2) {
                return true;
            }
            return false;
        });

        this.sendRoomDataToServer(bagRow, bagCol);
        return true;
    }
    /**
     * 从背包中取出物品
     * 返回值：{row,col}取出成功  否则取出失败，棋盘没空房间了
     * @param index 要取出的物品索引
     * @param bagRow 背包行索引
     * @param bagCol 背包列索引
     */
    getOutDataFromRoomBag(index: number, bagRow: number, bagCol: number) {
        let emptyPos = composeModel.getEmptyRoomPos();
        if (!emptyPos) {
            // 外面没有空房间了
            return;
        }
        let bagRoomData = this.roomArr[bagRow][bagCol];
        let roomData = bagRoomData.roomArr[index];

        // 放入背包的物品，是不走cd的
        let dt = this.getCurrentTimestamp() - roomData.putTime;
        if (roomData.cd > 0) {
            roomData.cd += dt;
        }
        if (roomData.cdAuto > 0) {
            roomData.cdAuto += dt;
        }
        delete roomData.putTime;

        this.setRoomData(emptyPos.row, emptyPos.col, roomData);

        bagRoomData.roomArr[index] = {};
        this.sortBagRoomArr(bagRow, bagCol);

        return emptyPos;
    }
    // 整理背包物品，重新排序
    sortBagRoomArr(row: number, col: number) {
        let bagRoomData = this.roomArr[row][col];
        let arr = [];
        let emptyArr = [];
        for (let roomData of bagRoomData.roomArr) {
            if (roomData.id > 0) {
                arr.push(roomData);
            } else {
                emptyArr.push(roomData);
            }
        }
        UtilPub.sortArr(arr, (r1: any, r2: any) => {
            if (r1.id > r2.id) {
                return true;
            }
            return false;
        });
        bagRoomData.roomArr = arr.concat(emptyArr);
        this.sendRoomDataToServer(row, col);
    }
    // 背包扩容
    bagRoomAddGrid(row: number, col: number) {
        let bagRoomData = this.roomArr[row][col];
        bagRoomData.roomArr.push({});
        this.sendRoomDataToServer(row, col);
    }

    // 点击房间，生成新物品
    onClickRoomNew(row: number, col: number, emptyRow: number, emptyCol: number) {
        // UtilPub.log(row, col, emptyRow, emptyCol);
        let roomData = this.roomArr[row][col];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        roomData.times--;

        if (!propRow.noPower && composeModel.getComposePowerRemainTime() <= 0) {
            // 扣减体力
            this.subPropNum(propIds.power);
            if (aiRobot.isRobot() && this.getPropNumById(propIds.power) <= 1) {
                this.addPropNum(propIds.power, 100);
            }
        }

        if (propRow.milo > 0) {
            if (!roomData.cd) {
                roomData.cd = this.getCurrentTimestamp();
            }
            roomData.cd += (propRow.milo * 1000);
        }
        if (roomData.times <= 0) {
            // 全部点击完了
            if (propRow.wsb) {
                // 点击完消失
                this.roomArr[row][col] = {};
            } else if (propRow.doge > 0) {
                // 点击完变成另外一个物品
                let roomData2 = this.initRoomData(propRow.doge);
                this.roomArr[row][col] = roomData2;
            } else {
                // 要开始显示cd了，记录下分母大小，用于显示冷却进度条
                roomData.cdSum = roomData.cd - this.getCurrentTimestamp();
            }
        }
        this.sendRoomDataToServer(row, col);
        UtilPub.log("剩余次数：" + roomData.times);

        let propId = 0;
        if (roomData.clickPropId && roomData.clickPropId.length > 0) {
            // 指定配表
            propId = roomData.clickPropId.shift();
            if (roomData.clickPropId.length <= 0) {
                delete roomData.clickPropId;
            }
        } else {
            // 按照权重生成物品到新房间
            propId = this.getValByDesignWeight(propRow.atom, propRow.matic);
        }

        let newRoomData = this.initRoomData(propId);
        this.setRoomData(emptyRow, emptyCol, newRoomData);
        //  this.setRoomData(row, col, this.roomArr[row][col]);

        this.addManagerVal(Const.ManagerTypes.roomClickAdd);
        let newPropRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("生成新物品 id:%d,name:%s".format(propId, newPropRow.name));

    }

    // 点击直接拿奖励的房间
    onClickRoomAward(row: number, col: number, roomPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        // 获得道具
        this.addPropNum(propRow.clickAwardId, propRow.clickAwardNum, roomPos);

        this.setRoomData(row, col, {});
    }

    // 点击解锁
    onClickUnlockRoom(row: number, col: number) {
        let unlocking = false;
        UtilPub.for2Arr(composeModel.roomArr, (pData: any, pRow: number, pCol: number) => {
            if (!pData || !pData.id || composeModel.isRoomBubble(pRow, pCol)) {
                return;
            }
            let propRow2 = tables.ins().getTableValueByID(Const.Tables.prop, pData.id);
            if (propRow2.mdt == 1 && pData.unlock && pData.cdSum > 0) {
                unlocking = true;
                return true;
            }
        });
        if (unlocking) {
            // 同时只能有一个
            composeModel.showToast(localText.unlocking);
            return;
        }

        let roomData = this.roomArr[row][col];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        roomData.unlock = 1;
        roomData.cd = this.getCurrentTimestamp() + propRow.p1 * 1000;
        roomData.cdSum = propRow.p1 * 1000;
        this.sendRoomDataToServer(row, col);

        if (roomData.id == propIds.pinkBag || roomData.id == propIds.pinkBag2) {
            this.addManagerVal(Const.ManagerTypes.unlockPinkBag);
        }
    }

    onClickEspRoom(row: number, col: number) {
        let ret: any = {};
        let roomData = this.roomArr[row][col];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        switch (propRow.mdt) {
            case 2:
                // 无限能量
                GameStorage.setInt(Const.DataKeys.composePowerTime, this.getCurrentTimestamp() + propRow.p1 * 1000);
                this.setRoomData(row, col, {});
                break;
            case 5:
                // 减少cd
                let timestamp = this.getCurrentTimestamp();
                ret.arr = [];
                UtilPub.for2Arr(this.roomArr, (rData: any, r: number, c: number) => {
                    if (this.isRoomBubble(r, c)) {
                        return;
                    }
                    if (!this.isRoomNormal(r, c)) {
                        return;
                    }
                    if (rData.notSubCd) {
                        return;
                    }
                    let subCd = propRow.p1 * 60 * 60 * 1000;
                    if (rData.cd) {
                        // 点击发射
                        rData.cd -= subCd;
                        if (rData.cd <= timestamp) {
                            rData.cd = timestamp;
                            delete rData.cdSum;
                            delete rData.cd;
                        }
                        if (!rData.cdSum) {
                            // 还未显示cd，手动加库存
                            let num = subCd / (propRow.milo * 1000);
                            num = Math.floor(num);
                            if (num > 0) {
                                rData.times += num;
                            }
                            if (rData.times > propRow.times) {
                                rData.times = propRow.times;
                            }
                        }
                        this.setRoomData(r, c);
                    }

                    if (rData.cdAuto) {
                        // 自动吐东西
                        rData.cdAuto -= subCd;
                        // 统一交给update里面去执行
                        this.update();
                    }

                    if (rData.cd || rData.cdAuto) {
                        ret.arr.push({ row: r, col: c });
                    }

                });
                this.setRoomData(row, col, {});
                return ret;
                break;
            case 11:
                // 加速装置
                if (!roomData.cd) {
                    let duration = propRow.p1 * 60 * 60 * 1000;
                    // test
                    // duration = 10 * 1000;
                    let timestamp = this.getCurrentTimestamp();
                    roomData.startTime = timestamp;
                    roomData.cd = timestamp + duration;
                    roomData.cdSum = duration;
                    roomData.notSubCd = true;
                    this.setRoomData(row, col);
                }
                break;
            default:
                break;
        }
    }

    // 获取无限能量剩余时间，单位：毫秒
    getComposePowerRemainTime() {
        let time = GameStorage.getInt(Const.DataKeys.composePowerTime, 0);
        let dt = time - this.getCurrentTimestamp();
        if (dt < 0) {
            dt = 0;
        }
        return dt;
    }

    // 出售房间物品
    sellRoomData(row: number, col: number, startPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        let coin = propRow.levelGold;
        if (!coin) {
            return;
        }
        composeModel.addPropNum(propIds.coin, coin, startPos);

        this.setRoomData(row, col, {});

        this.addManagerVal(Const.ManagerTypes.roomSell);

        return { roomData: roomData, coin: coin, row: row, col: col };
    }
    // 撤销出售操作
    sellBack(sellData: any) {
        let roomData = this.roomArr[sellData.row][sellData.col];

        this.subPropNum(propIds.coin, sellData.coin);
        if (roomData.id) {
            // 再尝试找其他空位置
            let emptyPos = this.getEmptyRoomPos();
            if (emptyPos) {
                this.setRoomData(emptyPos.row, emptyPos.col, sellData.roomData);
            } else {
                // 棋盘上没空房间了，放入顶部的卡片列表
                this.addPropNum(sellData.id);
            }
            return emptyPos;
        }

        // 优先放到原先位置
        this.setRoomData(sellData.row, sellData.col, sellData.roomData);

        return { row: sellData.row, col: sellData.col };

    }

    /**
     * 跳过cd时间
     * @param row 
     * @param col 
     * @param dt 跳过时长，单位：毫秒 
     * @param cdType cd类型 1：点击cd  2：自动吐物品cd
     */
    roomDataCdOver(row: number, col: number, dt: number, cdType: number) {
        let roomData = this.roomArr[row][col];
        let num = this.getOverCdCostDiamond(dt);
        if (this.getPropNumById(propIds.diamond) < num) {
            // 钻石数量不足
            this.showToast(localText.lackDiamond);
            return;
        }
        this.subPropNum(propIds.diamond, num);
        if (cdType == 1) {
            roomData.cd = this.getCurrentTimestamp();
        } else if (cdType == 2) {
            roomData.cdAuto = this.getCurrentTimestamp();
        }
        this.update();

        return true;
    }

    // 主动戳破气泡，获得气泡里的东西
    roomDataBubbleGet(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return;
        }
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        if (this.getPropNumById(propIds.diamond) < propRow.bubble) {
            // 钻石不足
            return;
        }
        this.subPropNum(propIds.diamond, propRow.bubble);
        delete roomData.cdBubble;
        this.sendRoomDataToServer(row, col);

        return true;
    }
    // 跳过气泡等待时间
    rommDataCdBubbleOver(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        roomData.cdBubble = this.getCurrentTimestamp();
        this.update();
    }

    setRoomData(row: number, col: number, roomData?: any) {
        if (roomData) {
            this.roomArr[row][col] = roomData;
        }
        this.sendRoomDataToServer(row, col);
    }

    getRoomDataBagInfo() {
        let ret: any = null;
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (roomData.id == propIds.bag) {
                ret = {};
                ret.roomData = roomData;
                ret.row = row;
                ret.col = col;
                return true;
            }
        });

        return ret;
    }

    consumeProp(propId: number, num: number) {
        let bagInfo = this.getRoomDataBagInfo();
        let hasBagProp = false;
        // 提交物品
        let hasInfo = this.getRoomDataHasInfoById(propId);
        let info = hasInfo.arr[0];
        if (info.isBag) {
            // 扣除背包里的物品
            bagInfo.roomData.roomArr[info.index] = {};
            hasBagProp = true;
        } else {
            // 扣除棋盘上的物品
            this.setRoomData(info.row, info.col, {});
        }
        if (hasBagProp) {
            this.sortBagRoomArr(bagInfo.row, bagInfo.col);
        }

    }

    onClickTaskDone(task: any, startPos?: Vec3) {
        let index = composeModel.taskArr.indexOf(task);
        let bagInfo = this.getRoomDataBagInfo();
        let hasBagProp = false;
        let subPropArr: any = [];
        // 提交物品
        for (let i in task.propArr) {
            let prop = task.propArr[i];
            let hasInfo = this.getRoomDataHasInfoById(prop.id);
            for (let j = 0; j < prop.num; j++) {
                let info = hasInfo.arr[j];
                if (info.isBag) {
                    // 扣除背包里的物品
                    bagInfo.roomData.roomArr[info.index] = {};
                    hasBagProp = true;
                } else {
                    // 扣除棋盘上的物品
                    this.setRoomData(info.row, info.col, {});
                }
                info.id = prop.id;
                subPropArr.push(info);
            }
        }
        if (hasBagProp) {
            this.sortBagRoomArr(bagInfo.row, bagInfo.col);
        }

        // 获得奖励
        this.addPropNum(propIds.star, task.starNum, startPos);

        let line = task.line
        if (line > 0)
            this.submitLineTask(task.taskId, line)
        // 删除任务
        composeModel.taskArr.splice(index, 1);

        // 生成新任务
        if (aiRobot.isRobot()) {
            composeModel.taskArr.push(aiRobot.createTask());
        } else {
            let nextHandTask = null;
            if (task.hand) {
                nextHandTask = this.createHandTask(task.id + 1);
            }
            if (nextHandTask) {
                // 新手任务
                composeModel.taskArr.push(nextHandTask);
            } else {
                let num = 0;
                for (let i = 0; i < tables.ins().config.taskProb.length; i++) {
                    let prob = tables.ins().config.taskProb[i];
                    if (Math.random() < prob) {
                        num++;
                    }
                }

                let maxNum = tables.ins().config.taskMax - composeModel.taskArr.length;
                if (num > maxNum) {
                    // 保证最多有tables.ins().config.taskMax个任务
                    num = maxNum;
                }
                if (composeModel.taskArr.length == 0 && num <= 0) {
                    // 保证至少有一个任务
                    num = 1;
                }
                if (num > 0) {
                    let retArr = this.createTask();
                    composeModel.taskArr = retArr//composeModel.taskArr.concat(retArr);
                }
            }
            tyqSDK.eventSendCustomEvent("玩家完成任务");
        }

        this.sendTaskArrToServer();
        this.addManagerVal(Const.ManagerTypes.taskDone);

        return subPropArr;
    }

    // 刷新任务
    refreshTask(task: any) {
        let index = composeModel.taskArr.indexOf(task);
        let newTask = this.createTask()[0];
        if (newTask) {
            newTask.id = task.id;
            newTask.hand = task.hand;
            composeModel.taskArr[index] = newTask;
            Notifications.emit(GD.event.refreshTask);
        }

    }

    /**
     * 根据策划配表数据格式，按照权重取出一个值
     * @param valStr 值,值,...
     * @param weightStr 权重,权重,...
     * @returns 
     */
    getValByDesignWeight(valStr: string, weightStr: string) {
        let valArr = ("" + valStr).split(",");
        let weightArr = ("" + weightStr).split(",");
        let arr: any = [];
        UtilPub.forArr(valArr, (val: any, index: number) => {
            let info: any = {};
            info.val = parseInt(val);
            info.weight = parseInt(weightArr[index]);
            arr.push(info);
        });
        let ret = UtilPub.getRowByWeight(arr);

        return ret.val;
    }

    // 从上到下，寻找首个空房间位置
    getEmptyRoomPos() {
        let emptyPos: any = null;
        UtilPub.for2Arr(this.roomArr, (data: any, r: number, c: number) => {
            if (!data.id) {
                emptyPos = {};
                emptyPos.row = r;
                emptyPos.col = c;
                return true;
            }
        }, true);

        return emptyPos;
    }

    // 房间是否被纸箱包住
    isRoomCarton(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.carton) {
            return true;
        }
        return false;
    }
    // 房间是否被蜘蛛网包住
    isRoomSpider(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.spider) {
            return true;
        }
        return false;
    }
    // 房间是否被汽包罩住
    isRoomBubble(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return false;
        }
        if (this.getCurrentTimestamp() <= roomData.cdBubble) {
            return true;
        }
        return false;
    }
    // 房间是否在走cd
    isRoomCd(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.cdSum > 0) {
            return true;
        }
        return false;
    }

    // 跳过cd需要花费的钻石数量
    getOverCdCostDiamond(dt: number) {
        let num = Math.ceil(dt / 1000 / 60 / tables.ins().config.minuteCost);

        return num;
    }

    /**
     * 获取棋盘上的物品情况
     * @param id 道具id
     * @returns 
     */
    getRoomDataHasInfoById(id: number) {
        let num = 0;
        let arr: any = [];
        let roomDataBag: any = null;
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this.isRoomBubble(row, col) || this.isRoomCarton(row, col) || this.isRoomSpider(row, col)) {
                return;
            }
            if (roomData.id == id) {
                num++;
                arr.push({ row: row, col: col });
            }
            if (roomData.id == propIds.bag) {
                roomDataBag = roomData;
            }
        });
        if (roomDataBag) {
            // 背包里的物品也要算
            for (let i = 0; i < roomDataBag.roomArr.length; i++) {
                let bagRoom = roomDataBag.roomArr[i];
                if (!bagRoom || !bagRoom.id) {
                    continue;
                }
                if (bagRoom.id == id) {
                    num++;
                    arr.push({ index: i, isBag: 1 });
                }
            }
        }
        return { num: num, arr: arr };
    }

    /**
     * 店长值班日里的任务统计
     * composeModel.addManagerVal(Const.ManagerTypes.roomSpeedUp);
     * @param type 任务类型
     * @param val 增加值，默认为1
     */
    addManagerVal(type: number, val: number = 1) {
        if (this.isManagerAllGet() || !this.managerArr) {
            return;
        }

        UtilPub.forArr(this.managerArr, (manager: any, index: number) => {
            let row = tables.ins().getTableValueByID(Const.Tables.manager, manager.id);
            if (row.taskType != type) {
                return;
            }
            if (manager.val >= row.p1 || manager.get) {
                return;
            }
            if (type == Const.ManagerTypes.roleLv) {
                manager.val = userData.roleLv;
            } else {
                manager.val += val;
            }
            this.sendManagerToServer(index);
            Notifications.emit(GD.event.composeManagerRefresh);
        });
    }
    getManagerVal(manager: any) {
        let row = tables.ins().getTableValueByID(Const.Tables.manager, manager.id);
        let val = manager.val;
        if (row.taskType == Const.ManagerTypes.roleLv) {
            val = userData.roleLv;
        }
        if (val > row.p1) {
            val = row.p1;
        }

        return val;
    }
    /**
     * 店长值班日 领取完成奖励
     * @param index 任务索引
     */
    managerGetAward(index: number, startPos: Vec3) {
        let manager = this.managerArr[index];
        if (manager.get) {
            return;
        }
        manager.get = true;
        this.sendManagerToServer(index);
        let row = tables.ins().getTableValueByID(Const.Tables.manager, manager.id);
        this.addPropNum(row.price[0], row.price[1], startPos);

        tyqSDK.eventSendCustomEvent("完成店长值班日任务" + manager.id);

        let allGet = true;
        for (let i = 0; i < this.managerArr.length; i++) {
            let man = this.managerArr[i];
            if (!man.get) {
                // 有未完成的任务
                allGet = false;
                break;
            }
        }
        if (allGet) {
            // 开启新任务
            this.createNextManager();
        }

        // 全部任务都已完成
        allGet = true;
        let tb = tables.ins().getTable(Const.Tables.manager);
        for (let i = 0; i < tb.length; i++) {
            let pManager = this.managerArr[i];
            if (!pManager || !pManager.get) {
                allGet = false;
                break;
            }
        }
        if (allGet) {
            GameStorage.setInt(Const.DataKeys.composeManagerAllGet, 1);
        }

        Notifications.emit(GD.event.composeManagerRefresh);
    }
    isManagerAllGet() {
        return GameStorage.getInt(Const.DataKeys.composeManagerAllGet);
    }

    /**
     * 提供的行列索引，是否在棋盘内
     * @param row 行索引
     * @param col 列索引
     */
    rowColInComposeLayer(row: number, col: number) {
        if (row >= 0 && row <= this.rowNum - 1 && col >= 0 && col <= this.colNum - 1) {
            return true;
        }
        return false;
    }

    // 点击卡片列表
    onClickCardLayer() {
        if (this.cardArr.length <= 0) {
            return;
        }
        let emptyPos = this.getEmptyRoomPos();
        if (!emptyPos) {
            return;
        }
        let id = this.cardArr.shift();
        let roomData = this.initRoomData(id);
        this.setRoomData(emptyPos.row, emptyPos.col, roomData);

        this.sendCardArrToServer();

        return emptyPos;
    }


    /**
     * 道具是否是能放到棋盘里的，并且可以产出东西
     * @param id 
     * @returns 
     */
    propCanCreateNewProp(id: number) {
        if (this.propIsPutInCardList(id)) {
            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
            if (propRow.anc || propRow.fair) {
                return true;
            }
        }
        return false;
    }
    /**
     * 判断道具是否是玩棋盘的卡片列表加入
     * @param id 
     * @returns 
     */
    propIsPutInCardList(id: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        if ((propRow.type >= 100 && propRow.type < 200) || propRow.type == 27) {
            // 直接获取
            return false;
        }
        return true;
    }
    /**
     * 获得道具
     * @param propId 道具id 
     * @param num 道具数量
     */
    addPropNum(propId: number, propNum: number = 1, startPos?: Vec3, endPos?: Vec3, notFlay = false) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("获得道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));
        if (this.propIsPutInCardList(propId)) {
            // 加到卡片列表里面
            for (let i = 0; i < propNum; i++) {
                this.cardArr.push(propId);
            }
            this.sendCardArrToServer();
            Notifications.emit(GD.event.composeCardLayerRefresh);
            if (notFlay) {
                return;
            }
            let composeLayer = this.getComposeLayer();
            if (!startPos) {
                startPos = this.getScreenMidPos();
            }
            if (composeLayer) {
                userData.showResFly(propId, propNum, startPos, composeLayer.getCardLayerPos());
            } else {
                userData.showResFly(propId, propNum, startPos, this.btnComposePos);
            }
        } else {
            if (propId == propIds.star) {
                if (!startPos) {
                    startPos = this.getScreenMidPos();
                }
                let composeLayer = this.getComposeLayer();
                if (composeLayer) {
                    endPos = composeLayer.getBtnBuildStarPos();
                } else {
                    endPos = this.btnComposePos;
                }
            }
            if (startPos) {
                if (!endPos) {
                    endPos = Vec3.ZERO;
                }
                userData.getProp([propId, propNum], startPos, endPos);
            } else if (endPos) {
                if (!startPos) {
                    startPos = this.getScreenMidPos();
                }
                userData.getProp([propId, propNum], startPos, endPos);
            } else {
                userData.getProp([propId, propNum], null, null);
            }
            //    Notifications.emit(GD.event.updateMoney);
        }
    }
    /**
     * 扣减道具
     * @param propId 道具id 
     * @param propNum 道具数量
     */
    subPropNum(propId: number, propNum: number = 1) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("扣减道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));

        if (propId == propIds.coin) {
            this.addManagerVal(Const.ManagerTypes.coinCost, propNum);
        } else if (propId == propIds.power) {
            this.addManagerVal(Const.ManagerTypes.powerCost, propNum);
            playerModel.addSeasonScore(propNum);
        }
        userData.checkAndUseProp([propId, propNum]);
        Notifications.emit(GD.event.updateMoney);
    }
    // 返回对应id的道具数量
    getPropNumById(propId: number) {
        return userData.curPropNum(propId);
    }

    /**
     * 删除当前合成模块的所有数据
     */
    deleteAllRoomData() {
        // 棋盘数据
        let keyArr: string[] = [];
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            keyArr.push(this.getRoomDataKey(row, col));
        });
        GameStorage.removeMulti(keyArr);

        // 任务数据
        GameStorage.removeItem(this.taskDataKey);

        // 店长值班日
        keyArr = [];
        UtilPub.forArr(this.managerArr, (manager: any, index: number) => {
            keyArr.push(this.getManagerDataKey(index));
        });
        GameStorage.removeMulti(keyArr);
        GameStorage.removeItem(Const.DataKeys.composeManagerAllGet);

        // 卡片列表
        GameStorage.removeItem(Const.DataKeys.composeCardArr);

        // 新手引导
        GameStorage.removeItem(Const.DataKeys.handIndex);
    }

    // 同步任务数据给服务端
    sendTaskArrToServer() {
        GameStorage.setObject(this.taskDataKey, this.taskArr);
    }

    // 同步店长订单表数据给服务器
    sendManagerToServer(index: number) {
        let manager = this.managerArr[index];
        let key = this.getManagerDataKey(index);
        GameStorage.setObject(key, manager);
    }

    // 同步卡片列表数据给服务端
    sendCardArrToServer() {
        GameStorage.setObject(Const.DataKeys.composeCardArr, this.cardArr);
    }

    /**
     * 同步房间数据给服务端
     * @param row 房间行索引
     * @param col 房间列索引
     * @param roomData 房间数据对象
     */
    sendRoomDataToServer(row: number, col: number, roomData?: any) {
        if (!roomData) {
            roomData = this.roomArr[row][col];
        }
        GameStorage.setObject(this.getRoomDataKey(row, col), roomData);
    }

    // 获取当前时间戳，单位：毫秒
    getCurrentTimestamp() {
        // let timestamp = new Date().getTime();
        let timestamp = TimeCtrJSF.GetInstance().ServerTime;

        return timestamp;
    }

    getTaskArrSort() {
        //   return composeModel.taskArr

        let arr = [];
        // 加上索引信息
        for (let i = 0; i < composeModel.taskArr.length; i++) {
            arr.push(composeModel.taskArr[i]);
        }


        // 根据完成进度排序
        UtilPub.sortArr(arr, (t1: any, t2: any) => {
            let t1Percent = 0;
            let onePercent = 1 / t1.propArr.length;
            for (let i in t1.propArr) {
                let prop = t1.propArr[i];
                let hasInfo = composeModel.getRoomDataHasInfoById(prop.id);
                let hasPercent = hasInfo.num / prop.num;
                if (hasPercent > 1) {
                    hasPercent = 1;
                }
                t1Percent += (hasPercent * onePercent);
            }
            let t2Percent = 0;
            onePercent = 1 / t2.propArr.length;
            for (let i in t2.propArr) {
                let prop = t2.propArr[i];
                let hasInfo = composeModel.getRoomDataHasInfoById(prop.id);
                let hasPercent = hasInfo.num / prop.num;
                if (hasPercent > 1) {
                    hasPercent = 1;
                }
                t2Percent += (hasPercent * onePercent);
            }

            if (t1Percent < 1 && t2Percent >= 1) {
                return true;
            }
            return false;
        });

        return arr;
    }

    getComposePropCount(propId: number) {
        return GameStorage.getInt(Const.DataKeys.composePropCount + propId, 0);
    }
    setComposePropCount(propId: number, val: number) {
        return GameStorage.setInt(Const.DataKeys.composePropCount + propId, val);
    }

    getHandIndex() {
        let handIndex = GameStorage.getInt(Const.DataKeys.handIndex, 1);
        if (aiRobot.isRobot()) {
            handIndex = handData.length;
            composeModel.setHandIndex(handIndex);
        }
        return handIndex;
    }
    addHandIndex() {
        let index = this.getHandIndex();
        tyqSDK.eventSendCustomEvent("完成新手教程" + index);
        index++;
        this.setHandIndex(index);
    }
    setHandIndex(handIndex: number) {
        GameStorage.setInt(Const.DataKeys.handIndex, handIndex);
    }
    closeHandLayer() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.close();
        }
    }
    handLayerHideHand() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.hideHand();
        }
    }
    isHandDone() {
        let handIndex = this.getHandIndex();
        if (handData[handIndex]) {
            return false;
        }
        return true;
    }
    getHandLayer(): any {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            return handLayer.getComponent(HandLayer);
        }
        return {};
    }
    getComposeLayer(): ComposeLayer | null {
        let composeLayer = find("Canvas/ComposeLayer");
        if (composeLayer) {
            return composeLayer.getComponent(ComposeLayer);
        }
        return null;
    }

    isTaskNeedWithId(id: number) {
        for (let i in this.taskArr) {
            let task = this.taskArr[i];
            for (let j in task.propArr) {
                if (task.propArr[j].id == id) {
                    return true;
                }
            }
        }
        return false;
    }

    // 打开激励视频
    openAd(info: string, cb?: Function) {
        if (Const.isDebug) {
            if (cb) {
                cb(true);
            }
            return;
        }
        tyqSDK.showRewardedAd(info, (st) => {
            if (st == 1) {
                if (cb) {
                    cb(true);
                }
                return;
            }
            this.showToast(localText.adAwardHint);
            if (cb) {
                cb(false);
            }
        });

    }

    showToast(info: string) {
        Notifications.emit(GD.event.showToast, info);
    }

    openPropInfoLayer(propId: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, propId);
        if (propRow.tan) {
            uiManager.instance.showDialog(Const.Dialogs.PropItemInfo, { propdata: propRow });
        } else {
            uiManager.instance.showDialog(Const.Dialogs.PropDetailLayer, propId);
        }
    }

    getScreenMidPos() {
        let width = view.getVisibleSize().width;
        let height = view.getVisibleSize().height;

        return v3(width * 0.5, height * 0.5, 0);
    }

    isRoomNormal(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || roomData.st == roomStatus.spider || roomData.st == roomStatus.carton || this.isRoomBubble(row, col)) {
            return false;
        }
        return true;
    }

    canAddTimes(id: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        if (propRow && propRow.chongneng && propRow.anc) {
            return true;
        }
        return false;
    }

    // 充能器
    roomAddTimes(row: number, col: number, targetRow: number, targetCol: number, val: number) {
        this.setRoomData(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        delete roomData.cdSum;
        roomData.times += val;
        UtilPub.log("增加次数：" + val, roomData.times);
        this.setRoomData(targetRow, targetRow);
    }

    canSplitProp(id: number, targetId: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        let targetPropRow = tables.ins().getTableValueByID(Const.Tables.prop, targetId);
        if (targetPropRow && targetPropRow.jiandao && targetPropRow.luna > 1 && targetPropRow.luna <= propRow.p1) {
            return true;
        }

        return false;
    }

    // 拆分器
    roomPropSplit(row: number, col: number, targetRow: number, targetCol: number) {
        this.setRoomData(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        let splitRoomData = this.initRoomData(roomData.id - 1);
        this.setRoomData(targetRow, targetCol, splitRoomData);
        let emptyPos = this.getEmptyRoomPos();
        if (emptyPos) {
            this.setRoomData(emptyPos.row, emptyPos.col, JSON.parse(JSON.stringify(splitRoomData)));
        }

        return { emptyPos: emptyPos };
    }

    canLvUpProp(id: number, targetId: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        let targetPropRow = tables.ins().getTableValueByID(Const.Tables.prop, targetId);
        if (!targetPropRow || this.propIsMaxLv(targetId)) {
            return false;
        }
        switch (propRow.mdt) {
            case 6:
                if (targetPropRow.putong1) {
                    return true;
                }
                break;
            case 7:
                if (targetPropRow.putong2) {
                    return true;
                }
                break;
            case 8:
                if (targetPropRow.putong3) {
                    return true;
                }
                break;
            case 9:
                if (!targetPropRow.nochaoji) {
                    return true;
                }
                break;
            case 10:
                if (targetPropRow.quanneng) {
                    return true;
                }
                break;
            default:
                break;
        }

        return false;
    }

    propIsMaxLv(id: number) {
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, id);
        let nextPropRow = tables.ins().getTableValueByID(Const.Tables.prop, id + 1);
        let isMaxLv = false;
        if (!nextPropRow || nextPropRow.type != propRow.type || nextPropRow.typeson != propRow.typeson) {
            isMaxLv = true;
        }
        return isMaxLv;
    }

    roomPropLvUp(row: number, col: number, targetRow: number, targetCol: number) {
        this.setRoomData(row, col, {});
        let targetRoomData = this.roomArr[targetRow][targetCol];
        let roomData = this.initRoomData(targetRoomData.id + 1);
        this.setRoomData(targetRow, targetCol, roomData);
    }

    propCanSpeedUp(id: number) {
        let row = tables.ins().getTableValueByID(Const.Tables.prop, id);
        if ((row.anc && row.milo) || row.faircd) {
            return true;
        }
        return false;
    }


    getRoomDataByItemUI(itemUI: Node) {
        // @ts-ignore
        return this.roomArr[itemUI.row][itemUI.col];
    }

}

const composeModel = ComposeModule.getInstane();

export { composeModel };

