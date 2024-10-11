import { _decorator, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimFootLock')
export class AnimFootLock extends Component {

    @property(Node)
    footBone: Node;

    @property
    thresholdMove = 0.2;

    prePos = v3(0, 0, 0);

    start () {

    }

    lateUpdate (deltaTime: number) {

        const footHeight = this.prePos.y - this.footBone.position.y;

        Vec3.copy(this.prePos, this.footBone.position);

        if (footHeight < this.thresholdMove) {
            this.footBone.setPosition(this.prePos);
        }

    }
}

