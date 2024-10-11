import { _decorator, Component, director, Node, randomRange, Vec3 } from 'cc';
import { Msg } from '../../core/msg/msg';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {

    size = 2;
    time = -0.1;

    start () {
        Msg.on('msg_camera_shake', this.onShakeCamera.bind(this));
    }

    onDestroy () {
        Msg.off('msg_camera_shake', this.onShakeCamera.bind(this));
    }

    onShakeCamera (data: { time: number, size: number }) {
        this.time = data.time;
        this.size = data.size;
    }

    update (deltaTime: number) {
        this.time -= deltaTime;
        if (this.time > 0) {
            const x = this.node.eulerAngles.x;
            const y = this.node.eulerAngles.y;
            this.node.setRotationFromEuler(x, y, randomRange(-this.size, this.size));
        }
    }
}

