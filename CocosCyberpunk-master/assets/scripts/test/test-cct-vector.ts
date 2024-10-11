import { _decorator, Component, Node, RigidBody, v3, Vec3 } from 'cc';
import { ActorMoveCCT } from '../logic/actor/actor-move-cct';
const { ccclass, property } = _decorator;

@ccclass('TestCCTVector')
export class TestCCTVector extends Component {

    @property(ActorMoveCCT)
    move: ActorMoveCCT | undefined;

    @property(Vec3)
    velocity: Vec3 = v3(0, 0, 0);

    start () {

    }

    lateUpdate (deltaTime: number) {

        this.node.setWorldPosition(this.move.node.worldPosition);
        Vec3.copy(this.velocity, this.move.velocity);
        if (this.velocity.length() > 0.5) {
            this.velocity.add(this.node.worldPosition);
            this.node.lookAt(this.velocity);
        }
    }
}

