import { _decorator, Component, Node, v2, Vec2, find, v3, Sprite, Scene, v4, view } from 'cc';
import { Const } from '../../../config/Const';
import { GCurFace, GFace, GGridType, GISceneItemParent, GLockState, GSceneItemData, GSceneItemType, GSceneRoomState, GSceneSkinState, GWorkState } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { ShineColor } from '../../../easyFramework/utils/ShaderShine';
const { ccclass, property } = _decorator;

@ccclass('scene_item_parent')
export class scene_item_parent extends comm {
   protected id:number=0 //场景道具的唯一标识
   protected skin:number=0 //皮肤ID
   protected lockState:GLockState=GLockState.locked
   protected faceMax: GFace = GFace.face1 //总面数 1 2 4 

   /** 1东 2南 3西 4北
   * 1是右下角为东，左下为南，顺时针旋转
   * 默认皮肤的旋转状态
   */
   protected curFace: GCurFace = GCurFace.face1 //初始化为转面，后期可以读取用户数据覆盖
   protected itemSize: Vec2 = v2(1, 1)  //初始化尺寸
   protected curGridPoint: Vec2 = v2(0, 0) //初始化起始位置点，后期可以读取用户数据覆盖，正上方的点
   protected type : GSceneItemType = null! 
   protected row: any  //配表的数据
   protected workState: GWorkState = GWorkState.idle //工作状态
   protected guestNode: Node = null! //客人节点

   private _curPointsNode:Node=null! //当前位置点信息
   private _curIconNode:Node =null! //当前图标
   private _isShowPoint:boolean = Const.isDebug //是否显示描点
   private _isFlashForever:boolean = false //是否一直闪白

   get icon1() { return find("icon1", this.node)! }
   get icon2() { return find("icon2", this.node)! }
   get icon3() { return find("icon3", this.node)! }
   get icon4() { return find("icon4", this.node)! }
   get points1() { return find("points1", this.node)! }
   get points2() { return find("points2", this.node)! }
   get points3() { return find("points3", this.node)! }
   get points4() { return find("points4", this.node)! }

   protected floatStar:Node = null! 

   start() {
      // this.hideElements()
     
   }

   private hideElements(){
      if (this.points1) {
         this.points1.active = false
      }
      if (this.points2) {
         this.points2.active = false
      }
      if (this.points3) {
         this.points3.active = false
      }
      if (this.points4) {
         this.points4.active = false
      }
      if(this.icon1){
         this.icon1.active = false
      }
      if(this.icon2){
         this.icon2.active = false
      }
      if(this.icon3){
         this.icon3.active = false
      }
      if(this.icon4){
         this.icon4.active = false
      }
   }

   /**
    * 接口方法，获得当前图片的中心点
    */
   getCurIconNode(){
      return this._curIconNode
   }

   /**
    * 得到当前所有节点的世界坐标的位置信息
    * @returns 
    */
   getPointsArr(){
      let arr:Array<Array<number>> = []
      // UtilPub.log("xxx-----坐标数组", this._curPointsNode.name, this._curPointsNode.scale.x)
      this._curPointsNode.children.forEach(item=>{
         arr.push([Number(item.worldPosition.x.toFixed(1))!, Number(item.worldPosition.y.toFixed(2))])
      })

      this._curPointsNode.active = this._isShowPoint
      return arr
   }

