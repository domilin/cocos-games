import { _decorator, Component, math, Node, v3, CCFloat } from 'cc';
import { UtilVec3 } from '../../core/util/util';
import { ActorMove } from '../actor/actor-move';
import { Msg } from '../../core/msg/msg';
import { ActorMoveCCT } from './actor-move-cct';
const { ccclass, property } = _decorator;

@ccclass('ActorFace')
export class ActorFace extends Component {

    @property(Node)
    rotationNode: Node | undefined;

    @property({ type: ActorMoveCCT, tooltip: 'Test actor move.' })
    actorMove: ActorMoveCCT | undefined;

    @property(CCFloat)
    smoothAngle = 20;

    @property(CCFloat)
    smoothHeight = 1;

    targetAngle = v3(0, 0, 0);
    currentAngle = v3(0, 0, 0);

    targetPosition = v3(0, 0, 0);
    currentPosition = v3(0, 0, 0);

    start () {
        UtilVec3.copy(this.targetAngle, this.rotationNode!.eulerAngles);
        UtilVec3.copy(this.currentAngle, this.targetAngle);
        UtilVec3.copy(this.targetPosition, this.rotationNode!.position);
        UtilVec3.copy(this.currentAngle, this.targetPosition);
    }

    update (deltaTime: number) {

        this.rotationX(this.actorMove!.angleVertical);
        this.currentAngle.x = math.lerp(this.currentAngle.x, this.targetAngle.x, this.smoothAngle * deltaTime);
        this.rotationNode?.setRotationFromEuler(this.currentAngle);
        //this.currentPosition.y = math.lerp(this.currentPosition.y, this.targetPosition.y, this.smoothHeight * deltaTime);
        //this.rotationNode?.setPosition(this.currentPosition);

    }

    rotationX (angleX: number) {
        this.targetAngle.x = angleX;
    }
}

