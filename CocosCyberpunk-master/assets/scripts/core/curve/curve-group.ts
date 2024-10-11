import { _decorator, Component, error, Node } from 'cc';
import { CurveAsset } from './curve-asset';
const { ccclass, property } = _decorator;

@ccclass('CurveGroup')
export class CurveGroup extends Component {

    @property({ type: [CurveAsset] })
    assets: Array<CurveAsset> = [];

    curveMap: Record<string, CurveAsset> = {};

    public getCurve (name: string): CurveAsset {

        const curve = this.curveMap[name];
        if (curve == undefined) {
            throw new error('can not find curve name is:', name);
        }
        return curve;

    }

}

