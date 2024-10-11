import { _decorator, Component, Node, Vec3, tween, v3, EventTouch, Vec2, v2, macro} from 'cc';
import { Const } from '../../config/Const';
import { comm } from '../../easyFramework/mgr/comm';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
const { ccclass, property } = _decorator;

/**
 * 3D选择用
 */
@ccclass('solo')
export class solo extends comm {

    @property({ type: Node, displayName: "camera_相机对象" })
    camera3D: Node = null!;
    @property({ type: Node, displayName: "opsPoint_操作点" })
    opsPoint: Node = null!;
  

    camera:Node=null!
    oriPos:Vec3= v3()
    isShow: boolean = true
    isTouch: boolean = false
    calTime: number = 2
    startPos1: Vec2 = v2()
    startPos2: Vec2 = v2()
    pointsDis: number = 0
 
    start() {
        macro.ENABLE_MULTI_TOUCH = true;
        this.camera = this.camera3D.getChildByName("Camera")!
        this.oriPos = this.camera.getPosition().clone()
        this.onTouchEvent()
        Const.SoloCameraParent = this.camera3D.parent!
        // uiManager.instance.showDialog(Const.Dialogs.fly_tip)
        // uiManager.instance.showDialog(Const.Dialogs.res_ani)
    }

    onTouchEvent() {
        this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            let touches = event.getTouches();
            UtilPub.log("--------touches start", touches.length)
            if (touches.length == 1) {
                let touchPos = event.getUILocation()
                // Public.log("--------touchStart xx1", touchPos)
                if (UtilPub.IsPointInNodeArea2D(this.opsPoint, touchPos)) {
                    this.isTouch = true
                    // this.isShow = false
                }    
            }
            else if (touches.length == 2) {
                this.startPos1 = touches[0].getUILocation()
                this.startPos2 = touches[1].getUILocation()
                this.pointsDis = Vec2.distance(this.startPos1, this.startPos2)
            }

        }, this)

        this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {

            let touches = event.getTouches();
            // Public.log("--------touches move", touches.length, this.isTouch)
            if (touches.length == 1) {
                if (this.isTouch) {
                    let ePos = event.getUIDelta()
                    let oriFake = this.camera3D.getWorldPosition()
                    let elu = this.camera3D.eulerAngles
                    let eluX = elu.x + ePos.y * 0.1
                    if(eluX>-1){
                        eluX = -1
                    }
                    if(eluX<-30){
                        eluX = -30
                    }
                    this.camera3D.eulerAngles = v3(eluX, elu.y - ePos.x * 0.5, elu.z )
                    // Public.log("--------touchStart xx2", elu.x, this.camera3D.eulerAngles.y)
                }
            }
            else if (touches.length == 2) {
                // 两根手指是缩放
                let touchPoint1 = touches[0].getUILocation()
                let touchPoint2 = touches[1].getUILocation()
                let newPointsDis = Vec2.distance(touchPoint1, touchPoint2)
                // Public.log("------touch Move",this.pointsDis, newPointsDis)
                
                if (!this.pointsDis){ // 该行代码针对安卓手机
                    this.pointsDis = 0;
                }        
        
                if (newPointsDis < this.pointsDis) {
                    // 表明两根手指在往外划
                    this.pointsDis = newPointsDis;
                    let cameraPos = this.camera.getPosition()
                    // Public.log("------touch 表明两根手指在往外划", cameraPos)
                    if(cameraPos.z<=this.oriPos.z*2){
                        cameraPos.z += 0.25
                        this.camera.setPosition(cameraPos)
                    }

                }else if (newPointsDis > this.pointsDis) {
                    // 表明两根手指在往内划
                    this.pointsDis = newPointsDis;
                    let cameraPos = this.camera.getPosition()
                    if(cameraPos.z>=this.oriPos.z/2){
                        cameraPos.z -= 0.25
                        this.camera.setPosition(cameraPos)
                    }
                }
        
            }


        }, this)
        this.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            this.isTouch = false
        }, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            this.isTouch = false
        }, this)
        // console.log("------touch--event2 --- xx3", this.node)
    }

    offTouchEvent() {
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_MOVE);
        this.node.off(Node.EventType.TOUCH_END);
        this.node.off(Node.EventType.TOUCH_CANCEL);
    }

    
    update(deltaTime: number) {
        // this.calTime += deltaTime
        // if (this.isShow && !this.isTouch && this.calTime > 3) {
        //     this.calTime = 0
        //     let oriFake = this.model.getWorldPosition()
        //     let elu = this.model.eulerAngles
        //     let ori = new Vec3(oriFake.x, oriFake.y, oriFake.z)
        //     // console.log("-------ori", ori)
        //     let ran = MathRandom.getInstance().randomRange(50, 75)
        //     let ranHalf = MathRandom.getInstance().randomRange(0, 100)
        //     if (ranHalf > 60) {
        //         tween(this.model)
        //             .to(2, { eulerAngles: v3(elu.x, elu.y, elu.z + ran) })
        //             .start();
        //     } else {
        //         tween(this.model)
        //             .to(0.1, { worldPosition: v3(ori.x, ori.y + 50, ori.z) })
        //             .to(0.1, { worldPosition: v3(ori.x, ori.y, ori.z) })
        //             .to(2, { eulerAngles: v3(elu.x, elu.y, elu.z + ran) })
        //             .start();
        //     }
        // }
    }
}

