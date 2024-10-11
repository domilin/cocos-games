import { Label, _decorator } from "cc";
import { userData } from "../../game/comm/UserData";
import BaseView from "../mgr/BaseView";
import { comm } from "../mgr/comm";
import { UtilPub } from "./UtilPub";

const { ccclass, property } = _decorator;

export enum CDType {
    CDIneterVal = 0, //间隔时间刷新
    CDCountdown = 1, //倒计时刷新
    CDFixTime = 2, //固定活动时间刷新
    CDCondition = 3, //条件开启限时活动
}
@ccclass('CdComponent')
export class CdComponent extends comm {


    _cdTime = 0

    _key: string = ""
    _interval: number = 0

    _cb: Function = null!
    _cdType = 0;

    _step = 13;
    _startTime = 0
    _endTime = 0

    _format = 0

    _ignoreSec = false;// 省略秒数

    start() {

    }

    setCD(type: CDType, key: string, interval: number, cb: Function = null!) {
        this._cdType = type
        this._key = key
        this._interval = interval
        this._cb = cb
        this._startTime = 0
        this.checkTime()
    }

    setCDByStart(key: string, startTime: number, endTime: number, cb: Function = null!) {
        this._cdType = CDType.CDFixTime
        this._key = key
        this._endTime = endTime
        this._cb = cb
        this._startTime = startTime
        this.checkTime()
    }

    setIgnoreSec(isIgnore: boolean) {
        this._ignoreSec = isIgnore
        return this
    }

    checkTime() {
        if (this._cdType == CDType.CDIneterVal) {
            this._cdTime = userData.getIntervalCD(this._key, this._interval)
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr2(this._cdTime * 1000) + ""
            } else {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr(this._cdTime * 1000) + ""
            }
        } else if (this._cdType == CDType.CDCountdown) {
            let num = userData.checkCDTime(this._key, this._interval, this._startTime)
            if (num[0] > 0) {
                if (this._cb) {
                    this._cb(num[0])
                }
            }
            this._cdTime = num[1]
            this.node.getComponent(Label)!.string = UtilPub.timerFormat(this._cdTime)
        } else if (this._cdType == CDType.CDCondition) {
            let num = userData.checkLimitTime(this._key, this._interval * 60 * 1000)
            this._cdTime = num
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr2(this._cdTime)
            } else {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr(this._cdTime)
            }
        } else {
            let num = userData.checkEndTime(this._key, this._endTime)
            if (num <= 0) {
                if (this._cb) {
                    this._cb()
                }
                num = 0
            }
            this._cdTime = num
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr2(this._cdTime * 1000)
            } else {
                this.node.getComponent(Label)!.string = UtilPub.getDurationStr(this._cdTime * 1000)
            }
        }
    }

    clearCD() {
        this._cdTime = 0
        this.node.getComponent(Label)!.string = ""
        userData.clearCDTime(this._key)
        this._cb = null!
    }

    update() {

        if (this._cdTime > 0) {
            if (this._step > 0) {
                this._step--
                return
            }
            this._step = 13
            this.checkTime()
        } else {
            if (this._cb) {
                this._cb(1)
                this._cb = null!
            }
        }
    }

}