   //设置转面
   public setFace(curFace:GCurFace){
      this.curFace = curFace
      this.hideElements()
      if(this.row.type==GSceneItemType.item || this.row.type==GSceneItemType.carpet){
         if(this.curFace == GCurFace.face1){ //朝南，右下角，x轴正向
            //TODO 设置当前图片为图1 
            this._curPointsNode = this.points1
            this._curIconNode = this.icon1
            this.itemSize = v2(this.row.x, this.row.y)

         }else if(this.curFace == GCurFace.face2){
            //TODO 设置当前图片为图1 
            this._curPointsNode = this.points2
            this._curIconNode = this.icon2
            this.itemSize = v2(this.row.y, this.row.x)

         }else if(this.curFace == GCurFace.face3){
            //TODO 设置当前图片为图2
            this._curPointsNode = this.points3
            this._curIconNode = this.icon3
            this.itemSize = v2(this.row.x, this.row.y)

         }else if(this.curFace == GCurFace.face4){
            //TODO 设置当前图片为图2
            this._curPointsNode = this.points4
            this._curIconNode = this.icon4
            this.itemSize = v2(this.row.y, this.row.x)

         }

      }else if(this.row.type==GSceneItemType.pendant){
         if(this.curGridPoint.x >=0 ){
            //TODO 设置当前图片为图1
            this.curFace = GCurFace.face2
            this._curPointsNode = this.points2
            this._curIconNode = this.icon2
            
         }else{
            this.curFace = GCurFace.face1
            this._curPointsNode = this.points1
            this._curIconNode = this.icon1
         }
      }else if(this.row.type==GSceneItemType.wall || this.row.type==GSceneItemType.floor ){
         this.curFace = GCurFace.face1
         this._curPointsNode = this.points1
         this._curIconNode = this.icon1
      }

      // UtilPub.log("###-----设置转面---", this._curIconNode, this._curPointsNode)
      this._curIconNode.active = true
      this._curPointsNode.active = this._isShowPoint
      

      //如果是墙壁，那么判断对应的房间是否解锁，如果解锁那么隐藏对应的路灯
      if(this.type==GSceneItemType.wall){
         let isUnlock = SceneData.ins.getRoomLockInfoById(this.row.room)
         // UtilPub.log("###-----1为房间解锁--", this.row.room, isUnlock)
         if(isUnlock==GSceneRoomState.unlock){
            this.node.active = true
            let lightNode = Const.LightParent.getChildByName("light_"+this.row.room)
            if(lightNode!=null){
               lightNode.active = false 
            }
         }else{
            this.node.active =false 
            let lightNode = Const.LightParent.getChildByName("light_"+this.row.room)
            if(lightNode!=null){
               lightNode.active = true 
            }
         }
      }

      //TODO debug代码
      // let isGray = (this.skin+"").substring((this.skin+"").length-2)=="00"
      // // if(this.skin>5000100){
      // //    isGray=false
      // // }
      // // UtilPub.log("####----皮肤是否显示去灰色----", this.skin, isGray)
      // if(this.icon1) this.icon1.getComponent(Sprite)!.grayscale=isGray
      // if(this.icon2) this.icon2.getComponent(Sprite)!.grayscale=isGray
      // if(this.icon3) this.icon3.getComponent(Sprite)!.grayscale=isGray
      // if(this.icon4) this.icon4.getComponent(Sprite)!.grayscale=isGray
   }

   /**
    * 挂件朝向调整
    */
   public setPendantFace(){
      this.setFace(this.curFace)
   }

   /**
    * 接口方法，旋转场景道具
    */
   public rotateItem(){
      if(this.curFace>=this.faceMax){
         this.curFace=GCurFace.face1
      }else{
         this.curFace+=1 
      }
      this.setFace(this.curFace)
   }

   //配表初始化接口
   initByConfigTable(row: any) {
      this.id = row.id 
      this.row = row
      this.lockState = row.st
      this.faceMax = this.row.faceMax
      this.itemSize = v2(this.row.x, this.row.y)
      this.curGridPoint = v2(this.row.pos[0], this.row.pos[1])
      this.type = this.row.type
      this.skin = this.row.skin
      this.curFace = this.row.face

      //如果是地板，未解锁房间地板不一样
      if(this.type==GSceneItemType.floor){
         if(SceneData.ins.getRoomLockInfoById(this.row.room)==GSceneRoomState.locked){
            this.skin = this.row.workSkin
         }
      }

      //设置是否已购买，开局默认解锁的直接标记为已获得
      // if(this.row.st==1){
      //    SceneData.ins.setSceneSkinById(this.skin, GSceneSkinState.gotted)
      // }
      let data = SceneData.ins.getSceneItemById(this.id, this.type)
      if(data!=null){
         if(data.lockState){
            this.lockState = data.lockState
         }
         if(data.curGridPoint){ //这个要在前，挂机是根据x坐标判定的
            this.curGridPoint = data.curGridPoint
         }
         if(data.curFace && data.curFace<=row.faceMax){
            this.curFace = data.curFace
         }
         if(data.skin){
            this.skin = data.skin
         }
         // UtilPub.log("-----初始化皮肤----", data.skin)
      }else{
         let data = UtilScene.getSceneData(this as unknown as GISceneItemParent)
         UtilPub.log("-----初始化数据1111----", data)
         SceneData.ins.setSceneItem(data)
      }
      this.setFace(this.curFace)
      this.setIcon()
   }

