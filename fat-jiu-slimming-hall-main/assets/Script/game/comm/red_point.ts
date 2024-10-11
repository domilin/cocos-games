import { _decorator, tween, Vec3, v3,Sprite } from 'cc';
import {  GRedPoint } from '../../config/global';
import { comm } from '../../easyFramework/mgr/comm';
const { ccclass, property } = _decorator;

@ccclass('red_point')
export class red_point extends comm {
    @property({ type: GRedPoint, displayName: "埋点信息" })
    redPointPos: number = -1;

    data:any=null!
    skillId:number=0 //技能升级的技能ID
    petId:number=0 //宠物的ID
    sp:Sprite=null!
    oriAngle:Vec3=null!
    onlineItemData:any={} //在线奖励的配表数据
    dailyTaskData:any={} //每日任务的配表数据
    
    start() {
        this.oriAngle= this.node.eulerAngles.clone()
        this.ani()
        this.sp = this.node.getComponent(Sprite)!
    }

    ani(){
        this.aniTween.stop()
        this.node.eulerAngles = this.oriAngle
        this.aniTween = tween(this.node).repeatForever(
            tween()
                .by(0.2, {eulerAngles:v3(0,0,10)})
                .by(0.2, {eulerAngles:v3(0,0,-20)})
                .by(0.2, {eulerAngles:v3(0,0,10)})
                .to(0.1, {eulerAngles:this.oriAngle})
                .delay(0.5)
        ).start()
    }

    onEnable(){
        this.sp = this.node.getComponent(Sprite)!
        this.sp.enabled = this.isShowRedPointPos(this.redPointPos)
    }
    
    //是否显示红点信息
    isShowRedPointPos(pos:number){
        return false
    }

  

    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>1.2){
            this.calTime=0
            this.sp.enabled = this.isShowRedPointPos(this.redPointPos)
            if(this.sp.enabled==true){
                this.ani()
            }else{
                this.aniTween.stop()
            }
        }
    }
}

