import { _decorator, Component, Node, find, v3, tween, Vec3, Vec2, Prefab, v2, UITransform, Button, Sprite, Label, Scene } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GISceneItemParent, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { main_top } from '../main/main_top';
import { store_skin_item } from './store_skin_item';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_skin')
export class scene_ui_skin extends BaseView {
    get root(){return find("root", this.node)!}
    get bottomBoot(){return find("root/bottom/root", this.node)!}
    get dressVal(){return find("root/top/DressVal/total_dress_val", this.node)!.getComponent(Label)!}
    get quitBtn(){return find("root/top/quitBtn", this.node)!} 
    get skinList(){return find("root/bottom/root/sview/mask/Layout", this.node)!}
    get sceneItemName(){return find("root/bottom/root/title/name", this.node)!.getComponent(Label)!}
    get res(){return find("root/top/res", this.node)!}

    selScript:GISceneItemParent=null!

    rootY:number=-90
    items:Node[]=[]
    selSkinId:number =0 

    start() {
        this.on(GD.event.cancelOps, this.cancelOps, this)
        this.on(GD.event.sureOps, this.cancelOps, this)
        this.on(GD.event.clickDressItem, this.clickDressItem, this)
        this.bindButton(this.quitBtn, ()=>{
            this.emit(GD.event.cancelOpsHandler)
        })
    }

    cancelOps(){
        //关闭顶部资源
        this.close()
    }

    close(){
        uiManager.instance.hideDialog(this.dialogPath)
    }

    show(args:any){
        poolManager.instance.putNodeArr(this.items)
        this.items = []
        this.skinList.removeAllChildren()

        if(args as Object)
        this.selScript = args.selScript
        this.addPrefab(Const.Prefabs.main_top, this.node, null!, {flag: main_top.ShowDress| main_top.ShowCoin | main_top.ShowDiamond})
     

        //获得总的装扮值,遍历所有获得的皮肤，然后分别读表加起来
        let skinObj = SceneData.ins.getSceneSkinAll()
        let totalDress =0
        for(let i=0;i<skinObj.keys.length; i++){
            let val = skinObj.values[i]
            let key = skinObj.keys[i].split("_")[1]
            // UtilPub.log("-======--", val, key)
            if(val==GSceneSkinState.gotted){
                let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, key)
                totalDress += parseInt(skinData.zb.split(",")[1])
            }
        }
        this.dressVal.string = ''+totalDress

        this.reloadList()
    }

    clickDressItem(selSkinId:number){
        this.selSkinId=selSkinId
        this.reloadList()
    }

    reloadList(){
        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.selScript.skin)
        this.sceneItemName.string = skinData.name

        if(this.items.length==0){
            //读取皮肤表获得对应的装扮信息
            let skinRows = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", this.selScript.id+"")
            UtilPub.log("--------装扮信息列表=-====", skinRows, this.selSkinId)

            //如果云端没有数据，那么就使用第一个默认
            let serverData = SceneData.ins.getSceneItemById(this.selScript.id, this.selScript.type)
            if(serverData==null){
                this.selSkinId = skinRows[0].id
            }else{
                this.selSkinId = serverData.skin
            }
            UtilPub.getPrefab(Const.Prefabs.store_skin_item, (p:Prefab)=>{
                skinRows.forEach((val:any, key:number)=>{
                    //如果id包含00结尾，那么就是默认做旧
                    let isGray = (val.id+"").substring((val.id+"").length-2)=="00"
                    let isDefault = (val.id+"").substring((val.id+"").length-2)=="99"
                    if(isGray==false && isDefault==false){
                        let item = poolManager.instance.getNode(p, this.skinList)
                        UtilPub.log("----------问题---",val.id, this.selSkinId )
                        item.getComponent(store_skin_item)!.init(val.id, this.selSkinId)
                        this.items.push(item)
                    }
                   
                })
            })
        }else{
            this.items.forEach((item)=>{
                let script =  item.getComponent(store_skin_item)!
                script.init(script.skinId, this.selSkinId)
                // item.getComponent(store_skin_item)!.updSel(this.selSkinId)
            })

        }
    }

    onEnable(){
        this.aniTween.stop()
        this.bottomBoot.position =v3(0,-1000,0)
        this.aniTween = tween(this.bottomBoot)
        .to(0.15, {position:v3(0,25 +this.rootY,0)},{easing: "backIn"})
        .to(0.25, {position:v3(0,0+this.rootY,0)},{easing: "backIn"})
        .start()
    }

}


