import { _decorator, Camera, Component, Node } from 'cc';
import { Gizmo } from './util';
const { ccclass, property } = _decorator;

@ccclass('GizmoCamera')
export class GizmoCamera extends Component {

    start () {
        Gizmo.setCamera(this.getComponent(Camera));
    }

}

