import { Camera, EventMouse, EventTouch, find, Input, Node, Prefab, tween, UITransform, v2, v3, Vec2, Vec3, view, _decorator } from 'cc';
import { Const } from '../../config/Const';
import GD from '../../config/GD';
import { GBuildType, GIGridData, GLockState, GSceneItemType, GSceneRoomState, GTouchState } from '../../config/global';
import { comm } from '../../easyFramework/mgr/comm';
import { poolManager } from '../../easyFramework/mgr/poolManager';
import { uiManager } from '../../easyFramework/mgr/uiManager';
import tables from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { composeModel } from '../comm/composeModel';
import { SceneData } from '../comm/SceneData';
import { userData } from '../comm/UserData';
import { UtilScene } from '../comm/UtilScene';
import { handIndexs, sceneBuildIds } from '../data/handData';
import { float_star } from './main/float_star';
import { scene_ui_ops } from './scene/scene_ui_ops';
const { ccclass, property } = _decorator;

@ccclass('canvas_game_scene')
export class canvas_game_scene extends comm {

    get SceneCameraNode() { return find("SceneCamera", this.node)!.getComponent(Camera)! } //相机
    get SceneBottom() { return find("SceneBottom", this.node)! } //底部图
    get SceneObjs() { return find("SceneObjs", this.node)! } //场景对象
    get WallFixedNode() { return find("SceneObjs/buildingParent/wall", this.node)! } //墙壁固定点-父节点
    get StreetFixedNode() { return find("SceneObjs/buildingParent/street", this.node)! } //街道固定点-父节点
    get FloorFixedNode() { return find("SceneObjs/buildingParent/floor", this.node)! } //地面固定点-父节点
    get ShadowGridParent() { return find("SceneObjs/shadowGridParent", this.node)! } //阴影的父节点
    get ShadowWallParent() { return find("SceneObjs/shadowWallParent", this.node)! } //墙壁阴影的父节点
    get GridParent() { return find("SceneObjs/gridParent", this.node)! } //底层网格的ui父节点
    get WallGridParent() { return find("SceneObjs/wallGridParent", this.node)! } //底层网格的ui父节点
    get LightParent() { return find("SceneObjs/lightParent", this.node)! } //路灯父节点
    get PendantParent() { return find("SceneObjs/buildingParent/pendant", this.node)! } //挂机父节点
    get ItemParent() { return find("SceneObjs/buildingParent/item", this.node)! } //器械父节点
    get CarpetParent() { return find("SceneObjs/buildingParent/carpet", this.node)! } //地毯父节点
    get SelBuildingParent() { return find("SceneObjs/selBuildingParent", this.node)! } //长按操作界面父节点
    get FloatStarParent() { return find("SceneObjs/floatStarParent", this.node)! } //浮动星星的父节点


    get GuestStartPos() { return find("SceneObjs/guestStartPos", this.node)! } //客人起点位置

    buildingNode: Node = null!
    player: Node = null!
    dir: Vec3 = null!
    dirOps: Vec3 = null!

    oriPos: Vec3 = v3(0, 0, 0)
    startPos1: Vec2 = null!
    startPos2: Vec2 = null!
    pointsDis: number = 0
    rate: number = 1

    //视角大小为500时的值为
    borderRrthoHeightMinY: number = 3100
    borderRrthoHeightMinX: number = 3381
    //视角大小为3000时的值为
    borderRrthoHeightMaxY: number = 600
    borderRrthoHeightMaxX: number = 2230
    //原始比例
    oriRate: number = 0.46

    //是否点击空地
    touchState: GTouchState = GTouchState.noYet
    isActiveTouchMove: boolean = false //是否激活拖拽移动

    //items
    gridParentOriPos: Vec3 = v3(11, 1706)//v3(868,2249)////v3(853, 2255, 0) //网格起始位置
    room1Pos: Vec2 = v2(0, 20) //房间1的原点

    //操作栏
    touchWorldPos: Vec3 = v3(0, 0, 0)  //点击位置的世界坐标
    arrow: Node = null! //箭头进度条
    ops: Node = null! //操作节点
    selItemNode: Node = null! //选择的道具节点
    idx: number = 0 //跳开操作

