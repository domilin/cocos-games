import { _decorator, CCString, Component, CurveRange, Node, RealCurve } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CurveAsset')
export class CurveAsset {
    @property(CCString)
    name: string = 'curve-'

    @property({ type: CurveRange })
    curve: CurveRange = new CurveRange();

    public evaluate (time: number) {
        return this.curve.evaluate(time, 1);
    }
}