   //从内存中读取数据时再次修改
   // initBySceneData(data:GSceneItemData){
      // if(data==null){
      //    return 
      // }
      // // this.id = data.id 
      // // this.type = data.type 
      // if(data.lockState){
      //    this.lockState = data.lockState
      // }
      // if(data.curGridPoint){ //这个要在前，挂机是根据x坐标判定的
      //    this.curGridPoint = data.curGridPoint
      // }
      // if(data.curFace){
      //    this.curFace = data.curFace
      //    this.setFace(data.curFace)
      // }
      // //初始化皮肤
      // UtilPub.log("-----初始化皮肤----", data.skin)
      // if(data.skin){
      //    this.skin = data.skin
      //    this.setIcon()
      // }
   // }

   //根据皮肤ID设置图片
   setIcon(){
      let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.skin)
      // UtilPub.log("-----加载道具图片----", skinData.id, skinData.name, UtilScene.getResSceneIcon(skinData.icon1),skinData.icon1, skinData.icon2)
      if(this.icon1!=null){
         this.setSpriteFrame(this.icon1.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon1)) //Const.resPath.sceneIcons
      }
      if(this.icon2!=null){
         this.setSpriteFrame(this.icon2.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon1))
      }
      if(this.icon3!=null){
         this.setSpriteFrame(this.icon3.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon2))
      }
      if(this.icon4!=null){
         this.setSpriteFrame(this.icon4.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon2))
      }
   }

   switchIcon(skinId:number){
      this.skin=skinId
      UtilPub.log("-----切换皮肤----", skinId)
      this.setFace(this.curFace)
      this.setIcon()
   }

   /**
    * 闪白1下
    */
   flashOnce(){
      if(this.type==GSceneItemType.floor || this.type==GSceneItemType.wall){
         return 
      }
       //开始闪白
       let flashTime=2
       if(this.icon1){
         if(this.icon1.getComponent(ShineColor)==null) this.icon1.addComponent(ShineColor)!
         this.icon1.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon2){
         if(this.icon2.getComponent(ShineColor)==null) this.icon2.addComponent(ShineColor)!
         this.icon2.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon3){
         if(this.icon3.getComponent(ShineColor)==null) this.icon3.addComponent(ShineColor)!
         this.icon3.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon4){
         if(this.icon4.getComponent(ShineColor)==null) this.icon4.addComponent(ShineColor)!
         this.icon4.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
   }

   /**
    * 一直闪白
    */
   flashForever(isShow:boolean){
      if(this.type==GSceneItemType.floor || this.type==GSceneItemType.wall){
         return 
      }
      UtilPub.log("-=-=-=-=-选择场景", isShow, this.node.uuid)
      if(isShow==false){
         //停止闪白
         if(this.icon1 && this.icon1.getComponent(ShineColor)!){
            this.icon1.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon2 && this.icon2.getComponent(ShineColor)!){
            this.icon2.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon3 && this.icon3.getComponent(ShineColor)!){
            this.icon3.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon4 && this.icon4.getComponent(ShineColor)!){
            this.icon4.getComponent(ShineColor)!.closeFlash()
         }
      }else{
         //开始闪白
         if(this.icon1){
            if(this.icon1.getComponent(ShineColor)==null) this.icon1.addComponent(ShineColor)!
            this.icon1.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
         if(this.icon2){
            if(this.icon2.getComponent(ShineColor)==null) this.icon2.addComponent(ShineColor)!
            this.icon2.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor,  1)
         }
         if(this.icon3){
            if(this.icon3.getComponent(ShineColor)==null) this.icon3.addComponent(ShineColor)!
            this.icon3.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
         if(this.icon4){
            if(this.icon4.getComponent(ShineColor)==null) this.icon4.addComponent(ShineColor)!
            this.icon4.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
      }
   }

   isNodeOutView(){
      let size = view.getVisibleSize();
      let cPos = Const.CameraScene.node.worldPosition
      let nPos = this.node.worldPosition
      let rate = Const.CameraScene.orthoHeight/350
      if(Const.CameraScene.orthoHeight<1000){
         rate = Const.CameraScene.orthoHeight/150
      }
      // UtilPub.log("=======概率----", rate , size.width*rate)
      let isInView = UtilPub.IsPointInArea2D(nPos, cPos, size.width*rate, size.height*rate)
      if(!isInView){
         this.hideElements()
      } else{
         this.setFace(this.curFace)
      } 
   }


   update(deltaTime:number){
      this.calTime+= deltaTime
      if(this.calTime>0.2){
         this.calTime=0
         // this.setFace(this.curFace)
         if(Const.SelSceneNode!=null){
            if(this.node.uuid == Const.SelSceneNode.uuid){
               this.node.active = true 
               this.setFace(this.curFace)
            }
         }
        
         // this.isNodeOutView()
        
      }

   }

}