    calTimeForFloatStar: number = -1
    starNodes: Node[] = []

    scaleArr: number[] = [500, 525, 551, 608, 638, 704, 815, 856, 989, 1028]

    onLoad() {

        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.on(GD.event.goToBuildScene, this.goToBuildScene, this)
        this.on(GD.event.cancelOps, this.cancelOps, this)
        this.on(GD.event.sureOps, this.sureOps, this)
        this.on(GD.event.clickDressItem, this.clickDressItem, this)
        this.on(GD.event.popOpsWindow, this.popOpsWindow, this)

        poolManager.instance.putNodeArr(Const.AllItems)
        Const.AllItems = []
        poolManager.instance.putNodeArr(Const.Guests)
        Const.Guests = []

        Const.CameraScene = this.SceneCameraNode
        Const.SceneNode = this.node
        Const.ShadowParent = this.ShadowGridParent
        Const.ShadowWallParent = this.ShadowWallParent
        Const.GridParent = this.GridParent
        Const.WallGridParent = this.WallGridParent
        Const.ItemParent = this.ItemParent
        Const.CarpetParent = this.CarpetParent
        Const.CameraScene.orthoHeight = UtilScene.initVal
        Const.WallFixedNode = this.WallFixedNode
        Const.FloorFixedNode = this.FloorFixedNode
        Const.PendantParent = this.PendantParent
        Const.StreetFixedNode = this.StreetFixedNode
        Const.GuestStartPos = this.GuestStartPos
        Const.LightParent = this.LightParent
        Const.FloatStarParent = this.FloatStarParent
        Const.SelBuildingParent = this.SelBuildingParent;



        this.GridParent.position = this.gridParentOriPos
        this.ItemParent.position = this.gridParentOriPos
        this.CarpetParent.position = this.gridParentOriPos
        this.ShadowGridParent.position = this.gridParentOriPos

        //初始化索引数据
        UtilScene.initGridsData(this.GridParent.getComponent(UITransform)!, Const.MaxRoomY, Const.MaxRoomX)
        UtilScene.initGridsWallData(this.WallGridParent.getComponent(UITransform)!, Math.abs(Const.MaxWallXLeft), Math.abs(Const.MaxWallXRight))


        UtilPub.log("触摸事件绑定-------------")
        this.touchEvent()

        this.calTimeForFloatStar = -3000
    }

    start() {
        //直接把 scene_day 挂到主菜单下
        // poolManager.instance.putNodeArr(this.SceneBottom.children)
        // UtilPub.getPrefab(Const.Prefabs.scene_day, (p: Prefab) => {
        //     // UtilPub.log("---直接把 scene_day111 挂到主菜单下----", this.SceneNode.layer)
        //     let item = poolManager.instance.getNode(p, this.SceneBottom)
        //     // UtilPub.log("---直接把 scene_day222 挂到主菜单下----",this.SceneNode.layer, item.layer)
        // })

        //一开始把镜头移动到门那里
        tween(this.SceneCameraNode.node).to(0.3, { position: v3(0, 1366, 1000) }).start()

        // UtilScene.initStreetGrids()
        // UtilScene.initBottomGrids()
        // UtilScene.initWallGrids()
        UtilScene.initRoom()
    }

