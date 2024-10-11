import { _decorator, animation, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
import { AnimPose } from '../../logic/anim-graph/anim-pose';
const { ccclass, property } = _decorator;

@ccclass('TestRifleState')
export class TestRifleState extends Component {

    @property({ type: AnimPose })
    animGraph: AnimPose;

    base_pose_n = 1;
    base_pose_clf = 0;

    start () {

        this.animGraph = this.getComponent(AnimPose);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    onKeyDown (event: EventKeyboard) {

        const keyCode = event.keyCode;

        if (keyCode == KeyCode.DIGIT_0) this.animGraph.setValue('rifle_state', 0);
        if (keyCode == KeyCode.DIGIT_1) this.animGraph.setValue('rifle_state', 1);
        if (keyCode == KeyCode.DIGIT_2) this.animGraph.setValue('rifle_state', 2);
        if (keyCode == KeyCode.DIGIT_3) this.animGraph.setValue('rifle_state', 3);
        if (keyCode == KeyCode.KEY_C) {
            if (this.base_pose_n == 1) {
                this.base_pose_n = 0;
                this.base_pose_clf = 1;
            } else {
                this.base_pose_n = 1;
                this.base_pose_clf = 0;
            }
            this.animGraph.setValue('base_pose_n', this.base_pose_n);
            this.animGraph.setValue('base_pose_clf', this.base_pose_clf);
        }

        if (keyCode == KeyCode.KEY_F) {
            this.animGraph.setValue('isFire', true);
        }

        if (keyCode == KeyCode.KEY_T) {
            this.animGraph.setValue('isFire', false);
        }

        if (keyCode == KeyCode.KEY_N) {
            this.animGraph.setValue('n_turn_in_place', 0.5);
        }

    }

    onRifleFireEnd () {
        console.log(' on rifle fire end.');
        //this.animGraph.setValue('isFire', false);
    }

    update (deltaTime: number) {

    }
}

