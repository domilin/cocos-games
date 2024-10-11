import { _decorator, animation, CCFloat, color, Color, Component, game, geometry, math, Node, PhysicsSystem, quat, Quat, System, v3, Vec3 } from 'cc';
import { Const, Gizmo, UtilTmp } from '../../core/util/util';
import { ActorMoveCCT } from './actor-move-cct';
const { ccclass, property } = _decorator;


let midDirection = v3(0, 0, 0);
let startPos = v3(0, 0, 0);
@ccclass('ActorFootIK')
export class ActorFootIK extends Component {

    @property({ type: animation.AnimationController })
    anim: animation.AnimationController;

    @property(Node)
    root: Node;

    @property(Node)
    footBone: Node;

    @property(Node)
    midBone: Node;

    @property(Node)
    vbMidBone: Node;

    @property(Node)
    moveRoot: Node;

    @property({ type: ActorMoveCCT })
    actorMove: ActorMoveCCT;

    @property
    valueFootIKName = 'foot_ik_l';

    @property
    quatFootKey = 'quat_foot_l';

    @property
    poleFootName = 'pole_foot_l';

    @property(Vec3)
    footIKPos = v3(0, 0, 0);

    @property
    checkDistance = 0.2;

    @property
    heelHeight = 0.02;

    @property(Node)
    ballBone: Node;

    @property([CCFloat])
    masks = [];

    targetPos = v3(0, 0, 0);

    midIKPos = v3(0, 0, 0);

    @property
    smoothHeight = 2;

    finalHeight = 0;
    footHeight = 0;

    finalPos = v3(0, 0, 0);

    originFootQuat = quat(0, 0, 0, 1);
    targetFootQuat = quat(0, 0, 0, 1);
    footQuat = quat(0, 0, 0, 1);

    polePos = v3(0, 0, 0);

    _mask = 0;

    footToGroundDistance = 0;

    @property
    thresholdMove = 0.2;
    prePos = v3(0, 0, 0);

    start () {
        for (let i = 0; i < this.masks.length; i++)
            this._mask = this._mask | 1 << this.masks[i];


        this.node.setWorldPosition(this.footBone.worldPosition);
        this.resetBonePos();

    }

    resetBonePos () {
        Vec3.copy(this.finalPos, this.node.worldPosition);
        Vec3.copy(this.footIKPos, this.node.worldPosition);
        this.anim.setValue_experimental(this.valueFootIKName, this.footIKPos);

        Quat.copy(this.targetFootQuat, this.footBone.worldRotation);
        Quat.copy(this.footQuat, this.targetFootQuat);
        this.anim.setValue_experimental(this.quatFootKey, this.footQuat);

        Vec3.copy(this.polePos, this.vbMidBone.worldPosition);
        this.vbMidBone.setWorldPosition(this.polePos);
        this.anim.setValue_experimental(this.poleFootName, this.polePos);
    }

