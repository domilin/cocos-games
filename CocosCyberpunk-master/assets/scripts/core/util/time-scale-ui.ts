import { _decorator, Component, Node, Slider } from 'cc';
import { timeScale } from './time-scale-hack';
const { ccclass, property } = _decorator;

@ccclass('TimeScaleUI')
export class TimeScaleUI extends Component {
    start () {
        const slider = this.node.getComponent(Slider);
        if (slider) {
            this.onSliderValueChanged(slider);
        }
    }

    public onSliderValueChanged (slider: Slider) {
        timeScale(slider.progress);
    }
}


