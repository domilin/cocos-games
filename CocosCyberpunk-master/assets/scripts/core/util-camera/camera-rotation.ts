import { _decorator, Component, EventMouse, Input, input, math, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraRotation')
export class CameraRotation extends Component {
    

    @property
    angleSpeed = 100;
    @property
    angleSmooth = 10;

    @property
    maxAngleX = 30;

    @property
    minAngleX = -30;

    angle = 0;
    angleX = 0;
    currentAngle = 0;
    currentAngleX = 0;

    isMouseDown = false;

    start() {

        input.on(Input.EventType.MOUSE_DOWN, (event:EventMouse)=>{
            this.isMouseDown = true;
        }, this);

        input.on(Input.EventType.MOUSE_MOVE, (event:EventMouse)=>{
            if(!this.isMouseDown) return;
            this.angle += event.getDeltaX() / this.angleSpeed;
            this.angleX -= event.getDeltaY() / this.angleSpeed;
            this.angleX = math.clamp(this.angleX, this.minAngleX, this.maxAngleX);
        },this);

        input.on(Input.EventType.MOUSE_UP, (event:EventMouse)=>{
            this.isMouseDown = false;
        },this);

        this.angle = this.node.eulerAngles.y;
        this.currentAngle = this.angle;

    }

    update(deltaTime: number) {
        this.currentAngle = math.lerp(this.currentAngle, this.angle, deltaTime * this.angleSmooth);
        this.currentAngleX = math.lerp(this.currentAngleX, this.angleX, deltaTime * this.angleSmooth);
        this.node.setRotationFromEuler(this.currentAngleX, this.currentAngle, 0);
    }
}

