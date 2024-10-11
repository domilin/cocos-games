import { _decorator, Node, Label, ScrollView, find, Sprite, instantiate, Vec3, ProgressBar, } from 'cc';
import { Const } from '../../../config/Const';
import tables from '../../../easyFramework/other/tables';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('TreasureModel')
export class TreasureModel {

    private static _treasureData: any = null
    private static _timeData: any = null
    static get timeData() {
        if (this._timeData == null) {
            this._timeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", "10012")
        }
        return this._timeData!
    }

    static initLimitData(force: boolean = false) {
        let propData = tables.ins().getTableValuesByType(Const.Tables.prop, "abao1", "1")
        let propData2 = tables.ins().getTableValuesByType(Const.Tables.prop, "abao2", "2")
        let bao1 = []
        let bao2 = []

        for (let index = 0; index < 6; index++) {
            bao1.push(propData[Math.floor(Math.random() * propData.length)])
            bao2.push(propData[Math.floor(Math.random() * propData2.length)])
        }

        this._treasureData = { bao1: bao1, bao2: bao2, receive: [0, 0, 0, 0, 0, 0, 0], freeReflesh: 0 }
        this._treasureData = userData.getLimitTimeData(this.timeData.dataKey, this.timeData.cdTime, this._treasureData, force)
        return this._treasureData
    }

    static get treasureData() {
        if (this._treasureData == null) {
            this.initLimitData(false)
        }
        return this._treasureData
    }

    static saveTreasureData() {
        userData.getLimitTimeData(this.timeData.dataKey, this.timeData.cdTime, this.treasureData, true)
    }


    static get receiveNum() {
        let num = 0
        for (let index = 0; index < 6; index++) {
            if (this.treasureData.receive[index] == 1) {
                num++
            }
        }
        return num
    }

    static get isReceiveGift() {
        return this.treasureData.receive[6] != 0
    }

    static set receiveGift(state: number) {
        this.treasureData.receive[6] = state
        this.saveTreasureData()
    }

    static checkCompseHasProp(propId: number) {
        return false //阿宝的货车功能关闭
        for (let index = 0; index < 6; index++) {
            if (this.treasureData.bao1[index].id == propId && this.treasureData.receive[index] == 0) {
                return true
            }
        }
        return false
    }
}

