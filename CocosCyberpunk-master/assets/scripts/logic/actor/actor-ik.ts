import { _decorator, animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActorIK')
export class ActorIK extends Component {

    @property({ type: animation.AnimationController })
    anim: animation.AnimationController;

    testWaitTime = 5;

    ratioIK = 0;

    update (deltaTime: number) {

        if (this.ratioIK >= 1) return;
        this.testWaitTime -= deltaTime;
        if (this.testWaitTime > 0) return;
        this.ratioIK += deltaTime;
        if (this.ratioIK > 1) this.ratioIK = 1;
        this.anim.setValue_experimental('ratio_ik', this.ratioIK);

    }
}