    lateUpdate (deltaTime: number) {

        let ray = UtilTmp.Ray;
        Vec3.copy(startPos, this.node.worldPosition);
        startPos.y += 1;
        Vec3.copy(ray.o, startPos);
        Vec3.copy(ray.d, Const.V3Down);

        Gizmo.drawLineDirection(ray.o, Const.V3Down, this.checkDistance + 1, Color.YELLOW);

        this.finalPos.set(this.node.worldPosition);
        this.finalPos.y += this.heelHeight;

        if (PhysicsSystem.instance.raycastClosest(ray, this._mask, this.checkDistance + 1, false)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            this.finalPos.set(result.hitPoint);
            this.finalPos.y += this.heelHeight;
            this.footToGroundDistance = this.footBone.worldPosition.y + result.hitPoint.y;
            Gizmo.drawBox(result.hitPoint, v3(0.02, 0.02, 0.02), Color.BLUE);
            if (Math.abs(result.hitNormal.x) + Math.abs(result.hitNormal.z) > 0.2) {
                this.calculateSlope(result.hitNormal);
            } else {
                Quat.copy(this.targetFootQuat, this.node.worldRotation);
            }

            Gizmo.drawLineDirection(startPos, Const.V3Down, this.checkDistance + 1, Color.RED);
        } else {
            Quat.copy(this.targetFootQuat, this.node.worldRotation);
            this.footToGroundDistance = 0;
            Gizmo.drawLineDirection(startPos, Const.V3Down, this.checkDistance + 0.5, Color.YELLOW);
        }

        // Calculate foot quat.
        Quat.slerp(this.footQuat, this.footQuat, this.targetFootQuat, game.deltaTime * 10);
        this.anim.setValue_experimental(this.quatFootKey, this.footQuat);

        // Calculate foot position.
        this.footIKPos = Vec3.lerp(this.footIKPos, this.footIKPos, this.finalPos, deltaTime * this.smoothHeight);
        this.anim.setValue_experimental(this.valueFootIKName, this.footIKPos);
        Gizmo.drawBox(this.footIKPos, v3(0.05, 0.05, 0.05), Color.YELLOW);

        Gizmo.drawBox(this.midBone.worldPosition, v3(0.05, 0.05, 0.05), Color.BLUE);
        Gizmo.drawBox(this.vbMidBone.worldPosition, v3(0.05, 0.05, 0.05), Color.GREEN);

        // Calculate pole position.
        Vec3.copy(this.polePos, this.vbMidBone.worldPosition);
        Vec3.copy(midDirection, this.vbMidBone.worldPosition);
        midDirection.subtract(this.node.worldPosition);
        midDirection.normalize();
        this.polePos.add(midDirection);
        this.anim.setValue_experimental(this.poleFootName, this.polePos);//this.vbMidBone.worldPosition);

        Gizmo.drawBox(this.polePos, v3(0.02, 0.02, 0.02), Color.MAGENTA);

        /*
        if (!Vec3.equals(this.footIKPos, this.node.position)) {
            console.log('not equals', this.footIKPos, this.node.position);
            debugger;
        }
        */
        const footPositionCurveValue = this.anim.getAuxiliaryCurveValue_experimental('feet_position');
        //console.log('feet position curve value:', footPositionCurveValue);

    }

    calculateSlope (slopeNormal: Vec3) {

        Quat.copy(this.originFootQuat, this.node.worldRotation);
        //const footDirection = UtilTmp.V3_0;
        //Vec3.copy(footDirection, this.ballBone.worldPosition);
        //footDirection.subtract(this.footBone.worldPosition);

        const quatFoot = UtilTmp.Quat_0;
        Quat.rotationTo(quatFoot, Const.V3Up, slopeNormal);
        const quatBone = UtilTmp.Quat_1;

        // offset quat add rotation quat.
        Quat.multiply(quatBone, quatFoot, this.originFootQuat);
        Quat.copy(this.targetFootQuat, quatBone);

        // Rotation root.
        //Quat.multiply(this.targetFootQuat, this.targetFootQuat, this.moveRoot.worldRotation);
    }

    /*
    checkHitGround() {
        Vec3.copy(this.targetPos, this.node.worldPosition);
        this.targetPos.y -= this.checkDistance;
        let ray = UtilTmp.Ray;
        Vec3.copy(ray.o, this.footBone.worldPosition);
        Vec3.copy(ray.d, Const.V3Down);
        Gizmo.drawLine(this.node.worldPosition, this.targetPos, Color.YELLOW);
        if(PhysicsSystem.instance.raycastClosest(ray, 1<<1, this.checkDistance, false)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            this.setValue(result.hitPoint.y + this.checkDistance);
            Gizmo.drawBox(result.hitPoint, v3(0.02, 0.02, 0.02), Color.BLUE);
            this.calculateSlope(result.hitNormal);
        }else{
            Quat.copy(this.targetFootQuat, this.node.worldRotation);
            this.setValue(this.node.position.y);
        }

        Quat.slerp(this.footQuat, this.footQuat, this.targetFootQuat, game.deltaTime * 20);
        this.anim.setValue_experimental(this.quatFootKey, this.footQuat);
        //this.footBone.setWorldRotation(this.footQuat);
    }
    */

    /*
    copyBoneNode() {
        UtilNode.nodeToNodeLocal(this.footIKPos, this.root, this.footBone);

        UtilNode.nodeToNodeLocal(this.midIKPos, this.root, this.midBone);

        this.vbMidBone.setPosition(this.midIKPos);

        this.footIKPos.y = this.height;

        Gizmo.drawBox(this.footIKPos, v3(0.05, 0.05, 0.05), Color.YELLOW);

        Gizmo.drawBox(this.midIKPos, v3(0.05, 0.05, 0.05), Color.GREEN);

        console.log(this.footIKPos);

        this.anim.setValue_experimental(this.valueFootIKName, this.footIKPos); 
    }
    */
}

