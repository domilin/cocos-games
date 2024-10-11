import { _decorator, Component, Node, Label, Color, tween, v3, UIOpacity, Tween, RichText } from 'cc';
import { Const } from '../../../config/Const';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import { comm } from '../../../easyFramework/mgr/comm';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
const { ccclass, property } = _decorator;

@ccclass('fly_tip_item')
export class fly_tip_item extends comm {
    @property({ type: RichText, displayName: "文本" })
    txt: RichText = null!;
    @property({ type: Node, displayName: "动画节点" })
    aniNode: Node = null!;

    opacityTween:Tween<any> = new Tween<any>

    init(obj:any){
        this.unscheduleAllCallbacks()
        this.aniTween.stop()
        this.opacityTween.stop()
        this.txt.string = `${obj.msg}`
        // this.txt.color = color
        let oui = this.aniNode.getComponent(UIOpacity)!

        //播放动画，然后自我销毁
        this.aniNode.scale =v3(0,0,0)
        this.aniNode.position = v3(0,0,0)
        this.aniTween = tween(this.aniNode).parallel(
            tween()
            .delay(1.7)
            // .by(0.2, {position:v3(0,0,0)})
            .to(0.1, {scale:v3(0.6,0,0)})
            .call(()=>{
                poolManager.instance.putNode(this.node)
            }),
            tween()
            .to(0.1, {scale:v3(1.3,1,1)})
            .to(0.1, {scale:v3(1,1.05,1)})
            .to(0.1, {scale:v3(1,1,1)})
        ).start()

            
        oui.opacity = 0
        this.opacityTween= tween(oui)
            .to(0.2, {opacity:255})
            .delay(1.3)
            .to(0.2, {opacity:0})
            .start()
    }
}

