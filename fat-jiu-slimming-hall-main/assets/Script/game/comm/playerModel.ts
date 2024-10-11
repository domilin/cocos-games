import { director, Vec3 } from "cc";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { Notifications } from "../../easyFramework/mgr/notifications";
import tables from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { composeModel } from "./composeModel";
import { userData } from "./UserData";

class PlayerModel {
    private static instance: PlayerModel = null!;
    public static getInstance(): PlayerModel {
        if (this.instance == null) {
            this.instance = new PlayerModel();
        }
        return this.instance;
    }

    saveDayTime: Date = null!;
    updateInterval: any = null;

    seasonScore = 0;
    seasonId = 1;
    seasonOpen = 0;

    public initData() {
        this.seasonScore = GameStorage.getInt(Const.DataKeys.seasonScore, 0);
        this.seasonId = GameStorage.getInt(Const.DataKeys.seasonId, 1);
        this.seasonOpen = GameStorage.getInt(Const.DataKeys.seasonOpen, 0);

        let saveDayTime = GameStorage.getInt(Const.DataKeys.saveDayTime, 0);
        if (saveDayTime) {
            this.saveDayTime = new Date(saveDayTime);
        } else {
            this.saveDayTime = new Date(composeModel.getCurrentTimestamp());
        }

        composeModel.initData();

        this.openUpdateSecond();


        // 为了测试方便，暂时这么做
        // @ts-ignore
        window.composeModel = composeModel;
        // @ts-ignore
        window.playerModel = this;
    }

    openUpdateSecond() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(this.update.bind(this), 1000);
        this.update();
    }

    public roleLvUp() {
        if (userData.roleLv >= tables.ins().config.seasonAwardUnlock) {
            // 解锁战令
            if (!this.seasonOpen) {
                this.seasonOpen = 1;
                GameStorage.setInt(Const.DataKeys.seasonOpen, this.seasonOpen);
                UtilPub.log("战令解锁了");
                Notifications.emit(GD.event.unlockSystem);
            }
        }

    }

    public getSeasonAwardOpen() {
        return false;
    }
    public addSeasonScore(score: number = 1) {
        if (!this.seasonOpen) {
            return;
        }
        this.seasonScore += score;
        let nextRow = tables.ins().getTableValueByID(Const.Tables.seasonAward, this.seasonId + 1);
        if (nextRow && this.seasonScore >= nextRow.num) {
            // 升级了
            this.seasonId++;
            GameStorage.setInt(Const.DataKeys.seasonId, this.seasonId);
            this.seasonScore -= nextRow.num;
            UtilPub.log("升级了");
        }
        GameStorage.setInt(Const.DataKeys.seasonScore, this.seasonScore);
        UtilPub.log("id:" + this.seasonId, "lv:" + (this.seasonId - 1), "score:" + this.seasonScore);
    }
    /**
     * 根据id，获得战令奖励领取情况
     * @param id 战令id
     * @returns 为空，表示还没达到领取条件
     */
    public getSeasonAwardInfoById(id: number) {
        let info = GameStorage.getObject(Const.DataKeys.seasonAwardInfo + id);
        if (!info && id <= this.seasonId) {
            info = {
                a1: 0,
                a2: 0
            };
        }
        return info;
    }
    /**
     * 战令领取普通奖励
     * @param id 战令id
     * @returns 
     */
    public seasonGetAward1(id: number,startPos:Vec3) {
        let info = this.getSeasonAwardInfoById(id);
        if (!info || info.a1) {
            return;
        }
        let row = tables.ins().getTableValueByID(Const.Tables.seasonAward, id);
        composeModel.addPropNum(row.award1[0], row.award1[1],startPos);
        info.a1 = 1;
        GameStorage.setObject(Const.DataKeys.seasonAwardInfo + id, info);
    }
    /**
     * 战令领取高级奖励
     * @param id 战令id
     * @returns 
     */
    public seasonGetAward2(id: number,startPos:Vec3) {
        let info = this.getSeasonAwardInfoById(id);
        if (!info || info.a2) {
            return;
        }
        let row = tables.ins().getTableValueByID(Const.Tables.seasonAward, id);
        composeModel.addPropNum(row.award2[0], row.award2[1],startPos);
        info.a2 = 1;
        GameStorage.setObject(Const.DataKeys.seasonAwardInfo + id, info);
    }
    // 重置战令系统
    public resetSeasonAward() {
        this.seasonId = 1;
        this.seasonScore = 0;
        GameStorage.setInt(Const.DataKeys.seasonScore, this.seasonScore);
        GameStorage.setInt(Const.DataKeys.seasonId, this.seasonId);

        let keyArr: any = [];
        let tb = tables.ins().getTable(Const.Tables.seasonAward);
        for (let i in tb) {
            let key = Const.DataKeys.seasonAwardInfo + tb[i].id;
            keyArr.push(key);
        }
        GameStorage.removeMulti(keyArr);
    }

    public overDay() {
        UtilPub.log("跨天了");
    }

    public overMonth() {
        UtilPub.log("跨月了");
        // this.resetSeasonAward();
    }

    public update() {
        if (director.getScene()!.name != "game") {
            return;
        }
        // UtilPub.log(this.saveDayTime.toLocaleString());

        let now = new Date(composeModel.getCurrentTimestamp());
        let overDay = false;
        if (this.saveDayTime.getDate() == now.getDate()) {
            if (now.getTime() - this.saveDayTime.getTime() >= 24 * 60 * 60 * 1000) {
                overDay = true;
            }
        } else {
            overDay = true;
        }

        if (overDay) {
            this.overDay();
            Notifications.emit(GD.event.overDay);
            let overMonth = false;
            if (this.saveDayTime.getMonth() == now.getMonth()) {
                if (now.getTime() - this.saveDayTime.getTime() >= 31 * 24 * 60 * 60 * 1000) {
                    overMonth = true;
                }
            } else {
                overMonth = true;
            }
            if (overMonth) {
                this.overMonth();
                Notifications.emit(GD.event.overMonth);
            }
            this.saveDayTime = now;
        }
    }

}

const playerModel = PlayerModel.getInstance();

export { playerModel };

