import { ccclass, BaseComponent, winSize, Times } from "../../main/script/Main"


@ccclass("RecordTemp")
export class RecordTemp extends BaseComponent {

    private _startTime: number = -1
    private duration: number = -1
    private _onStartRecord: () => void = null!
    private _onStopRecord: () => void = null!

    public isUpdate = false

    onLoad() {
        super.onLoad()
        this.setPositionY(winSize().height, true)
    }

    public startRecord(duration: number) {
        this.duration = duration
        this._startTime = Times.second()
        this.isUpdate = true
        this.getCountDownByLabel("开始")
        this.scheduleOnce(() => {
            if (this._onStartRecord)
                this._onStartRecord()
        }, 1)
    }

    public pauseRecord() {
        this.isUpdate = false
        this.getCountDownByLabel("暂停")
    }

    public resumeRecord() {
        this.isUpdate = true
    }

    public stopRecord() {
        this.isUpdate = false
        this.Label.string = "停止"
        this.scheduleOnce(() => {
            if (this._onStopRecord)
                this._onStopRecord()
        }, 1)
    }

    public onUpdate() {
        if (!this.getCountDownByLabel("进行中"))
            this.stopRecord()
    }

    private getCountDownByLabel(str: string) {
        let second = this.getCountDown()
        if (second != -1 && second >= 0) {
            this.Label.string = str + Times.numMinute(second * 1000)
            return true
        }
        return false
    }

    private getCountDown(): number {
        if (this._startTime == -1)
            return -1
        return this._startTime + this.duration - Times.second()
    }

    public onStartRecord(cb: () => void) {
        this._onStartRecord = cb
    }

    public onStopRecord(cb: () => void) {
        this._onStopRecord = cb
    }

}