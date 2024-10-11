import { _decorator, Component, game, math, Node, v2, Vec2 } from 'cc';
import { ActorMove } from '../actor/actor-move';
import { AnimPose } from './anim-pose';
import { ActorMoveCCT } from '../actor/actor-move-cct';
import { Msg } from '../../core/msg/msg';
import { ActorAnimationGraph } from '../actor/actor-animation-graph';
const { ccclass, property } = _decorator;

@ccclass('AnimPoseMove')
export class AnimPoseMove extends Component {

    @property({ type: ActorAnimationGraph })
    animGraph: ActorAnimationGraph;

    @property
    smooth = 3;

    direction = v2(0, 0);
    readDirection = v2(0, 0);

    leanDirection = v2(0, 0);

    @property({ type: ActorMoveCCT })
    actorMove: ActorMoveCCT;

    leanRatio = 0;

    acceleration_f = 0;

    start () {
        this.animGraph = this.getComponent(ActorAnimationGraph);
    }

    lateUpdate (deltaTime: number) {

        this.direction.x = this.actorMove.velocityLocal.z;
        this.direction.y = this.actorMove.velocityLocal.x;

        const isMove = this.readDirection.length() > 0.01;
        this.animGraph.setValue('is_move', isMove);


        const walk_run = Math.abs(this.actorMove.currentSpeed / this.actorMove.maxSpeed);
        this.animGraph.setValue('walk_run', walk_run);

        //let sprint_proportion = walk_run > 0.1 ? 1 : 0;
        //const move_proportion = 1 - sprint_proportion;

        //this.animGraph.setValue('sprint_proportion', sprint_proportion);
        //this.animGraph.setValue('move_proportion', move_proportion);
        //this.animGraph.setValue('acceleration_f', 1 - sprint_proportion);


        Vec2.lerp(this.readDirection, this.readDirection, this.direction, this.smooth * deltaTime);
        const move_x = -this.readDirection.y / this.actorMove.speed;
        const move_y = this.readDirection.x / this.actorMove.speed;
        this.animGraph.setValue('move_x', move_x);
        this.animGraph.setValue('move_y', move_y);


        Vec2.lerp(this.leanDirection, this.leanDirection, this.direction, deltaTime * 10);
        const lean_x = -this.leanDirection.x / this.actorMove.maxSpeed;
        const lean_y = this.leanDirection.y / this.actorMove.maxSpeed;
        this.animGraph.setValue('lean_x', lean_x);
        this.animGraph.setValue('lean_y', lean_y);


        // Calculate lean rate.
        this.leanRatio = math.lerp(this.leanRatio, 1 - this.actorMove.speedRate, game.deltaTime);
        //console.log('lean rate:', this.leanRatio);
        this.animGraph.setValue('lean_ratio', this.leanRatio);

        //const move_speed_scale = sprint_proportion > 0 ? 1 : 3;
        //console.log('this.direction.x:', this.direction.x, 'sprint_proportion:', sprint_proportion, 'move_proportion', move_proportion, 'move_speed_scale', move_speed_scale);
        // Set move speed multiplier.

        const move_speed_scale = this.actorMove.isRun ? 1 : 1;

        const speed_ratio = this.actorMove.speedRate * move_speed_scale;
        this.animGraph.setValue('speed_ratio', speed_ratio);

        // Sync F B L R LF RF RB RB
        //this.readDirection.normalize();
        const stride = this.actorMove.speedRate;
        this.animGraph.setValue('stride', stride);

        //console.log('currentSpeed:', this.actorMove.currentSpeed, 'speed', this.actorMove.speed, 'move_speed_scale:', move_speed_scale, 'max speed:', this.actorMove.maxSpeed, 'speed rate:', speed_ratio, ' stride:', stride);

        /*
        let F = this.readDirection.x < 0 ? -this.readDirection.x : 0;
        let B = this.readDirection.x > 0 ? this.readDirection.x : 0;
        let RF = 0;
        let RB = 0;
        let LF = 0;
        let LB = 0;

        if (this.readDirection.x >= 0) {
            RF = this.readDirection.y > 0 ? this.readDirection.y : 0;
            LF = Math.abs(this.readDirection.y < 0 ? this.readDirection.y : 0);
        } else {
            RB = this.readDirection.y > 0 ? this.readDirection.y : 0;
            LB = Math.abs(this.readDirection.y < 0 ? this.readDirection.y : 0);
        }

        const totalValue = F + B + RF + RB + LF + LB;

        if (totalValue == 0) {
            F = 1;
        } else if (totalValue > 1) {
            F /= totalValue;
            B /= totalValue;
            RF /= totalValue;
            RB /= totalValue;
            LF /= totalValue;
            LB /= totalValue;
        }

        //let speed_rate = Math.abs(this.actorMove.currentSpeed / this.actorMove.maxSpeed * 2);

        let speed_rate = 1;//Math.abs(this.actorMove.currentSpeed / this.actorMove.speed);

        console.log('walk run:', walk_run, 'speed', this.actorMove.speed, 'stride:', stride, 'directions:', F, B, RF, LF, RB, LB, 'speed rate:', speed_rate);
        this.animGraph.setValue('F', F);
        this.animGraph.setValue('B', B);
        this.animGraph.setValue('RF', RF);
        this.animGraph.setValue('LF', LF);
        this.animGraph.setValue('RB', RB);
        this.animGraph.setValue('LB', LB);

        //this.animGraph.setValue('speed_rate', speed_rate);
        */
    }
}

