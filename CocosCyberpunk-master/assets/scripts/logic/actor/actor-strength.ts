import { _decorator, Component, game, Node } from 'cc';
import { KeyAnyType } from '../data/game-type';
import { Msg } from '../../core/msg/msg';
const { ccclass, property } = _decorator;

@ccclass('ActorStrength')

export class ActorStrength extends Component {

    _data: KeyAnyType = {};

    recoverStrengthTime = 0;

    start () { }

    calculateStrengthUseEquip (): boolean {

        const canUseEquip = this._data.strength >= this._data.cost_use_equip_strength;
        if (canUseEquip) {
            this._data.strength -= this._data.cost_use_equip_strength;
            this._data.strength = Math.max(this._data.strength, 0);
        }

        return canUseEquip;
    }

    calculateRunStrength (deltaTime: number): boolean {
        const canRun = this._data.is_run && this._data.strength >= this._data.cost_run_strength;
        if (canRun) {
            this._data.strength -= this._data.cost_run_strength * deltaTime;
            this._data.strength = Math.max(this._data.strength, 0);
            const percent_value = this._data.strength / this._data.max_strength;
            Msg.emit('fil_strength', percent_value);
        }
        return canRun;
    }

    recoverStrength () {

        //if (this._data.is_ground === false) return;
        if (this._data.is_run) return;

        this.recoverStrengthTime += game.deltaTime;

        if (this.recoverStrengthTime >= 2) {
            this._data.strength += this._data.recover_ground_strength * this.recoverStrengthTime;
            if (this._data.strength > this._data.max_strength) this._data.strength = this._data.max_strength;
            const percent_value = this._data.strength / this._data.max_strength;
            Msg.emit('fil_strength', percent_value);
            this.recoverStrengthTime = 0;
        }

    }

}

