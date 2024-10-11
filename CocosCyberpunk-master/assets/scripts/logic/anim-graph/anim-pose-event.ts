import { _decorator, Component, Node } from 'cc';
import { Msg } from '../../core/msg/msg';
import { AnimPose } from './anim-pose';
import { ActorAnimationGraph } from '../actor/actor-animation-graph';
const { ccclass, property } = _decorator;

@ccclass('AnimPoseEvent')
export class AnimPoseEvent extends Component {

    @property({ type: ActorAnimationGraph })
    animGraph: ActorAnimationGraph;

    protected start (): void {
        this.animGraph = this.getComponent(ActorAnimationGraph);
    }

    onEquipBackStart () {
        Msg.emit('msg_player_ik_off');
    }

    onEquipEnd () {
        Msg.emit('msg_player_ik_on');
    }

    onJumpEnd () {
    }

    onJump () {
        //this.animGraph.setLayer(1, 0);
        this.animGraph.setValue('ratio_ik', 0);
        this.animGraph.setValue('ratio_weapon', 0);
        Msg.emit('msg_player_ik_off');
    }

    offJump () {
        //this.animGraph.setLayer(1, 1);
        this.animGraph.setValue('ratio_ik', 1);
        this.animGraph.setValue('ratio_weapon', 1);
        Msg.emit('msg_player_ik_on');
    }

    onFire () {
        this.animGraph.setValue('ratio_weapon', 1);
    }

    offFire () {
        this.animGraph.setValue('ratio_weapon', 0);
    }

    onShoot () {
        Msg.emit('msg_player_ik_on');
    }

    offShoot () {
        Msg.emit('msg_player_ik_off');
    }

}

