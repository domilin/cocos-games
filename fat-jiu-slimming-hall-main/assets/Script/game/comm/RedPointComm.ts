import { _decorator, Node, Vec3, v3, Sprite } from 'cc';
import { comm } from '../../easyFramework/mgr/comm';
import { redPointManager, RPointEvent } from './RedPointManager';
const { ccclass, property } = _decorator;

@ccclass('RedPointComm')
export class RedPointComm extends comm {

    private redFlag: RPointEvent = null!
    private redPointNode: Node = null!
    private _isFore = false

    start() {

    }

    ani() {

    }

    onEnable() {

    }

    setRedPointFlag(flag: RPointEvent, force: boolean = false) {
        this.redFlag = flag
        this._isFore = force
    }

    setRedPointNode(node: Node) {
        this.redPointNode = node
        this.redPointNode.active = this._isFore
    }

    update(deltaTime: number) {
        this.calTime += deltaTime
        if (this.calTime > 1.5) {
            this.calTime = 0
            // console.log("-------------红点测试----", this.redFlag)
            if (this.redFlag && this.redPointNode) {
                this.redPointNode.active = this._isFore || redPointManager.checkIsShowRedPoint(this.redFlag)
            }
        }
    }
}

