import { _decorator, animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimGraph')
export class AnimGraph extends Component {

    @property({ type: animation.AnimationController })
    animGraph: animation.AnimationController;

    @property
    base_percent = 1;

    @property
    over_percent = 0;

    @property
    over_index = 0;

    __preload () {
        this.getComponent(animation.AnimationController);
    }

    public setValue (key: string, value: number | boolean) {
        this.animGraph.setValue_experimental(key, value);
    }

    setOverIndex (index: number) {
        this.over_index = index;
        this.animGraph.setValue('over_index', this.over_index);
    }

    setBlendBaseAndOver (isMove: boolean) {
        this.animGraph.setValue('base_percent', this.base_percent);
        this.animGraph.setValue('over_percent', this.over_percent);
    }

    update (deltaTime: number) {
    }


}

