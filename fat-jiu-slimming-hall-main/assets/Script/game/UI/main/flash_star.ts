import { _decorator, Component, Node } from 'cc';
import { comm } from '../../../easyFramework/mgr/comm';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
const { ccclass, property } = _decorator;

@ccclass('flash_star')
export class flash_star extends comm {
    init(): void {
        this.calTime=0
    }
    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>3){
            this.calTime = 0
            console.log("------------caltime---", this.calTime)
            poolManager.instance.putNode(this.node)
        }
    }
}