    goToBuildScene(buildId: number, buildType: GBuildType) {
        //找到目标节点
        let target: Node = null!
        if (buildType == GBuildType.room) {
            //如果是定位到房间
            //根据房间id获得对应地板id
            let itemData = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "room", buildId + "", "type", GSceneItemType.floor + "")[0]
            target = Const.FloorFixedNode.getChildByName("floor_" + itemData.id)!

        } else if (buildType == GBuildType.item) {
            //如果是定位到家具
            for (let i = 0; i < Const.AllItems.length; i++) {
                let script = UtilScene.getSceneNodeScript(Const.AllItems[i])
                if (script.id == buildId) {
                    target = Const.AllItems[i]
                    break
                }
            }

        }
        // UtilPub.log("---------点击飞过去", buildId, buildType, target)
        if (target != null) {
            Const.CameraScene.orthoHeight = UtilScene.initVal
            this.aniTween.stop()
            let targtPos = v3(target.worldPosition.x, target.worldPosition.y, Const.CameraScene.node.worldPosition.z)
            // let dis = UtilPub.getDis2D(target.worldPosition, Const.CameraScene.node.worldPosition)
            this.aniTween = tween(Const.CameraScene.node).to(0.3, { worldPosition: targtPos }).call(() => {
                let handIndex = composeModel.getHandIndex();
                if (handIndex == handIndexs.buildCashDesk) {
                    let obj: any = {};
                    obj.id = handIndex;
                    obj.node = find("root", Const.FloatStarParent.children[0]);
                    obj.isScene = 1;
                    obj.delayTime = 0.2;
                    uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
                } else if (handIndex == handIndexs.putCashDesk) {
                    this.popOpsWindow(UtilScene.getSceneItemNodeById(sceneBuildIds.cashDesk)!.node);
                }
            }).start()
        }

    }

    getBorderX() { //0.56  3140-3040 x差100, //0.46 3140
        const sceneCanvas = view.getVisibleSize();
        let gameWidthX = sceneCanvas.width;
        let gameHeightX = sceneCanvas.height;
        let delta = (gameWidthX / gameHeightX - this.oriRate) * 1100
        // UtilPub.log("myrate:", this.borderRrthoHeightMinY/this.borderRrthoHeightMinX, gameWidthX/gameHeightX, delta)
        let rate = (Const.CameraScene.orthoHeight - UtilScene.minVal) / (UtilScene.maxVal - UtilScene.minVal)
        return this.borderRrthoHeightMinX - delta + rate * (this.borderRrthoHeightMaxX - this.borderRrthoHeightMinX)
    }

    getBorderY() {
        let rate = (Const.CameraScene.orthoHeight - UtilScene.minVal) / (UtilScene.maxVal - UtilScene.minVal)
        return this.borderRrthoHeightMinY + rate * (this.borderRrthoHeightMaxY - this.borderRrthoHeightMinY)
    }

    //#region 触摸事件
    //是否超界
    checkOutBorder(pos: Vec3) {
        // UtilPub.log("------边界判断--x---", Const.CameraScene.orthoHeight, this.getBorderX(), "----y-- ", this.getBorderY())
        if (pos.x >= this.getBorderX()) {
            pos.x = this.getBorderX()
        }
        if (pos.x <= -this.getBorderX()) {
            pos.x = -this.getBorderX()
        }
        if (pos.y >= this.getBorderY()) {
            pos.y = this.getBorderY()
        }
        if (pos.y <= -this.getBorderY()) {
            pos.y = -this.getBorderY()
        }
        this.SceneCameraNode.node.setPosition(pos)
    }

    isTouchBuilding(pos: Vec2) {
        if (this.isActiveTouchMove) {
            let script = UtilScene.getSceneNodeScript(this.selItemNode)
            if (UtilPub.insidePolygon(script.getPointsArr(), [pos.x, pos.y]) == true) {
                return { res: true, item: this.selItemNode }
            }

        } else {
            for (let i = 0; i < Const.AllItems.length; i++) {
                let item = Const.AllItems[i]
                let script = UtilScene.getSceneNodeScript(item)
                if (UtilPub.insidePolygon(script.getPointsArr(), [pos.x, pos.y]) == true) {
                    return { res: true, item: item }
                }
            }
        }
        // UtilPub.log("-----item.worldpos", item.worldPosition, "----pos", pos)
        return { res: false, item: null! }
    }

    clickDressItem(skinId: number) {
        //切换选择的对象的图片
        UtilScene.getSceneNodeScript(this.selItemNode).switchIcon(skinId)
    }

    cancelOps() {
        this.isActiveTouchMove = false
        this.touchState = GTouchState.noYet
        poolManager.instance.putNode(this.ops)
        UtilScene.orderAllItems()
        UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
    }

    sureOps() {
        this.isActiveTouchMove = false
        this.touchState = GTouchState.noYet
        let sceneItemScript = UtilScene.getSceneNodeScript(this.selItemNode)
        poolManager.instance.putNode(this.ops)

        if (sceneItemScript.type == GSceneItemType.pendant) {
            this.selItemNode.position = UtilScene.getWallGridPos(
                sceneItemScript.curGridPoint.x,
                sceneItemScript.curGridPoint.y
            )
        } else {
            this.selItemNode.position = UtilScene.getBottomGridPos(
                sceneItemScript.curGridPoint.x + Const.OriOffset.x,
                sceneItemScript.curGridPoint.y + Const.OriOffset.y
            )
        }
        if (sceneItemScript.type == GSceneItemType.carpet || sceneItemScript.type == GSceneItemType.item || sceneItemScript.type == GSceneItemType.pendant) {
            UtilScene.orderAllItems()
            UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
            UtilScene.initAStarObstacles()
            UtilPub.log("--------确定按钮---", sceneItemScript.curGridPoint, this.selItemNode.parent)
        }
        SceneData.ins.setSceneItem(UtilScene.getSceneData(sceneItemScript))
    }

    touchStart(event: EventTouch) {
        // let pos = event.getUILocation()
        //短按，滑动屏幕会移动
        //长按，会检索是否移动
        //双手指会缩放
        let touches = event.getTouches();
        // UtilPub.log("--------touches start", touches.length)
        if (touches.length == 1) {
            this.calTime = 0
            let touchPos = event.getLocation()
            this.touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
            this.touchState = GTouchState.noYet

            //如果点击的位置触碰到目标建筑
            let touchRes = this.isTouchBuilding(v2(this.touchWorldPos.x, this.touchWorldPos.y))
            // UtilPub.log("----------1触碰结果--", this.touchWorldPos, touchRes)


            if (touchRes.res == true) {
                if (this.isActiveTouchMove) {
                    //进入第二移动模式,是同一个才可以移动
                    if (this.selItemNode.uuid == touchRes.item.uuid) {
                        this.touchState = GTouchState.touchOpsArea
                    }
                } else {
                    //如果触碰到的对象，对应的坑位未解锁，那么直接强制改为fasle
                    // let script = UtilScene.getSceneNodeScript(touchRes.item)
                    // let sData = SceneData.ins.getSceneItemById(script.id, script.type)!
                    // // UtilPub.log("----------2触碰结果--", this.touchWorldPos, touchRes, sData)
                    // if(sData.lockState==GLockState.locked){
                    //     this.touchState = GTouchState.touchEmptyArea
                    // }else{
                    //     this.selItemNode = touchRes.item
                    //     this.touchState = GTouchState.touchBuildingReady //触发箭头
                    // }

                    this.selItemNode = touchRes.item
                    this.touchState = GTouchState.touchBuildingReady //触发箭头

                }
            } else {
                this.touchState = GTouchState.touchEmptyArea
            }

        } else if (touches.length == 2) {
            this.startPos1 = touches[0].getUILocation()
            this.startPos2 = touches[1].getUILocation()
            this.pointsDis = Vec2.distance(this.startPos1, this.startPos2)
        }
    }

    touchMove(event: EventTouch) {
        let touches = event.getTouches();
        // UtilPub.log("--------touches move", touches.length, this.isTouch)
        if (touches.length == 1) {
            // this.touchState = GTouchState.touchEmptyArea
            //单手操作
            if (this.touchState == GTouchState.touchBuildingReady) {//如果是箭头状态松开一下就取消
                let ePos = event.getUIDelta()
                let rate = 1.8 * UtilScene.initVal / Const.CameraScene.orthoHeight
                let eFakePos = v2(Math.abs(ePos.x) < rate ? 0 : ePos.x, Math.abs(ePos.y) < rate ? 0 : ePos.y)
                if (eFakePos.x != 0 || eFakePos.y != 0) {
                    this.touchState = GTouchState.touchEmptyArea
                }
            }
            if (this.touchState == GTouchState.touchEmptyArea) {
                let ePos = event.getUIDelta()
                let pos = this.SceneCameraNode.node.position.clone()
                //相机高度越高，操作越快，rate越大
                let rate = Const.CameraScene.orthoHeight / UtilScene.initVal
                this.SceneCameraNode.node.setPosition(v3(pos.x - ePos.x * rate, pos.y - ePos.y * rate, pos.z))
                this.checkOutBorder(this.SceneCameraNode.node.position)
                // UtilPub.log("--------touchMove ePos--- x", this.SceneCameraNode.node.position.x, " y", this.SceneCameraNode.node.position.y)

            } else if (this.touchState == GTouchState.touchOpsArea) { //滑动操作的对象
                //按格子走，判断操作的象限变化
                let sceneItemScript = UtilScene.getSceneNodeScript(this.selItemNode)
                if (sceneItemScript.type == GSceneItemType.item || sceneItemScript.type == GSceneItemType.carpet) {
                    //获得距离触点最近的网格
                    let touchPos = event.getLocation()
                    let touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
                    let min: GIGridData = null!
                    let mindis: number = 1000000
                    let idx: number = 0
                    let realX = 0
                    let realY = 0
                    UtilScene.gridData.forEach(item => {
                        if (item.wps.x - touchWorldPos.x < 60 && item.wps.y - touchWorldPos.y < 60) {
                            idx++
                            let dis = UtilPub.getDis2D(item.wps, touchWorldPos)
                            if (dis < mindis) {
                                mindis = dis
                                min = item
                            }
                        }
                    })
                    // UtilPub.log("---计算几次--", idx)
                    if (min != null) {
                        realX = min.point.x + Const.OriOffset.x //- sceneItemScript.itemSize.x/2 
                        realY = min.point.y + Const.OriOffset.y //- sceneItemScript.itemSize.y/2 
                        // UtilPub.log("---距离检测1--", realX, realY)
                        // UtilPub.log("---距离检测2--", realX<=Const.MaxRoomX-sceneItemScript.itemSize.x, realY<=Const.MaxRoomY-sceneItemScript.itemSize.y)
                        if (realX >= 0 && realX <= Const.MaxRoomX - sceneItemScript.itemSize.x) {
                            realX = realX
                        } else {
                            realX = sceneItemScript.curGridPoint.x
                        }

                        if (realY <= Const.MaxRoomY - sceneItemScript.itemSize.y && realY >= 0) {
                            realY = realY
                        } else {
                            realY = sceneItemScript.curGridPoint.y
                        }

                        //有改变才动
                        if (realX != sceneItemScript.curGridPoint.x || realY != sceneItemScript.curGridPoint.y) {
                            let gridPos = UtilScene.getBottomGridPos(realX, realY)
                            let worldPos = this.GridParent.getComponent(UITransform)!.convertToWorldSpaceAR(gridPos)
                            // UtilPub.log("#########---UIDelta2-- 偏移量", deltaX, deltaY, " --转换后的世界坐标点--", worldPos)
                            // UtilPub.log("#########---UIDelta3-- 最新坐标", realX, realY, " --之前的坐标--", sceneItemScript.curGridPoint)
                            this.ops.setWorldPosition(worldPos)
                            sceneItemScript.curGridPoint = v2(realX - Const.OriOffset.x, realY - Const.OriOffset.y)
                            this.ops.getComponent(scene_ui_ops)!.updShadowOrGrid(sceneItemScript)
                        }
                    }

                } else if (sceneItemScript.type == GSceneItemType.pendant) {
                    //获得距离触点最近的网格
                    let touchPos = event.getLocation()
                    let touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
                    let min: GIGridData = null!
                    let mindis: number = 1000000
                    let idx: number = 0
                    let realX = 0
                    let realY = 0
                    UtilScene.gridWallData.forEach(item => {
                        if (item.wps.x - touchWorldPos.x < 60 && item.wps.y - touchWorldPos.y < 60) {
                            idx++
                            let dis = UtilPub.getDis2D(item.wps, touchWorldPos)
                            if (dis < mindis) {
                                mindis = dis
                                min = item
                            }
                        }
                    })
                    // UtilPub.log("---计算几次--", idx)
                    if (min != null) {
                        realX = min.point.x
                        realY = min.point.y

                        if (realX >= Const.MaxWallXLeft && realX <= Const.MaxWallXRight - sceneItemScript.itemSize.x) {
                            UtilPub.log("---距离检测1--", realX, Const.MaxWallXRight)
                            realX = realX
                        } else {
                            UtilPub.log("---距离检测2--", realX, Const.MaxWallXRight)
                            realX = sceneItemScript.curGridPoint.x
                        }
                        // UtilPub.log("---距离检测2--", realX, Const.MaxWallXRight )

                        if (realY >= 0 && realY <= Const.MaxWallY - sceneItemScript.itemSize.y) {
                            realY = realY
                        } else {
                            realY = sceneItemScript.curGridPoint.y
                        }

                        //跨过墙壁的一瞬间需要变换
                        // UtilPub.log("---跨过墙壁的一瞬间需要变换1--", sceneItemScript.curGridPoint.x, realX)
                        if (sceneItemScript.curGridPoint.x >= 0 && realX < 0 && Math.abs(realX) < sceneItemScript.itemSize.x) {
                            // UtilPub.log("-------取消操作1")
                            realX = 0 //取消操作
                        } else if (sceneItemScript.curGridPoint.x < 0 && Math.abs(realX) < sceneItemScript.itemSize.x) {
                            realX = 0 //取消操作
                            // UtilPub.log("-------取消操作2")
                        }
                        // UtilPub.log("---跨过墙壁的一瞬间需要变换2--", sceneItemScript.curGridPoint.x, realX)

                        //有改变才动
                        UtilPub.log("---取消操作?--", realX, realY, sceneItemScript.curGridPoint)
                        if (realX != sceneItemScript.curGridPoint.x || realY != sceneItemScript.curGridPoint.y) {
                            let gridPos = UtilScene.getWallGridPos(realX, realY)
                            let worldPos = Const.ShadowWallParent.getComponent(UITransform)!.convertToWorldSpaceAR(gridPos)
                            // UtilPub.log("@#########---UIDelta2-- 偏移量", deltaX, deltaY, " --转换后的世界坐标点--", worldPos)
                            UtilPub.log("@#########---UIDelta3-- 最新坐标", realX, realY, " --之前的坐标--", sceneItemScript.curGridPoint)
                            this.ops.setWorldPosition(worldPos)
                            sceneItemScript.curGridPoint = v2(realX, realY)
                            sceneItemScript.setPendantFace()
                            this.ops.getComponent(scene_ui_ops)!.updShadowOrGrid(sceneItemScript)
                        }

                    }
                } else {
                    let ePos = event.getUIDelta()
                    let pos = this.SceneCameraNode.node.position.clone()
                    //相机高度越高，操作越快，rate越大
                    let rate = Const.CameraScene.orthoHeight / UtilScene.initVal
                    this.SceneCameraNode.node.setPosition(v3(pos.x - ePos.x * rate, pos.y - ePos.y * rate, pos.z))
                    this.checkOutBorder(this.SceneCameraNode.node.position)
                }

            }

        } else if (touches.length == 2) {
            // 两根手指是缩放
            let touchPoint1 = touches[0].getUILocation()
            let touchPoint2 = touches[1].getUILocation()
            let newPointsDis = Vec2.distance(touchPoint1, touchPoint2)
            // UtilPub.log("------touch Move", this.pointsDis, newPointsDis)

            if (!this.pointsDis) { // 该行代码针对安卓手机
                this.pointsDis = 0;
            }

            if (newPointsDis < this.pointsDis) {
                // 表明两根手指在往外划，直接变大
                this.pointsDis = newPointsDis;
                // let cameraPos = Const.CameraScene.node.getPosition()
                // UtilPub.log("------touch 表明两根手指在往外划", Const.CameraScene.orthoHeight)
                Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight + 50
                if (Const.CameraScene.orthoHeight >= UtilScene.maxVal) {
                    Const.CameraScene.orthoHeight = UtilScene.maxVal
                }
                this.checkOutBorder(this.SceneCameraNode.node.position)

            } else if (newPointsDis > this.pointsDis) {
                // 表明两根手指在往内划
                this.pointsDis = newPointsDis;
                // let cameraPos = Const.CameraScene.node.getPosition()
                // UtilPub.log("------touch 表明两根手指在往内划", Const.CameraScene.orthoHeight)
                Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight - 50
                if (Const.CameraScene.orthoHeight <= UtilScene.minVal) {
                    Const.CameraScene.orthoHeight = UtilScene.minVal
                }
                this.checkOutBorder(this.SceneCameraNode.node.position)
            }


        }
    }


    touchEnd(event: EventTouch) {
        UtilPub.log("------touchEnd----")
        this.touchState = GTouchState.noYet
    }

    touchCancel(event: EventTouch) {
        UtilPub.log("------touchCancel----")
        this.touchState = GTouchState.noYet
    }

    onMouseWheel(event: EventMouse) {
        let scrollY = event.getScrollY();
        // UtilPub.log("----scrollY------", scrollY, Const.CameraScene.getComponent(Camera)!.orthoHeight)
        if (scrollY > 0) {
            Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight - 50
            if (Const.CameraScene.orthoHeight < UtilScene.minVal) {
                Const.CameraScene.orthoHeight = UtilScene.minVal
            }
        } else {
            Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight + 50 //Math.round(1.05 * Const.CameraScene.orthoHeight)
            if (Const.CameraScene.orthoHeight > UtilScene.maxVal) {
                Const.CameraScene.orthoHeight = UtilScene.maxVal
            }
        }
        // UtilPub.log("------touch 滚轮", Const.CameraScene.orthoHeight)

        this.checkOutBorder(this.SceneCameraNode.node.position)
    }

    onMouseDown(event: EventMouse) {

    }

    onMouseUp(event: EventMouse) {

    }

    public touchEvent() {
        this.offTouchEvent()
        this.SceneBottom.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.SceneBottom.on(Input.EventType.TOUCH_MOVE, this.touchMove, this)
        this.SceneBottom.on(Input.EventType.TOUCH_END, this.touchEnd, this)
        this.SceneBottom.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this)


        this.SceneBottom.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.SceneBottom.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.SceneBottom.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    public offTouchEvent() {
        this.SceneBottom.off(Input.EventType.TOUCH_START, this.touchStart, this);
        this.SceneBottom.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.SceneBottom.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.SceneBottom.off(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);

        this.SceneBottom.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.SceneBottom.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.SceneBottom.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }
    //#endregion 触摸事件

    setStarNode(itemData: any, p: Prefab) {
        let itemScript = UtilScene.getSceneItemNodeById(itemData.id)
        if (itemScript != null) {
            let starNode = poolManager.instance.getNode(p, Const.FloatStarParent)!
            starNode.getComponent(float_star)!.init(itemScript.id, GBuildType.item, itemScript.row.stars.split(",")[1])
            starNode.worldPosition = itemScript.node.worldPosition
            this.starNodes.push(starNode)
        }
    }

    chgGreenStar() {
        this.calTimeForFloatStar = -3
        poolManager.instance.putNodeArr(this.starNodes)
        Const.FloatStarParent.removeAllChildren()
        //遍历所有的房间
        let roomRows = UtilScene.getNeedShowStarRooms()
        // UtilPub.log("--------遍历所有的房间-------", roomRows)
        UtilPub.getPrefab(Const.Prefabs.float_star, (p: Prefab) => {
            roomRows.forEach((roomData: any) => {
                // //房间没解锁不处理
                // if(SceneData.ins.getRoomLockInfoById(roomData.id)==GSceneRoomState.locked){
                //     continue 
                // }
                let floorData = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "type", "5", "room", roomData.id + "")[0]
                //如果房间是未解锁
                if (userData.roleLv >= roomData.lv) {
                    if (SceneData.ins.getRoomLockInfoById(roomData.id) == GSceneRoomState.locked) {
                        //显示房间的解锁星星数,找到房间对应地板的ID
                        let starNode = poolManager.instance.getNode(p, Const.FloatStarParent)!
                        //   let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.sceneItemData.room)
                        starNode.getComponent(float_star)!.init(floorData.id, GBuildType.room, roomData.stars.split(",")[1])
                        starNode.worldPosition = UtilScene.getFloorNodePos(floorData.id).worldPosition
                    } else {
                        //解锁对应房间道具的星星
                        let itemsData = UtilScene.getNeedShowStarSceneItems(roomData.id)
                        if (itemsData.length > 0) {
                            //第一个必须要
                            this.setStarNode(itemsData[0], p)
                        }
                        if (itemsData.length >= 2 && itemsData.length % 3 == 0) {
                            //第二个可能要
                            if (itemsData[1].order > 6) {
                                this.setStarNode(itemsData[1], p)
                            }
                        }
                    }
                }
            })

            let handIndex = composeModel.getHandIndex();
            if (handIndex == handIndexs.buildCashDesk
                || handIndex == handIndexs.putCashDesk
            ) {
                this.goToBuildScene(sceneBuildIds.cashDesk, GBuildType.item);
            }
        })
    }

    popOpsWindow(selItemNode: Node) {
        if (this.SelBuildingParent.children.length > 0) {
            return;
        }
        this.touchState = GTouchState.touchBuildingAlready
        this.isActiveTouchMove = true
        this.popSelectLayer(selItemNode)
    }

    popSelectLayer(selItemNode: Node) {
        this.selItemNode = selItemNode;
        UtilPub.getPrefab(Const.Prefabs.scene_ui_ops, (p: Prefab) => {
            this.ops = poolManager.instance.getNode(p, this.SelBuildingParent)!
            this.ops.worldPosition = v3(selItemNode.worldPosition.x, selItemNode.worldPosition.y + 100, 0)
            //通过接口获得对应的公共参数
            let itemScript = UtilScene.getSceneNodeScript(selItemNode)
            Const.SelSceneNode = selItemNode
            // UtilPub.log("------转面参数是---", itemScript.faceMax, itemScript)
            this.ops.getComponent(scene_ui_ops)!.initParam(itemScript, selItemNode.getComponent(UITransform)!.height, selItemNode)
            itemScript.flashForever(true)
        })
    }

    update(dt: number) {
        if (this.touchState == GTouchState.touchBuildingReady) { //触发长按显示箭头
            // UtilPub.log("--进入触摸建筑--", this.calTime)
            this.calTime += dt
            if (this.calTime >= 0.2) {
                this.touchState = GTouchState.touchBuildingArrow
                //显示进度条
                // UtilPub.log("--显示进度条--")
                UtilPub.getPrefab(Const.Prefabs.scene_ui_arrow, (p: Prefab) => {
                    this.arrow = poolManager.instance.getNode(p, this.SelBuildingParent)!
                    // let UIT = this.selItemNode.getComponent(UITransform)!
                    // this.arrow.worldPosition = v3(this.selItemNode.worldPosition.x + 0, this.selItemNode.worldPosition.y+100-UIT.height/4, 0)
                    let script = UtilScene.getSceneNodeScript(this.selItemNode)
                    this.arrow.worldPosition = script.getCurIconNode().worldPosition
                })
            }

        } else if (this.touchState == GTouchState.touchBuildingArrow) { //回收箭头，显示UI
            this.calTime += dt
            if (this.calTime >= 0.7) {
                this.touchState = GTouchState.touchBuildingAlready
                //完成箭头进度条，进入下一个模式
                // UtilPub.log("--进入下一个模式--")
                //判断脚本节点
                let script = UtilScene.getSceneNodeScript(this.selItemNode)
                let sData = SceneData.ins.getSceneItemById(script.id, script.type)!
                // UtilPub.log("----------2触碰结果--", this.touchWorldPos, touchRes, sData)
                if (sData.lockState == GLockState.locked) {
                    this.emit(GD.event.showTip, { msg: "该装饰暂未解锁" })
                    this.touchState = GTouchState.noYet
                    let itemScript = UtilScene.getSceneNodeScript(this.selItemNode)
                    itemScript.flashOnce()
                } else {
                    this.touchState = GTouchState.touchBuildingAlready
                    this.isActiveTouchMove = true
                    //完成箭头进度条，进入下一个模式
                    // UtilPub.log("--进入下一个模式--")
                    poolManager.instance.putNode(this.arrow)
                    this.popSelectLayer(this.selItemNode);
                }
            }

        } else if (this.touchState == GTouchState.noYet) { //箭头期间中断操作，回收
            poolManager.instance.putNode(this.arrow)
            this.touchState = GTouchState.touchBuildingAlready
        }

        this.calTimeForFloatStar += dt
        if (this.calTimeForFloatStar > 2) {
            this.calTimeForFloatStar = 0
            // this.chgGreenStar()
        }
    }

}
