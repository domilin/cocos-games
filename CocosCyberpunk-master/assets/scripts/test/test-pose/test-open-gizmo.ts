import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
import { Gizmo } from '../../core/util/util';
const { ccclass, property } = _decorator;

@ccclass('test_open_gizmo')
export class test_open_gizmo extends Component {

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown (event: EventKeyboard) {

        if (event.keyCode == KeyCode.KEY_M) {
            Gizmo.SetState();
        }

    }

}

