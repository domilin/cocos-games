import { _decorator, animation, color, Color, Component, CurveRange, game, math, Node, ParticleSystem, RealCurve, v3, Vec2, Vec3 } from 'cc';
import { AnimPose } from '../anim-graph/anim-pose';
import { Gizmo } from '../../core/util/util';
const { ccclass, property } = _decorator;

let P0 = v3(0, 0, 0);
let P1 = v3(0, 0, 0);

let direction = v3(0, 0, 0);
let cross = v3(0, 0, 0);
let forward = v3(0, 0, 0);

@ccclass('ActorTurn')
export class ActorTurn extends Component {

    currentAngle = 0;
    startAngle = 0;
    targetAngle = 0;

    @property
    thresholdTurn = 45;

    @property
    smooth = 10;

    @property({ type: AnimPose })
    anim: AnimPose;

    @property(Node)
    target: Node;

    @property
    curveName = 'actor_curve';

    @property({ type: CurveRange })
    curveCustom: CurveRange = new CurveRange();

    //@property({ type: RealCurve })
    //tempCurve: RealCurve = new RealCurve();

    @property
    waitTime = 0.5;

    waitTurn = 0;

    isTurn = false;

    turnEuler = v3(0, 0, 0);

    //curve: Curve;

    start () {

        //this.curve = CurveCore[this.curveName];

        /*
        for (const eventName of [
            `from n_pose to turn_90_r`, `from n_pose to turn_90_l`,
            `from n_pose to turn_180_r`, `from n_pose to turn_180_l`
        ]) {
            this.anim.onCustomEvent_experimental(eventName, () => {
                console.log(eventName);
            });
        }
        */

        this.anim = this.getComponent(AnimPose);
        this.anim.setValue('is_turn_over', true);

    }



    update (deltaTime: number) {

        this.calculateTurn();

        /*
        if (this.curve.isStart) {
            this.curve.onUpdate(deltaTime);
            this.currentAngle = this.startAngle + this.curve.position.x * this.targetAngle; //math.lerp(this.currentAngle, this.targetAngle, deltaTime * this.smooth);
            this.turnEuler.y = this.currentAngle;
            this.node.setRotationFromEuler(this.turnEuler);
            if (!this.curve.isStart) {
                this.anim.setValue('is_turn_over', true);
                this.anim.setValue('turn', 0);
                console.log('set turn is zero');
                this.isTurn = false;
            }
        }
        */

    }

    calculateTurn () {

        Vec3.copy(P0, this.target.worldPosition);
        Vec3.copy(P1, this.node.worldPosition);
        Vec3.copy(forward, this.node.forward);

        P0.y = 0;
        P1.y = 0;
        forward.y = 0;
        forward.multiplyScalar(-1);

        Vec3.copy(direction, P0);
        direction.subtract(P1);
        forward.subtract(P1);
        let angle = math.toDegree(Vec3.angle(direction, forward));
        Vec3.cross(cross, direction, forward);

        Gizmo.drawLine(Vec3.ZERO, P0, Color.GREEN);
        Gizmo.drawLine(Vec3.ZERO, this.node.forward, Color.YELLOW);
        Gizmo.drawLine(Vec3.ZERO, cross, Color.BLUE);

        if (cross.y > 0) angle = -angle;
        this.onTurn(angle);
    }

    onTurn (angle: number) {

        if (this.isTurn) return;

        //const value = this.anim.getAuxiliaryCurveValue_experimental('rotation_90');
        //console.log(value);

        if (Math.abs(angle) <= this.thresholdTurn) {
            this.waitTurn = this.waitTime;
            return;
        }

        if (this.waitTurn > 0) {
            this.waitTurn -= game.deltaTime;
            return;
        }

        this.isTurn = true;
        const turnValue = angle / 180;
        this.anim.setValue('is_turn', true);
        this.anim.setValue('turn', turnValue);
        console.log(' is turn value:', turnValue);
        this.targetAngle = angle;
        this.startAngle = this.currentAngle;
        //const anim_key = Math.abs(turnValue) >= 0.5 ? 'anim_curves_180' : 'anim_curves_90'
        //this.curve.play(anim_key, 2);
        //console.log('set', anim_key, ' turn :', turnValue);

    }
}

