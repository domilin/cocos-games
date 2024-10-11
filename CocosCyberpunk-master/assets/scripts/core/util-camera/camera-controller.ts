import { _decorator, Component, EventMouse, Input, input, math, Node, utils, v2, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property({type:Node})
    followNode:Node | undefined;

    @property
    angleRange = v2(-20, 20);

    @property
    smooth = 5;

    targetPos = v3(0, 0, 0);
    smoothPos = v3(0, 0, 0);
    viewForward = v3(0, 0, 0);

    angleVec = v3(0, 0, 0);
    curAngleVec = v3(0, 0, 0);

    angleSpeed = 20;
    angleSmooth = 4;

    isDown = false;

    start() {

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        Vec3.copy(this.smoothPos, this.node.worldPosition);

    }

    onMouseDown(event:EventMouse) {
        this.isDown = true;
    }

    onMouseMove(event:EventMouse) {
        if(this.isDown) {
            //this.angle -= event.getDeltaX() / this.angleSpeed;
            this.angleVec.y -= event.getDeltaX() / this.angleSpeed;
            this.angleVec.x += event.getDeltaY() / this.angleSpeed;

            if(this.angleVec.x < this.angleRange.x) this.angleVec.x = this.angleRange.x;
            if(this.angleVec.x > this.angleRange.y) this.angleVec.x = this.angleRange.y;
            
        }
    }

    onMouseUp(event:EventMouse) {
        this.isDown = false;
    }

    update(deltaTime: number) {
        
        if(this.followNode != undefined) {

            Vec3.copy(this.targetPos, this.followNode.worldPosition);

            Vec3.lerp(this.smoothPos, this.smoothPos, this.targetPos, deltaTime * this.smooth);

            this.node.setWorldPosition(this.smoothPos);

            Vec3.copy(this.viewForward, this.node.forward);

            this.curAngleVec.x = math.lerp(this.curAngleVec.x, this.angleVec.x, this.angleSmooth * deltaTime);
            this.curAngleVec.y = math.lerp(this.curAngleVec.y, this.angleVec.y, this.angleSmooth * deltaTime);

            this.node.setRotationFromEuler(this.curAngleVec.x, this.curAngleVec.y, 0);
        }

    }
}

