import { _decorator, Component, EventMouse, Input, input, math, Node, v2, Vec2, Vec3 } from 'cc';
import { UtilTmp } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('CameraControllerZoom')
export class CameraControllerZoom extends Component {

    @property({ type: Vec2 })
    distanceRange = v2(1, 20);

    @property(Node)
    cameraNode: Node;

    @property
    wheelSpeed = 50;

    @property
    smooth = 5;

    distance = 0;

    realDistance = 0;

    start () {
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.distance = this.cameraNode.position.length();
        this.realDistance = this.distance;
    }

    onMouseWheel (event: EventMouse) {
        const delta = event.getScrollY();
        this.distance -= delta / this.wheelSpeed;
        this.distance = math.clamp(this.distance, this.distanceRange.x, this.distanceRange.y);
    }

    update (deltaTime: number) {

        const thresholdDistance = Math.abs(this.distance - this.realDistance);
        if (thresholdDistance > 0.01) {
            this.realDistance = math.lerp(this.realDistance, this.distance, deltaTime * this.smooth);
            const localPosition = UtilTmp.V3_0;
            Vec3.copy(localPosition, this.cameraNode.position);
            localPosition.normalize().multiplyScalar(this.realDistance);
            this.cameraNode.setPosition(localPosition);
        }

    }
}

