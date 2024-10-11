import { _decorator, Component, Node } from 'cc';
import { AnimGraph } from './anim-graph';
const { ccclass, property } = _decorator;

@ccclass('AnimGraphOver')
export class AnimGraphOver extends Component {

    @property({ type: AnimGraph })
    animGraph: AnimGraph;

    @property
    base_percent = 1;

    @property
    over_percent = 0;

    @property
    over_index = 0;

    start () {
        this.animGraph = this.getComponent(AnimGraph);
    }

    updateValue () {
        this.animGraph.setValue('base_percent', this.base_percent);
        this.animGraph.setValue('over_percent', this.over_percent);
        this.animGraph.setValue('over_index', this.over_index);
    }

    setOver (index: number) {
        this.over_index = index;
    }

    update (deltaTime: number) {


    }
}

