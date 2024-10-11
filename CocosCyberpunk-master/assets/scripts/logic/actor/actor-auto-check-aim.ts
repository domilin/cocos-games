import { _decorator, animation, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
import { ActorAnimationGraph } from './actor-animation-graph';
import { Msg } from '../../core/msg/msg';
const { ccclass, property } = _decorator;

@ccclass('ActorAutoCheckAim')
export class ActorAutoCheckAim extends Component {

    @property({ type: ActorAnimationGraph })
    animGraph: ActorAnimationGraph;

    layer = 0;

    start () {

        this.animGraph = this.getComponent(ActorAnimationGraph);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    onKeyDown (event: EventKeyboard) {

        if (event.keyCode == KeyCode.KEY_E) {
            this.layer = this.layer == 1 ? 0 : 1;
            this.animGraph.setLayer(1, this.layer);
            if (this.layer == 0) {
                Msg.emit('msg_player_ik_off');
            } else {
                Msg.emit('msg_player_ik_on');
            }
        }

    }

}

