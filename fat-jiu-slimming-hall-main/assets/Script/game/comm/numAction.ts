import { Component, Label, _decorator } from "cc";


const { ccclass, property } = _decorator;

@ccclass('numAction')
export class numAction extends Component {

    _targetNum = 0
    _isUpdate = false

    _delay = 5;

    setTargetNum(num: number) {
        this._targetNum = num
        this._isUpdate = true
    }

    update() {

        if (this._isUpdate) {
            if (this._delay > 0) {
                this._delay--
                return
            }
            this._delay = 5;
            let curNum = parseInt(this.node.getComponent(Label)!.string)
            if (curNum != this._targetNum) {
                if (Math.abs(curNum - this._targetNum) > 20) {
                    let step = Math.floor((this._targetNum - curNum) / 20)
                    if (Math.abs(step) < 20) {
                        step = step > 0 ? Math.max(Math.abs(step), 20) : Math.max(-Math.abs(step), -20)
                    }
                    curNum += step
                } else {
                    curNum += this._targetNum > curNum ? 1 : -1
                }
                this.node.getComponent(Label)!.string = curNum + ""
            } else {
                this._isUpdate = false
            }
        }
    }

}