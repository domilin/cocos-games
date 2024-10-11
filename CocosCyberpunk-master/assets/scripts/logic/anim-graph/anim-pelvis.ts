import { _decorator, animation, CCFloat, Color, Component, math, Node, PhysicsSystem, v3, Vec3 } from 'cc';
import { ActorFootIK } from '../actor/actor-foot-ik';
import { Const, Gizmo, UtilTmp } from '../../core/util/util';
import { ActorMoveCCT } from '../actor/actor-move-cct';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('AnimPelvis')
export class AnimPelvis extends Component {

    @property({ type: ActorFootIK })
    footIKL: ActorFootIK;

    @property({ type: ActorFootIK })
    footIKR: ActorFootIK;

    @property({ type: animation.AnimationController })
    anim: animation.AnimationController;

    @property(Node)
    root: Node;

    @property(Node)
    pelvisNode: Node;

    @property({ type: ActorMoveCCT })
    move: ActorMoveCCT;

    @property
    checkDistance = 0.5;

    @property
    thresholdMove = 0.5;

    @property
    heelHeight = 0.1;

    @property([CCFloat])
    masks = [];

    rootPos = v3(0, 0, 0)

    finalY = 0;

    _mask = 0;

    footToGroundDistance = 0;

    currentPos = v3(0, 0, 0);

    __preload () {
        for (let i = 0; i < this.masks.length; i++)
            this._mask = this._mask | 1 << this.masks[i];

        Vec3.copy(this.rootPos, this.root.worldPosition);
        this.anim.setValue_experimental('root_position', this.rootPos);

    }

    lateUpdate (deltaTime: number) {

        Gizmo.drawSphere(this.pelvisNode.worldPosition, 0.1, Color.RED);


        Vec3.copy(this.rootPos, this.root.worldPosition);

        //const maxFootDistance = Math.max(this.footIKL.footToGroundDistance, this.footIKR.footToGroundDistance);
        //this.rootPos.y = maxFootDistance;

        /*
        let ray = UtilTmp.Ray;
        Vec3.copy(ray.o, this.pelvisNode.worldPosition);
        Vec3.copy(ray.d, Const.V3Down);

        Gizmo.drawLineDirection(this.pelvisNode.worldPosition, Const.V3Down, this.checkDistance, Color.YELLOW);
        if (PhysicsSystem.instance.raycastClosest(ray, this._mask, this.checkDistance, false) && this.move.isGrounded) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            this.rootPos.y = result.hitPoint.y;
        }
        */

        if (this.move.isGrounded) {
            let footHL = this.calculateFootGround(this.footIKL.node);
            this.rootPos.y = Math.min(footHL, this.rootPos.y);

            let footHR = this.calculateFootGround(this.footIKR.node);
            this.rootPos.y = Math.min(footHR, this.rootPos.y);
        }

        //this.currentPos = Vec3.lerp(this.currentPos, this.currentPos, this.rootPos, deltaTime * 20);

        this.anim.setValue_experimental('root_position', this.rootPos);

    }

    calculateFootGround (node: Node) {

        let ray = UtilTmp.Ray;
        Vec3.copy(ray.o, node.worldPosition);
        Vec3.copy(ray.d, Const.V3Down);
        ray.o.y += 0.5;

        //Gizmo.drawLineDirection(ray.o, Const.V3Down, this.checkDistance, Color.YELLOW);
        if (PhysicsSystem.instance.raycastClosest(ray, this._mask, this.checkDistance, false)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            return result.hitPoint.y + this.heelHeight;
        }

        return Number.MAX_VALUE;

    }
}

