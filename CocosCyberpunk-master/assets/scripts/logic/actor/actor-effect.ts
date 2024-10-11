import { _decorator, Component, Node } from 'cc';
import { fx } from '../../core/effect/fx';
import { key_type_boolean } from '../../core/action/action';
import { FxBase } from '../../core/effect/fx-base';
const { ccclass, property } = _decorator;

@ccclass('ActorEffect')
export class ActorEffect extends Component {

    _map: Record<string, Node> = {};

    protected __preload (): void {
        this.node.on('on_fx', this.onFx, this);
        this.node.on('off_fx', this.offFx, this);
    }

    protected onDestroy (): void {
        this.node.off('on_fx', this.onFx, this);
        this.node.off('off_fx', this.offFx, this);
    }

    onFx (data: any) {
        if (data.state == 'child') {
            fx.play(this.node, data.name);
        } else if (data.state == "loop") {
            fx.playLoop(this.node, data.key, data.value);
        } else if (data.state == 'new') {
            const followNode = data.is_follow ? this.node : undefined;
            const effectNode = fx.on(data.name, this.node.position, undefined, followNode);
            this._map[data.name] = effectNode;
        }
    }

    offFx (data: any) {
        if ((data.state == 'child')) {
            fx.play(this.node, data.name);
        } else if (data.state == 'loop') {
            fx.playLoop(this.node, data.key, data.value);
        } else if (data.state == 'new') {
            if (data.is_follow != undefined)
                this._map[data.name].emit('setFollow', data.is_follow);

            this._map[data.name] = undefined;
        }
    }
}

