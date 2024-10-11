import { _decorator, Component, CurveRange, Node, RealCurve } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_cuve')
export class test_cuve extends Component {

    @property({ type: CurveRange })
    curveRange: CurveRange = new CurveRange();

    @property({ type: RealCurve })
    curve: RealCurve = new RealCurve();

    _time = 0;

    start () {

    }

    update (deltaTime: number) {

        var value = this.curveRange.evaluate(this._time, 1);
        //var value = this.curve.evaluate(this._time);
        console.log('time:', this._time, ' value:', value);
        this._time += deltaTime;
        if (this._time > 1) this._time = 0;

    }
}

