import { _decorator, Component, math, Node, v3, Vec3 } from 'cc';
import { ActorMoveCCT } from '../actor/actor-move-cct';
import { Actor } from '../actor/actor';
import { ActorAnimationGraph } from '../actor/actor-animation-graph';
const { ccclass, property } = _decorator;

let tempLinearVelocity = v3(0, 0, 0);

@ccclass('AnimPlayerMove')
export class AnimPlayerMove extends Component {

    @property(Node)
    playerRoot;

    _actorMove: ActorMoveCCT | undefined;

    actor: Actor;

    _animationGraph: ActorAnimationGraph | undefined;

    start () {

        this.actor = this.playerRoot.getComponent(Actor);
        this._actorMove = this.playerRoot.getComponent(ActorMoveCCT);
        this._animationGraph = this.getComponent(ActorAnimationGraph);

    }

    lateUpdate (deltaTime: number) {

        // Synchronize animation setup data.
        this._actorMove?.copyLinearVelocity(tempLinearVelocity);

        //tempLinearVelocity.y = 0;
        var linearVelocityLength = tempLinearVelocity.length();
        const eulerAnglesY = this.node.eulerAngles.y;

        //rotate y.
        Vec3.rotateY(tempLinearVelocity, tempLinearVelocity, Vec3.ZERO, math.toRadian(-eulerAnglesY));

        let num_velocity_x = tempLinearVelocity.x;
        let num_velocity_y = tempLinearVelocity.z;

        let moveSpeed = linearVelocityLength * this.actor._data.linear_velocity_animation_rate;

        // Check rotation.
        const angleSpeed = this._actorMove!.angle;
        if (linearVelocityLength < 0.01 && angleSpeed > 2) {
            //moveSpeed = angleSpeed * this._data.angle_velocity_animation_rate;
            //num_velocity_x = angleSpeed / this._data.angle_velocity_animation_scale;
        }
        this._animationGraph?.setValue('num_velocity_x', num_velocity_x);
        this._animationGraph?.setValue('num_velocity_y', -num_velocity_y);
        this._animationGraph?.setValue('num_move_speed', moveSpeed);

    }
}

