import { _decorator, Component, ParticleSystem, Node } from 'cc';
import { fun } from '../util/fun';
import { ResPool } from '../res/res-pool';
const { ccclass, property } = _decorator;

@ccclass('FxBase')
export class FxBase extends Component {

    @property
    destroyTime = 3;
    particles: ParticleSystem[] | undefined;

    @property
    autoRemove = false;

    delayTime = 3;

    _followNode: Node | undefined;

    __preload () {
        this.particles = this.node?.getComponentsInChildren(ParticleSystem);
        this.node.on('play', this.play, this);
        this.node.on('remove', this.remove, this);
        this.node.on('setFollow', this.setFollow, this);
        this.delayTime = this.destroyTime;
    }

    onDestroy () {
        this.node.off('play', this.play, this);
        this.node.off('remove', this.remove, this);
        this.node.off('setFollow', this.setFollow, this);
    }

    stop () {
        for (let i = 0; i < this.particles!.length; i++) {
            const particle = this.particles![i];
            particle.stop();
        }
    }

    clear () {
        for (let i = 0; i < this.particles!.length; i++) {
            const particle = this.particles![i];
            particle.stop();
            particle.clear();
        }
    }

    play (followNode: Node | undefined) {
        this.setFollow(followNode);
        this.delayTime = this.destroyTime;
        for (let i = 0; i < this.particles!.length; i++) {
            const particle = this.particles![i];
            particle.stop();
            particle.clear();
            particle.play();
        }
    }

    setFollow (followNode: Node | undefined) {
        this._followNode = followNode;
    }

    setLoop (isLoop: boolean = false) {
        for (let i = 0; i < this.particles!.length; i++) {
            const particle = this.particles![i];
            particle.loop = true;
        }
    }

    lateUpdate (deltaTime: number) {

        if (this._followNode) {
            const pos = this._followNode.worldPosition;
            this.node.setWorldPosition(pos.x, pos.y, pos.z);
        }

        if (this.autoRemove) {
            this.delayTime -= deltaTime;
            if (this.delayTime < 0) {
                this.remove();
            }
        }
    }

    remove () {
        this.stop();
        this.clear();
        ResPool.Instance.push(this.node);
        this.delayTime = this.destroyTime;
    }
}