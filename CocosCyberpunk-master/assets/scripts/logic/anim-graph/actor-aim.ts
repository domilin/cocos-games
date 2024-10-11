import { _decorator, animation, Component, math, Node, Quat, quat, v3, Vec3 } from 'cc';
import { Gizmo } from '../../core/util/util';
const { ccclass, property } = _decorator;

let tempDirection = v3(0, 0, 0);

let normalDirection = v3(0, 0, 0);
let tempQuat = quat(0, 0, 0, 1);
let temVec3 = v3(0, 0, 0);

let forward = v3(0, 0, 0);

@ccclass('ActorAim')
export class ActorAim extends Component {

    @property({ type: Node })
    headNode: Node;

    @property
    smooth = 2;

    @property
    turnThreshold = 0.01;

    aimPoint = v3(0, 0, 0);

    aimHorizontal = 0;
    aimVertical = 0;

    currentAimHorizontal = 0;
    currentAimVertical = 0;

    anim: animation.AnimationController;

    @property({ type: Node })
    cameraNode: Node;

    start () {

        this.anim = this.getComponent(animation.AnimationController);

    }

    lookAtPoint (point: Vec3) {

        // Calculate horizontal
        Vec3.copy(forward, this.node.forward);
        forward.multiplyScalar(-1);
        Vec3.copy(normalDirection, this.cameraNode.forward);
        normalDirection.y = 0;
        normalDirection.normalize();
        let side = Vec3.cross(temVec3, normalDirection, forward);
        let horizontalAngle = math.toDegree(Vec3.angle(normalDirection, forward));
        this.aimHorizontal = math.clamp(horizontalAngle, 0, 90);
        if (side.y <= 0) horizontalAngle *= -1;
        this.aimHorizontal = (horizontalAngle + 90) / 180;
        //console.log(horizontalAngle, this.aimHorizontal);

        this.aimVertical = (this.cameraNode.eulerAngles.x + 45) / 90;
        Gizmo.drawLine(this.headNode.worldPosition, point);

    }

    update (deltaTime: number) {

        if (Math.abs(this.currentAimHorizontal - this.aimHorizontal) > this.turnThreshold) {
            this.currentAimHorizontal = math.lerp(this.currentAimHorizontal, this.aimHorizontal, deltaTime * this.smooth);
            this.anim.setValue_experimental('aim_horizontal', this.currentAimHorizontal);
        }
        if (Math.abs(this.currentAimVertical - this.aimVertical) > this.turnThreshold) {
            this.currentAimVertical = math.lerp(this.currentAimVertical, this.aimVertical, deltaTime * this.smooth);
            this.anim.setValue_experimental('aim_vertical', this.currentAimVertical);
        }
    }
}

