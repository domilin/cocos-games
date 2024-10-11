import { Component, v3, Vec3, _decorator } from 'cc';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
const { ccclass, property } = _decorator;

@ccclass('MovePath')
export class MovePath extends Component {

    startPos: any = null;
    endPos: any = null;
    ctrlPos: Vec3 = v3(0, 0, 0);
    endCb: any = null;

    // 每秒走多少百分比
    speed: number = 0;
    moveStart: boolean = false;
    percent: number = 0;

    p1: Vec3 = v3(0, 0, 0);
    p2: Vec3 = v3(0, 0, 0);
    p3: Vec3 = v3(0, 0, 0);

    startMove(startWorldPos: Vec3, endWorldPos: Vec3, time: number = 0.3, endCb?: Function, dir = 0) {
        this.startPos = UtilPub.convertToNodeSpace(this.node, startWorldPos);
        this.endPos = UtilPub.convertToNodeSpace(this.node, endWorldPos);
        this.endCb = endCb;

        this.speed = 1 / time / 2;
        if (this.speed < 1) {
            this.speed = 1;
        }

        Vec3.lerp(this.ctrlPos, this.startPos, this.endPos, 0.5);
        let dx = Math.abs(this.endPos.x - this.startPos.x);
        let dy = Math.abs(this.endPos.y - this.startPos.y);
        if (Math.abs(dy) >= Math.abs(dx)) {
            // this.ctrlPos.x += (dx + 50 + Math.random() * 100) * (dir == 0 ? (Math.random() > 0.5 ? 1 : -1) : dir);
            this.ctrlPos.x += (dy * 0.5) * (dir == 0 ? (Math.random() > 0.5 ? 1 : -1) : dir);
        } else {
            this.ctrlPos.y += (dx * 0.5) * (dir == 0 ? (Math.random() > 0.5 ? 1 : -1) : dir);
        }

        this.node.position = this.startPos;
        this.moveStart = true;
    }

    update(dt: number) {
        if (!this.moveStart) {
            return;
        }
        this.speed += (dt * 4);
        this.percent += (dt * this.speed);

        if (this.percent >= 1) {
            this.percent = 1;
        }

        Vec3.lerp(this.p1, this.startPos, this.ctrlPos, this.percent);
        Vec3.lerp(this.p2, this.ctrlPos, this.endPos, this.percent);
        Vec3.lerp(this.p3, this.p1, this.p2, this.percent);

        this.node.position = this.p3;

        if (this.percent >= 1) {
            this.percent = 1;
            this.moveStart = false;
            if (this.endCb) {
                this.endCb();
            }
        }

    }
}


