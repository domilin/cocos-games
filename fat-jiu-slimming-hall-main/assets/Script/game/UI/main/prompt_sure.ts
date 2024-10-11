import { animation, Node, find, _decorator, ProgressBar, Label, Sprite, director, game } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GPromptType } from '../../../config/global';
import { WmSocketJSF } from '../../../easyFramework/network/WmSocketJSF';
import GD from '../../../config/GD';
import { GEvent, GNetConst, GNetUrl } from '../../../easyFramework/network/conf';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import { WECHAT } from 'cc/env';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { Notifications } from '../../../easyFramework/mgr/notifications';
import { Const } from '../../../config/Const';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('prompt_sure')
export class prompt_sure extends BaseView {
    //顶部道具标题
    get titleLabel() { return find("root/titleLabel", this.node)!.getComponent(Label)! }
    get contentLabel() { return find("root/contentLabel", this.node)!.getComponent(Label)! }
    get btnLabel() { return find("root/btnGreenbg/btnLabel", this.node)!.getComponent(Label)! }
    get btnGreenBg() { return find("root/btnGreenbg", this.node)! }
    
    cb:Function = null!
    type:GPromptType =GPromptType.blockAccount
    isStartReconnect:boolean = false

    start() {
        director.off(GEvent.ws_open, this.onWsOpen, this);
        director.on(GEvent.ws_open, this.onWsOpen, this);
        this.bindButton(this.btnGreenBg, () => {
            if(this.type==GPromptType.reconnect){
                this.isStartReconnect = true 
                this.emit(GD.event.showTip, {msg: "尝试连接服务器！"})
                this.tryConnect()
              
            }else if(this.type==GPromptType.blockAccount ||
                this.type==GPromptType.loginOccupy || 
                this.type==GPromptType.loginExpired || 
                this.type==GPromptType.unkown){
               
                this.cb && this.cb()
                game.end()

            }
           
        })
    }

    restartGame(){
       UtilScene.restartGame()
    }

    show(args: any) {
        this.isStartReconnect = false
        // super.show(args)
        this.type = args.type 
        this.cb = args.cb
        this.contentLabel.string = args.content

        // if(this.type==GPromptType.reconnect){
        //     this.isStartReconnect = true 
        // }
    }

    close(){

    }

    //socket链接后发起登录
    onWsOpen(){
        console.warn("socket成功后----------自动重新登录")
        this.restartGame()
        // if(WECHAT){
        //     // ServerCtrJSF.GetInstance().wxLoginBegin()
        // }else{
        //     ServerCtrJSF.GetInstance().reqUniqueLoginByAccount(ServerCtrJSF.GetInstance().Account)
        // }
    }

    tryConnect(){
      
        // if(WmSocketJSF.getInstance().isConnected() == true && ServerCtrJSF.GetInstance().isLogin){
        //     this.node.active = false
        //     UtilPub.log("关闭")
        //     this.close()
        //     this.cb && this.cb()
        // }
    }

    update(dt:number){
        //发起重连
        if(this.isStartReconnect==true){
            this.calTime += dt 
            if(this.calTime>2){
                UtilPub.log("开始尝试重新链接")
                this.calTime=0
                this.tryConnect()
            }
        }
    }

}


