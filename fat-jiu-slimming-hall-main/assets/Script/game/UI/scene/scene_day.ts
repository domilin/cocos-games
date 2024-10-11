import { _decorator } from 'cc';
import { comm } from '../../../easyFramework/mgr/comm';
const { ccclass, property } = _decorator;

@ccclass('scene_day')
export class scene_day extends comm {
    start() {

    }

    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>1){
            this.calTime=0
            // UtilPub.log("scene_day---------", this.node.layer)
        }
    }
}


