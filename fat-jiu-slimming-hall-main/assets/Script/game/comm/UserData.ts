import { find, js, v3, Vec3 } from "cc";
import { Const } from "../../config/Const";
import { ActivityLockType, GoodsType, TujianState } from "../../config/global";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { uiManager } from "../../easyFramework/mgr/uiManager";
import { default as ServerCtr, default as ServerCtrJSF } from "../../easyFramework/network/ServerCtrJSF";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";
import tables from "../../easyFramework/other/tables";
import { tyqAdManager } from "../../tyqSDK/SDK/tyqAdManager";
import { tyqSDK } from "../../tyqSDK/SDK/tyqSDK";
import { aiRobot } from "./AIRobot";
import { composeModel } from "./composeModel";
import { GetAnimalLayer } from "./GetAnimalLayer";
import { playerModel } from "./playerModel";


class UserData {
    private static _instance: UserData = null!
    private static _isMergeSave = false;

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new UserData()
        }
        return this._instance
    }

    /**
        * 玩家头像
        */
    public get roleAvatar() {
        return GameStorage.getString(Const.DataKeys.roleAvatar, ServerCtr.GetInstance().avatar)
    }

    public set roleAvatar(roleAvatar) {
        GameStorage.setString(Const.DataKeys.roleAvatar, roleAvatar)
    }
    /**
     * 玩家名字
     */
    public get roleName() {
        return GameStorage.getString(Const.DataKeys.roleName, ServerCtrJSF.GetInstance().nickName)
    }

    public set roleName(name) {
        GameStorage.setString(Const.DataKeys.roleName, name)
    }

    /**
       * 玩家ID
       */
    public get roleID() {
        return ServerCtr.GetInstance().uid
    }

    public set roleID(id) {
        GameStorage.setString(Const.DataKeys.roleID, id)
    }
    /**
     * 玩家等级
     */
    public get roleLv() {
        return GameStorage.getInt(Const.DataKeys.roleLv, 1)
    }

    public set roleLv(lv) {
        GameStorage.setInt(Const.DataKeys.roleLv, lv)
        composeModel.addManagerVal(Const.ManagerTypes.roleLv);

        // 玩家等级发生变化了
        playerModel.roleLvUp();

        this.checkActivityOpen()
    }

    /**
     * 玩家经验
     */
    public get roleExp() {
        return GameStorage.getInt(Const.DataKeys.roleExp, 0)
    }

    public set roleExp(lv) {
        GameStorage.setInt(Const.DataKeys.roleExp, lv)
    }

    public checkAndUseExp(num: any) {
        if (this.roleExp >= num) {
            this.roleExp -= num
            return true
        }
        return false
    }

    /**
     * 仓库里的道具
     */

    public propWarehouse(id: number) {
        return GameStorage.getObject(Const.DataKeys.warehouseProp, [])
    }

    public pushPropWarehouse(id: number) {
        let list = GameStorage.getObject(Const.DataKeys.warehouseProp, [])
        list.push(id)
        GameStorage.setObject(Const.DataKeys.warehouseProp, list)
    }

    public shiftPropWarehouse(id: number) {
        let list = GameStorage.getObject(Const.DataKeys.warehouseProp, [])
        if (list.length > 0) {
            return list.shift()
        } else {
            return null
        }
    }

    /**
     * -----店长装扮 ----------
     */
    public get roleDressUpId() {
        let curDressUpId = GameStorage.getInt(Const.DataKeys.roleDressUpId, 0)
        if (curDressUpId == 0) {
            let dressData = tables.ins().getTableValuesByType(Const.Tables.roleDressUp, "type", "2")
            for (let index = 0; index < dressData.length; index++) {
                const element = dressData[index];
                if (element.price == 0) {
                    curDressUpId = element.id
                    this.roleDressUpId = curDressUpId
                    return curDressUpId
                }
            }
        }
        return curDressUpId
    }

    public set roleDressUpId(id: number) {
        GameStorage.setInt(Const.DataKeys.roleDressUpId, id)
    }

    public isHaveDressUpId(id: number) {
        return GameStorage.getInt(Const.DataKeys.roleDressUpId + id, 0) == 1
    }

    public buyDressUpId(id: number) {
        return GameStorage.setInt(Const.DataKeys.roleDressUpId + id, 1)
    }
    //---------------------

    //----钻石
    public get diamonds() {
        return GameStorage.getInt(Const.DataKeys.diamonds, tables.ins().config[Const.config.basicDiamons])
    }

    public set diamonds(num) {
        GameStorage.setInt(Const.DataKeys.diamonds, num)
    }

    public checkAndUseDiamonds(num: number) {
        if (this.diamonds >= num) {
            this.diamonds -= num
            return true
        }

        uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "1" })

        return false
    }

    //----体力
    public get power() {
        return GameStorage.getInt(Const.DataKeys.power, tables.ins().config[Const.config.energyMax])
    }

    public set power(num) {
        GameStorage.setInt(Const.DataKeys.power, num)
    }

    public checkAndUsePower(num: number) {
        if (this.power >= num) {
            this.power -= num
            return true
        }
        uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "2" })
        return false
    }

    //----金币
    public get coin() {
        return GameStorage.getInt(Const.DataKeys.coin, tables.ins().config[Const.config.basicGold])
    }

    public set coin(num) {
        GameStorage.setInt(Const.DataKeys.coin, num)
    }

    public checkAndUseCoin(num: number) {
        if (this.coin >= num) {
            this.coin -= num
            return true
        }
        uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "4" })
        return false
    }

    //-----装扮值
    public get dressValue() {
        return GameStorage.getInt(Const.DataKeys.dressValue, tables.ins().config[Const.config.basicDress])
    }

    public set dressValue(num) {
        GameStorage.setInt(Const.DataKeys.dressValue, num)
    }

    //-----装扮券
    public get dressMoney() {
        return GameStorage.getInt(Const.DataKeys.dressMoney, tables.ins().config[Const.config.basicDressMoney])
    }

    public set dressMoney(num) {
        GameStorage.setInt(Const.DataKeys.dressMoney, num)
    }

    public checkAndUseDressMoney(num: number) {
        if (this.dressMoney >= num) {
            this.dressMoney -= num
            return true
        }
        uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "3" })
        return false
    }

    //-----绿色星星
    public get greenStar() {
        return GameStorage.getInt(Const.DataKeys.greenStar, tables.ins().config[Const.config.basicGreenStar])
    }

    //-----绿色星星
    public set greenStar(num) {
        GameStorage.setInt(Const.DataKeys.greenStar, num)
    }

    public checkAndUseGreenStar(num: number) {
        if (this.greenStar >= num) {
            this.greenStar -= num
            aiRobot.addStarCost(num);
            return true
        }
        return false
    }

    /**
     * 获得道具
     * @param args "101,1000" 或者 [101,1000] 或者[[101,1000] ,[102,1000]] 
     */
    public getProp(args: any, starPos: Vec3 | null, endPos: Vec3 | null) {
        let fun = (propdata: any, num: number) => {
            switch (propdata.type) {
                case GoodsType.Coin:
                    this.coin += num
                    break;
                case GoodsType.Diamonds:
                    this.diamonds += num
                    break;
                case GoodsType.Exp:
                    this.roleExp += num
                    break;
                case GoodsType.Power:
                    this.power += num
                    break;
                case GoodsType.GreenStar:
                    this.greenStar += num
                    break;
                case GoodsType.DressMoney:
                    this.dressMoney += num
                    break;
                default:
                    break;
            }
            if (starPos && endPos) {
                this.showResFly(propdata.id, num, starPos, endPos)
            }
        }

        let propdata = null
        let num = 0
        if (typeof (args) == "string") {
            let reward = args.split(",")
            propdata = tables.ins().getTableValueByID(Const.Tables.prop, parseInt(reward[0]))
            num = parseInt(reward[1])
            fun(propdata, num)
        } else if (args instanceof Array && args.length > 0) {
            if (args[0] instanceof Array) {
                for (let index = 0; index < args.length; index++) {
                    const element = args[index];
                    propdata = tables.ins().getTableValueByID(Const.Tables.prop, element[0])
                    num = parseInt(element[1])
                    fun(propdata, num)
                }
            } else if (args instanceof Array) {
                propdata = tables.ins().getTableValueByID(Const.Tables.prop, args[0])
                num = parseInt(args[1])
                fun(propdata, num)
            }
        }
    }

    public showResFly(propId: number, num = 1, startPos: Vec3 = v3(0, 0, 0), endPos: Vec3 = v3(0, 0, 0)) {
        let showNum = Math.min(num, 10)
        let getAnimalLayer = find("Canvas")!.getChildByName("GetAnimalLayer")
        if (getAnimalLayer) {
            let script = getAnimalLayer.getComponent(GetAnimalLayer) as GetAnimalLayer
            if (script) {
                script!._layerData = { propId: propId, startPos: startPos, endPos: endPos, num: showNum }
                script!.showAni()
            }
            return
        }
        uiManager.instance.showDialog(Const.Prefabs.GetAnimalLayer, { propId: propId, startPos: startPos, endPos: endPos, num: showNum })
        // UtilPub.getPrefab(Const.Prefabs.GetAnimalLayer, (p: Prefab) => {
        //     let node = poolManager.instance.getNode(p, find("Canvas")!)
        //     let script = node.getComponent(node.name) as comm
        //     if (script) {
        //         script!._layerData = { propId: propId, startPos: startPos, num: showNum }
        //     }
        //     find("Canvas")?.addChild(node)
        // })
    }

    public checkAndUseProp(args: any) {
        if (args instanceof Array) {
            let propdata = tables.ins().getTableValueByID(Const.Tables.prop, parseInt(args[0]))
            if (propdata.type == GoodsType.Coin) {
                return this.checkAndUseCoin(args[1])
            } else if (propdata.type == GoodsType.Diamonds) {
                return this.checkAndUseDiamonds(args[1])
            } else if (propdata.type == GoodsType.DressMoney) {
                return this.checkAndUseDressMoney(args[1])
            } else if (propdata.type == GoodsType.GreenStar) {
                return this.checkAndUseGreenStar(args[1])
            } else if (propdata.type == GoodsType.Power) {
                return this.checkAndUsePower(args[1])
            }
        }
        return false
    }

    public curPropNum(id: number) {
        let propdata = tables.ins().getTableValueByID(Const.Tables.prop, id)
        if (propdata.type == GoodsType.Coin) {
            return this.coin
        } else if (propdata.type == GoodsType.Diamonds) {
            return this.diamonds
        } else if (propdata.type == GoodsType.DressMoney) {
            return this.dressMoney
        } else if (propdata.type == GoodsType.GreenStar) {
            return this.greenStar
        } else if (propdata.type == GoodsType.Power) {
            return this.power
        } else if (propdata.type == GoodsType.Exp) {
            return this.roleExp
        }
        return 0
    }


    public propBuyTime(id: number) {
        return GameStorage.getInt(Const.DataKeys.propBuyTime + id, 0)
    }

    public addPropBuyTime(id: number) {
        return GameStorage.setInt(Const.DataKeys.propBuyTime + id, this.propBuyTime(id) + 1)
    }

    //----图鉴
    private _tujianArr: any = []
    public get TujianArr() {
        if (this._tujianArr.length < 6) {
            let propData = tables.ins().getTable(Const.Tables.prop)
            propData.forEach((element: any, index: number) => {
                if (!this._tujianArr[element.type - 1] && element.type >= 1 && element.type <= 6) {
                    this._tujianArr[element.type - 1] = element
                }
            });
        }
        return this._tujianArr
    }

    //----装扮图鉴
    private _tujianSceneArr: any = []
    public get TujianSceneArr() {
        if (this._tujianSceneArr.length < 4) {
            let propData = tables.ins().getTable(Const.Tables.scene_room)
            propData.forEach((element: any, index: number) => {
                if (!this._tujianSceneArr[element.complete] && element.complete > 0) {
                    this._tujianSceneArr[element.complete - 1] = element
                }
            });
        }
        return this._tujianSceneArr
    }

    public isGetPropTujian(propId: number, key = Const.DataKeys.tujianProp) {
        return GameStorage.getInt(key + propId, 0)
    }

    public setGetPropTujian(propId: number, state: TujianState, key = Const.DataKeys.tujianProp) {
        if (state == TujianState.geted && GameStorage.getInt(key + propId, 0) == TujianState.unGet) {
            GameStorage.setInt(key + propId, TujianState.geted)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = true
            } else {
                this._showSceneTujianRed = true
            }
        } else if (state == TujianState.received && GameStorage.getInt(key + propId, 0) == TujianState.geted) {
            GameStorage.setInt(key + propId, TujianState.received)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = this.checkTujianRedPoint()
            } else {
                this._showSceneTujianRed = this.checkTujianSceneRedPoint()
            }
        }
    }

    public _showPropTujianRed = false
    public _showSceneTujianRed = false


    public checkTujianRedPoint(type = 0) {
        if (type > 0) {
            let propData = tables.ins().getTableValuesByType(Const.Tables.prop, "type", type)
            if (!propData) {
                return false
            }
            for (let index = 0; index < propData.length; index++) {
                const element = propData[index];
                if (this.isGetPropTujian(element.id) == TujianState.geted) {
                    return true
                }
            }
        } else {
            let propData = tables.ins().getTable(Const.Tables.prop)
            if (!propData) {
                return false
            }
            for (let index = 0; index < propData.length; index++) {
                const element = propData[index];

                if (element.type >= 1 && element.type <= 6 && this.isGetPropTujian(element.id) == TujianState.geted) {
                    return true
                }
            }
        }

        return false
    }

    public checkTujianSceneRedPoint(id = 0) {
        if (id > 0) {
            let itemData = tables.ins().getTableValuesByType(Const.Tables.scene_item, "room", id)
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                let skinData = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", element.id)
                skinData.forEach(skin => {
                    let index = skin.id % element.id
                    if (index > 0) {
                        if (userData.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                            return true
                        }
                    }
                })
            }
            return false
        } else {
            let roomData = tables.ins().getTable(Const.Tables.scene_room)
            for (let i = 0; i < roomData.length; i++) {
                if (roomData[i].complete > 0) {
                    let itemData = tables.ins().getTableValuesByType(Const.Tables.scene_item, "room", roomData[i].id)
                    for (let index = 0; index < itemData.length; index++) {
                        const element = itemData[index];
                        let skinData = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", element.id)
                        for (let j = 0; j < skinData.length; j++) {
                            const skin = skinData[j];
                            let index = skin.id % element.id
                            if (index > 0) {
                                if (userData.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return false
        }

    }

    public isGrowUpunLock(lv: number) {
        if (this.roleLv >= lv) {
            return GameStorage.getInt(Const.DataKeys.growUp + lv, TujianState.geted)
        }
        return TujianState.unGet
    }

    public setGrowUpState(lv: number, state: number) {
        GameStorage.setInt(Const.DataKeys.growUp + lv, state)
    }
    //----
    public savePropData() {
        // GameStorage.setObject("$propData", this.$propData)
        // this.$propData.forEach(element => {
        //     GameStorage.setObject("$propData_" + element.id, element)
        // });
        // this.$propData = GameStorage.getObjectArrayByKey("$propData_")
    }

    public get buyPowerTime() {
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)

        let lastTime = GameStorage.getInt(Const.DataKeys.buyPowerTime + "time", 0)
        if (lastTime > 0 && TimeCtrJSF.isSameDay(curTime, lastTime)) {
            GameStorage.setInt(Const.DataKeys.buyPowerTime + "time", curTime)
            let buyTime = GameStorage.getInt(Const.DataKeys.buyPowerTime, 1)
            return buyTime
        } else {
            GameStorage.setInt(Const.DataKeys.buyPowerTime, 1)
            GameStorage.setInt(Const.DataKeys.buyPowerTime + "time", curTime)
            return 1
        }
    }

    public addBuyPowerTime() {
        let buyTime = GameStorage.getInt(Const.DataKeys.buyPowerTime, 1)
        GameStorage.setInt(Const.DataKeys.buyPowerTime, buyTime * tables.ins().config[Const.config.diamonsPower][2])
    }

    public saveItem(key: string, value: any) {
        if (UserData._isMergeSave) {
            return
        }
        GameStorage.setObject(key, value)
    }

    public saveData() {
        let obj = js.createMap(true);
        for (let key in this) {
            if (key.indexOf('$') != -1) {
                obj[key] = this[key];
            }
        }
    }

    public checkActivityOpen() {
        let data = tables.ins().getTable(Const.Tables.lockActivity_item)
        data.forEach((activity: any) => {
            if (activity.cdType == ActivityLockType.type_Level) {
                if (this.roleLv >= activity.openLevel) {
                    let lastTime = GameStorage.getInt(activity.dataKey + "_time", 0)
                    if (lastTime <= 0) {
                        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
                        GameStorage.setInt(activity.dataKey + "_time", curTime)
                    }
                }
            }
        });
    }

    /**
     *  循环间隔 时间 CD
     * @param key 
     * @param time  cd 时间 单位秒
     * @returns 
     */
    public checkCDTime(key: string, time: number, startTime: number = 0) {
        let lastTime = GameStorage.getInt(key + "_time", 0) || startTime
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", curTime)
            lastTime = curTime
        }
        let interval = Math.floor((curTime - lastTime) / 1000)
        let addTime = 0
        if (interval > time) {
            addTime = Math.floor(interval / time)
            lastTime += time * 1000
            GameStorage.setInt(key + "_time", curTime)
            interval = interval % time
        }

        let needTime = time - interval
        if (needTime <= 0) {
            needTime = 0
            GameStorage.setInt(key + "_time", 0)
        }
        return [addTime, needTime]
    }

    public clearCDTime(key: string) {
        GameStorage.setInt(key + "_time", 0)
    }

    public checkEndTime(key: string, endTime: number) {
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        let needTime = endTime - curTime
        return needTime / 1000
    }

    public checkLimitTime(key: string, limitTime: number) {
        let startTime = GameStorage.getInt(key + "_time", 0)
        if (startTime <= 0) {
            return 0 //活动未开启
        }
        let endTime = startTime + limitTime
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        return endTime - curTime
    }

    /**
     * 返回当前已经领取的次数
     * @param key 活动key
     * @param interval  间隔多少时间刷新次数  单位分钟
     * @returns 
     */
    public getReceiveTime(key: string, interval: number) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", curTime)
            return GameStorage.getInt(key, 0)
        }
        if (TimeCtrJSF.isSameInterval(curTime, lastTime, interval)) {
            return GameStorage.getInt(key, 0)
        } else {
            GameStorage.setInt(key + "_time", curTime)
            GameStorage.setInt(key, 0)
            return 0
        }
    }


    /**
 * 返回当前活动已经领取的次数
 * @param key 活动key
 * @param interval  
 * @returns 
 */
    public getActivityReceiveTime(key: string) {
        return GameStorage.getInt(key, 0)
    }
    public setActivityReceiveTime(key: string) {
        return GameStorage.setInt(key, this.getActivityReceiveTime(key) + 1)
    }

    public setReceiveTime(key: string, interval: number) {
        GameStorage.setInt(key, this.getReceiveTime(key, interval) + 1)
    }

    public getIntervalCD(key: string, interval: number): number {

        if (interval <= 24 * 60) {
            let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let time1 = new Date(curTime)
            let curmin1 = time1.getHours() * 60 + time1.getMinutes()
            let num = curmin1 % interval
            return (interval - num) * 60 - time1.getSeconds()
        } else if (interval <= 24 * 60 * 7) {
            let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let time1 = new Date(curTime)
            return (7 - time1.getDay()) * 24 * 60 * 60 + this.getIntervalCD(key, 24 * 60);
        } else {
            let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let year = new Date(curTime).getFullYear()
            let month = new Date(curTime).getMonth()
            let endData = new Date(year, month + 1, 0).getTime()
            return (endData - curTime) / 1000
        }
    }

    public getLimitTimeData(key: string, interval: number, data: any, force: boolean = false, fun: Function | undefined = undefined) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0 || force) {
            GameStorage.setInt(key + "_time", curTime)
            GameStorage.setObject(key + "object", data)
            fun && fun(true)
            return data
        }
        if (TimeCtrJSF.isSameInterval(curTime, lastTime, interval)) {
            fun && fun(false)
            return GameStorage.getObject(key + "object", data)
        } else {
            GameStorage.setInt(key + "_time", curTime)
            GameStorage.setObject(key + "object", data)
            fun && fun(true)
            return data
        }
    }

    /**
  * 返回当前暂时的数据
  * @param key 活动key
  * @param interval  间隔多少时间刷新次数  单位分钟
  * @returns 
  */
    public getIntervalData(key: string, interval: number, data: string) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", curTime)
            return GameStorage.getString(key, "")
        }
        if (TimeCtrJSF.isSameInterval(curTime, lastTime, interval)) {
            return GameStorage.getString(key, "")
        } else {
            GameStorage.setInt(key + "_time", curTime)
            GameStorage.setString(key, "")
            return ""
        }
    }

    public setIntervarData(key: string, interval: number, data: string) {
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        GameStorage.setInt(key + "_time", curTime)
        GameStorage.setString(key, data)
    }

    public showGodWealthOther() {
        if (composeModel.isHandDone()) {
            let params = tyqAdManager.getEnterUrlQuery()
            console.error("params = ", params)
            // let params: any = { propList: "20011,30055,20022,20013,30057,20013", shareName: "胖啾啾啊", shareUserId: "444456302229491712" }
            if (params && params.shareUserId) {
                let propList = params.propList
                params.propList = propList.split(",")
                console.error("params2 = ", params)

                if (params.shareUserId == userData.roleID + "") {
                    uiManager.instance.showDialog(Const.Dialogs.GodWealthLayer);
                } else {
                    uiManager.instance.showDialog(Const.Dialogs.GodWealthOther, { params: params });
                }
                params = null
            }
        }
    }
}


export const userData = UserData.getInstance();
