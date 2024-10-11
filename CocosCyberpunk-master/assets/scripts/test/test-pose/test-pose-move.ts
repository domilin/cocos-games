import { _decorator, animation, Component, EventKeyboard, Input, input, KeyCode, Node, v2, v3, Vec2, Vec3 } from 'cc';
import { AnimPose } from '../../logic/anim-graph/anim-pose';
const { ccclass, property } = _decorator;

@ccclass('TestPoseMove')
export class TestPoseMove extends Component {

    @property({ type: AnimPose })
    animGraph: AnimPose;

    @property
    smooth = 1;

    direction = v2(0, 0);
    readDirection = v2(0, 0);

    leanDirection = v2(0, 0);

    move_w = 0;
    move_s = 0;
    move_a = 0;
    move_d = 0;

    start () {

        this.animGraph = this.getComponent(AnimPose);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy (): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard) {
        const keyCode = event.keyCode;
        if (keyCode == KeyCode.KEY_W) this.move_w = 1;
        if (keyCode == KeyCode.KEY_S) this.move_s = -1;
        if (keyCode == KeyCode.KEY_A) this.move_a = -1;
        if (keyCode == KeyCode.KEY_D) this.move_d = 1;

        this.direction.x = this.move_w + this.move_s;
        this.direction.y = this.move_a + this.move_d;
    }

    onKeyUp (event: EventKeyboard) {
        const keyCode = event.keyCode;
        if (keyCode == KeyCode.KEY_W) this.move_w = 0;
        if (keyCode == KeyCode.KEY_S) this.move_s = 0;
        if (keyCode == KeyCode.KEY_A) this.move_a = 0;
        if (keyCode == KeyCode.KEY_D) this.move_d = 0;

        this.direction.x = this.move_w + this.move_s;
        this.direction.y = this.move_a + this.move_d;
    }

    update (deltaTime: number) {

        Vec2.lerp(this.readDirection, this.readDirection, this.direction, this.smooth * deltaTime);
        Vec2.lerp(this.leanDirection, this.leanDirection, this.direction, this.smooth / 2 * deltaTime);

        const isMove = this.readDirection.length() > 0.01;
        this.animGraph.setValue('is_move', isMove);

        const walk_run = Math.abs(this.readDirection.length());
        const stride = walk_run;
        const move_y = this.readDirection.x;
        const move_x = this.readDirection.y;

        this.animGraph.setValue('walk_run', walk_run);
        this.animGraph.setValue('stride', stride);
        this.animGraph.setValue('move_x', move_x);
        this.animGraph.setValue('move_y', move_y);
        this.animGraph.setValue('lean_x', this.leanDirection.x);
        this.animGraph.setValue('lean_y', this.leanDirection.y);

    }
}

