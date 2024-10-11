import { _decorator, Component, Node, ProgressBar, tween, Tween, v3 } from 'cc';
import { comm } from '../../../easyFramework/mgr/comm';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_arrow')
export class scene_ui_arrow extends comm {
    tweenScale: Tween<any> = new Tween()
    get bar(){return this.node.getChildByName("arrow")!.getComponent(ProgressBar)!}
    
    onEnable(){
        this.calTime=0
        this.showArrow()
    }

    showArrow(){
        this.aniTween.stop()
        this.bar.progress = 0
        this.aniTween = tween(this.bar).to(0.4, {progress:1}).start()

        this.tweenScale.stop()
        this.node.scale =v3(1, 0.3, 1,)
        this.tweenScale = tween(this.node).to(0.3, {scale:v3(1,1,1)}).start()
    }


    update(dt: number) {
        this.calTime+=dt 
        if(this.calTime>2){
            poolManager.instance.putNode(this.node)
        }
    }
}


