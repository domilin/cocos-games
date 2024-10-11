import { _decorator, Component, Node, find, Label, Sprite, Scene, SpriteFrame } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GSceneSkinState } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('store_skin_item')
export class store_skin_item extends comm {
    get root(){return find("root", this.node)!}
    get selBgNode(){return find("root/selBg", this.node)!} //点击显示皮肤
    get selBg(){return find("root/selBg/sel", this.node)!} //选中
    get unselBg(){return find("root/selBg/unsel", this.node)!} //未选中
    get newBirdIcon(){return find("root/selBg/new_bird_icon", this.node)!} //新鹅提示
    get dressNode(){return find("root/selBg/dress", this.node)!}
    get dressIcon(){return find("root/selBg/dress/icon_dress", this.node)!.getComponent(Sprite)!} //装扮值提示
    get dressVal(){return find("root/selBg/dress/dress_val", this.node)!.getComponent(Label)!} //装扮值提示
    get icon(){return find("root/selBg/icon", this.node)!.getComponent(Sprite)!} //皮肤图标
    get infoBtn(){return find("root/selBg/info", this.node)!} //感叹号点击
    get buyBtn(){return find("root/bottom/buyBtn", this.node)!}//购买
    get resIcon(){return find("root/bottom/buyBtn/res_icon", this.node)!.getComponent(Sprite)!}//资源图标
    get resVal(){return find("root/bottom/buyBtn/res_val", this.node)!.getComponent(Label)!}//资源值
    get val(){return find("root/bottom/val", this.node)!.getComponent(Label)!} //金币值
    get using(){return find("root/bottom/using", this.node)!} //使用中
    get gotted(){return find("root/bottom/gotted", this.node)!} //已获得

    skinId:number=0

    start() {
        //感叹号点击
        this.bindButton(this.infoBtn, ()=>{
            uiManager.instance.showDialog(Const.Dialogs.scene_ui_skin_detail, { skinId: this.skinId })
        })

        //购买
        this.bindButton(this.buyBtn, ()=>{
            uiManager.instance.showDialog(Const.Dialogs.scene_ui_skin_detail, {skinId:this.skinId})
        })

        //点击显示皮肤
        this.bindButton(this.selBgNode, ()=>{
            this.emit(GD.event.clickDressItem, this.skinId)
        })
    }

    init(skinId:number, selId:number){
        //显示选中
        this.skinId = skinId
        this.updSel(selId)

        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, skinId)
        this.buyBtn.active = false 
        this.gotted.active = false 
        this.using.active = false 
        this.dressNode.active = false
        if(SceneData.ins.getSceneSkinById(this.skinId) == GSceneSkinState.noGotted){
            //未获得显示价格 装扮值
            this.buyBtn.active = true
            let itemId = skinData.res.split(",")[0]
            let itemData = tables.ins().getTableValueByID(Const.Tables.prop, itemId)
            this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon)
            this.resVal.string = "x"+skinData.res.split(",")[1]

            this.dressNode.active = true
            this.dressVal.string =  "+"+skinData.zb.split(",")[1]
            
        }else{
            //已获得，使用中，未使用
            let script = UtilScene.getSceneNodeScript(Const.SelSceneNode)
            UtilPub.log("------皮肤ID---", script.id)
            let data = SceneData.ins.getSceneItemById(script.id, script.type)!
            if(this.skinId==data.skin){//使用中
                this.using.active = true
            }else{//未使用
                this.gotted.active = true 
            }
        }
        UtilScene.setSkinIcon(this.icon, skinData)
        
        //是否显示新肥鹅，读取装扮表提示
        this.newBirdIcon.active = false
        let arr = tables.ins().getTable(Const.Tables.scene_guest)
        for(let i=0;i<arr.length; i++){
            let row = arr[i]
            if (this.skinId == row.skin ){
                this.newBirdIcon.active = true
                break;   
            }
        }
       
    }

    updSel(selSkinId:number){
        UtilPub.log("------显示选中---", selSkinId, this.skinId)
        this.selBg.active = selSkinId==this.skinId
        this.unselBg.active = !this.selBg.active
    }

 
}


