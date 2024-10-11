import { _decorator, Component, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIEnablePlayAnimation')
export class UIEnablePlayAnimation extends Component {

    _anim: Animation | undefined | null

    onEnable () {

        if (!this._anim) {
            this._anim = this.getComponent(Animation);
        }

        this._anim?.stop();
        this._anim?.play();
    }

}
