import { _decorator, Component, Node, Prefab, color, tween } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { fly_tip_item } from './fly_tip_item';
const { ccclass, property } = _decorator;

@ccclass('fly_tip')
export class fly_tip extends BaseView {

    @property({ type: Node, displayName: "节点" })
    layout: Node = null!;

    msgQueue:string[]=[] //消息队列


    onLoad() {
        this.on(GD.event.showTip, this.showTip)
    }

    showTip(msg:string){
        // Public.log("---------接收到消息", msg)
        this.msgQueue.push(msg)
        uiManager.instance.showDialog(Const.Dialogs.fly_tip)
    }

    update(deltaTime: number) {
        if(this.msgQueue.length>0){
            this.calTime+=deltaTime
            if(this.calTime>0.2){
                this.calTime=0
                let m = this.msgQueue.shift()! 
                // poolManager.instance.putNode(this.item)
                // Public.log("---------处理消息--", m)
                UtilPub.getPrefab(Const.Prefabs.fly_tip_item, (p:Prefab)=>{
                    let item = poolManager.instance.getNode(p, this.layout)
                    item.getComponent(fly_tip_item)!.init(m)
                })
                
            }
        }
    }
}
