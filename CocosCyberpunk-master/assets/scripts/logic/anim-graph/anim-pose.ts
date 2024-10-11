import { _decorator, animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimPose')
export class AnimPose extends Component {

    @property({ type: animation.AnimationController })
    animGraph: animation.AnimationController;

    protected __preload (): void {
        this.animGraph = this.getComponent(animation.AnimationController);
    }

    public setValue (key: string, value: number | boolean) {
        this.animGraph.setValue_experimental(key, value);
    }

    public setLayer (number: number, value: number) {
        this.animGraph.setLayerWeight(number, value);
    }
}

