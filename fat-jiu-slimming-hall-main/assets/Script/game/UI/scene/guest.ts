import { _decorator, Component, Node, Vec3, v3, UITransform, tween, find, sp, Vec2, v2, Details, Asset, Texture2D, SpriteAtlas, SpriteFrame, Scene } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GCurFace, GGuestState, GISceneItemParent, GSceneItemData, GSceneItemType, GSceneSkinState, GSpineAni } from '../../../config/global';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import tables from '../../../easyFramework/other/tables';
import AStar, { AStarNode } from '../../../easyFramework/utils/AStar';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { scene_item_parent } from './scene_item_parent';
import { userData } from '../../comm/UserData';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { guest_mgr } from './guest_mgr';
const { ccclass, property } = _decorator;

@ccclass('guest')
export class guest extends scene_item_parent {
    //房间入口的第一个点
    type: GSceneItemType = GSceneItemType.guest
    itemSize: Vec2 = v2(2, 2)

    get spineAni() { return find("spineAni", this.node)!.getComponent(sp.Skeleton)! }
    get btn() { return find("btn", this.node)! }
    state: GGuestState = GGuestState.nothing
    targetPos: Vec3 = v3()
    speed: number = 0
    quickSpeed: number = 880 * Const.GuestSpeedTime //当轮到它排队的时候速度过来
    private star = new AStar();
    path: AStarNode[] = [] //角色的路径数据
    curGridPoint: Vec2 = v2(0, 0)
    targetPoint: Vec2 = v2(0, 0)
    isMoving: boolean = true
    isMovingEnd: boolean = true
    aniState: GSpineAni | string = null!
    aniScaleX: number = 1

    failCnt: number = 0 //失败的次数
    maxFailCnt: number = 15 //连续失败15次，那么就销毁自己
    calEnterRoomTime: number = 0

    guestData: any = null! //配表数据
    sceneItemData: any = null!
    sceneItemSkinData: any = null!
    targetSceneItemScript: GISceneItemParent = null! //目标场景道具

    calWorkTime: number = 0
    workTime: number = 30 //工作的时间


    isSelOps: boolean = false  //客人是否被拉起
    calTimeForOps: number = 0 //操作判断
    calTimeWorkRest: number = 0 //工作后休息时间不再进入工作状态

    poseRate: number = 3
    defaultSkin: string = "skin1"
    curSceneItemFace: number = 0  //当前工作中的道具的朝向
    isGodWealthShow: boolean = false //财神是否已经出现

    //客人配置信息
    maxRoomTime: number = 20
    toWorkRate: number = 50 //不能是100%否者找不到工作就发呆
    workTimeBaseVal: number = 30

    onLoad() {
        // this.node.active = false
        this.bindButton(this.btn, () => {
            uiManager.instance.showDialog(Const.Dialogs.GodWealthLayer)
        })
    }

    getOneGuest(guestId?: number) {
        let unlockGuestsData = UtilScene.getUnlockGuestData()
        if (unlockGuestsData.length == 0) {
            return false
        }
        let guestData = unlockGuestsData[UtilPub.ranInt(0, unlockGuestsData.length - 1)]
        if (guestId != null) {
            guestData = tables.ins().getTableValueByID(Const.Tables.scene_guest, guestId)
        }
        let spineName = UtilScene.getResSpineIcon(guestData.sp)
        //如果是男女
        if (guestData.id == 88801) {
            let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
            if (item.type == 1) {//男
                spineName = UtilScene.getResSpineIcon(guestData.sp)
            } else {
                spineName = UtilScene.getResSpineIcon(guestData.sp2)
            }
        }
        //动态设置spine文件
        resourceUtil.loadResWithBundle(spineName, sp.SkeletonData, (err, skedata) => {
            if (err) {
                console.error("--------客人spine 资源未找到", guestData, err)
            }
            this.spineAni.skeletonData = skedata;
            // UtilPub.log("--xxxxxxxxxxxx--", guestData)
            this.spineAni.setSkin(this.defaultSkin)
            this.spineAni.setAnimation(0, GSpineAni.walk1, true);
        })

        this.guestData = guestData
        this.sceneItemSkinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.guestData.skin)
        this.sceneItemData = tables.ins().getTableValueByID(Const.Tables.scene_item, this.sceneItemSkinData.scene)

        UtilPub.log("--增加客人ID--", guestId)

        return true
    }

    /**
     * 得到客人对应的空闲的场景道具。TODO 白鹅特殊处理！！！
     * @returns 
     */
    getIdleSceneItem() {
        //每个客人都有自己的目标，通过皮肤表的预制体进行搜索
        let skinDataArr = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "prefab", this.sceneItemSkinData.prefab)
        //如果是白鹅，那么增加动作表的皮肤ID
        if (this.guestData.id == 88001) {
            skinDataArr = []
            let skinAllDataArr = tables.ins().getTableValuesByType(Const.Tables.scene_guest_ani, "guest", this.guestData.id)
            skinAllDataArr.forEach(row => {
                if ((row.skin + "").indexOf("10061") != -1) {
                    skinDataArr.push(tables.ins().getTableValueByID(Const.Tables.scene_skin, row.skin))
                }
            })
        }

        let pickOne: GISceneItemParent = null!
        let map: Map<string, GISceneItemParent> = new Map()
        // UtilPub.log("检查1-----RRRRRRRR------", this.sceneItemSkinData.prefab, skinDataArr)
        for (let i = 0; i < skinDataArr.length; i++) {
            let item = skinDataArr[i]
            //如果未获得皮肤直接跳过
            if (SceneData.ins.getSceneSkinById(item.id) == GSceneSkinState.noGotted) {
                continue
            }
            let script: GISceneItemParent = UtilScene.getSceneItemNodeById(item.scene)!
            // UtilPub.log("找到场景对应的道具----xxxxxxxx------", script.id, script.guestNode==null)

            if (Const.IsShowOpsDialog == true && Const.SelSceneNode != null && UtilScene.getSceneNodeScript(Const.SelSceneNode).id == script.id) {
                //避开被选中的那个场景道具
                continue
            }
            if (script != null && script.guestNode == null && SceneData.ins.getSceneSkinById(script.skin) == GSceneSkinState.gotted) {
                map.set(item.scene, script)
            }
        }
        if (map.size > 0) {
            let arr: string[] = []
            for (let key of map.keys()) {
                arr.push(key)
            }
            let k = arr[UtilPub.ranInt(0, arr.length - 1)]
            // UtilPub.log("找到工作--------------", k)
            pickOne = map.get(k)!
        }

        this.targetSceneItemScript = pickOne
    }

    initGodWealth(state: GGuestState = GGuestState.streetWalk) {
        this.btn.active = true
        let res = this.getOneGuest(88014)
        this.state = state
        this.node.active = true
        this.scheduleOnce(() => {
            this.node.active = true
        }, 1)
        this.curGridPoint = this.getEmptyStreetTargetPoint()
        if (this.curGridPoint == null) {
            return
        }
        let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
        this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
        this.calEnterRoomTime = -999999
        let val = 100 * Const.GuestSpeedTime
        this.speed = UtilPub.ranInt(Math.round(val * 0.8), Math.round(val * 1.5))
        Const.Guests.push(this.node)
    }

    init(state: GGuestState = GGuestState.subway) {
        //随机初始化客人信息，查找客人对应的皮肤是否解锁
        this.btn.active = false
        let res = this.getOneGuest()

        if (res == false) {
            UtilPub.log("没有客人--------------")
            return
        }
        let val = 100 * Const.GuestSpeedTime
        this.speed = UtilPub.ranInt(Math.round(val * 0.8), Math.round(val * 1.5))

        //如果是店长
        if (this.guestData.id == 88801) {
            state = GGuestState.roomWalk
            this.node.parent = Const.ItemParent
        }
        this.state = state
        //有些是从地铁口出现，有些是随机位置
        if (this.state == GGuestState.streetWalk) {
            this.node.parent = Const.StreetFixedNode
            this.curGridPoint = this.getEmptyStreetTargetPoint()
            let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
            this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

        } else if (this.state == GGuestState.roomWalk) {
            this.node.parent = Const.ItemParent
            this.curGridPoint = this.getEmptyRoomTargetPoint()
            let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
            this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

        } else if (this.state == GGuestState.subway) {
            this.node.parent = Const.StreetFixedNode
            this.node.worldPosition = Const.GuestStartPos.worldPosition
        }

        this.node.active = true
        this.calEnterRoomTime = 0
        Const.Guests.push(this.node)
        // UtilPub.log("@@@@------初始化客人3", this.curGridPoint, this.node.worldPosition)
    }

    setAniState(scaleX: number, aniState: GSpineAni | string, isLoop: boolean = true) {
        if (this.aniState != aniState) {
            this.aniState = aniState
            this.spineAni.setAnimation(0, aniState, isLoop);
        }
        if (this.node.scale.x != scaleX) {
            this.aniScaleX = scaleX
            this.node.scale = v3(scaleX, 1, 1)
        }
        // UtilPub.log("@@@@------客人动画", aniState, scaleX)
    }

    //设置皮肤
    setSkin(aniDataL: any) {
        if (aniDataL.spineSkin == null) {
            this.spineAni.setSkin(this.defaultSkin)
        } else {
            UtilPub.log("@@@@------设置皮肤", aniDataL.skin, aniDataL.spineSkin)
            this.spineAni.setSkin(aniDataL.spineSkin)
        }
    }

    /**
     * 避开障碍物的格子
     */
    getEmptyStreetTargetPoint() {
        let idx = UtilPub.ranInt(0, UtilScene.streetEmptyGrids.length - 1)
        let p = UtilScene.streetEmptyGrids[idx]
        return p
    }

    /**
     * 避开房间的障碍物
     * @returns 
     */
    getEmptyRoomTargetPoint() {
        let idx = UtilPub.ranInt(0, UtilScene.roomEmptyGrids.length - 1)
        let p = UtilScene.roomEmptyGrids[idx]
        return p
    }

    nextPosIsBlock(p: Vec2) {
        if (this.state == GGuestState.streetWalking) {
            return UtilScene.streetObstaclesMap.get(p.x + "," + p.y) != null
        } else if (this.state == GGuestState.roomWalking || this.state == GGuestState.backing) {
            return UtilScene.roomObstaclesMap.get(p.x + "," + p.y) != null
        }
    }

    getWalkTime() {
        return UtilPub.getDis2D(this.node.worldPosition, this.targetPos) / this.speed / Const.GuestSpeedTime
    }

    testRoomWayIsBlock() {
        //如果startPos 被挡住，那么就直接返回false
        if (UtilScene.roomObstaclesMap.get(UtilScene.roomDoorPos.x + "," + UtilScene.roomDoorPos.y) != null) {
            return true
        }

        let endPos = this.getEmptyRoomTargetPoint()
        this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), UtilScene.roomDoorPos, endPos, UtilScene.roomObstacles)
        this.star.run()
        this.path = this.star.getPath()
        this.isMoving = true
        // UtilPub.log("@@@@@@@@----有没有路走", this.path.length, this.path, startPos, endPos)
        if (this.path.length == 1 && this.path[0].x == endPos.x && this.path[0].y == endPos.y) {
            return true
        }
        return false
    }

    checkStandy() {
        //11,0为地铁出口的位置， 16,22为街区入口位置， 12,0 为房间开始位置
        if (this.state == GGuestState.subway) {
            this.state = GGuestState.subwaying
            this.node.parent = Const.StreetFixedNode //自动切换父节点
            this.node.worldPosition = Const.GuestStartPos.worldPosition

            this.curGridPoint = v2(UtilScene.subway.x, UtilScene.subway.y)
            let pos = UtilScene.getBottomGridPos(UtilScene.subway.x, UtilScene.subway.y)
            this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

            this.spineAni.setAnimation(0, GSpineAni.walk1, true);
            this.aniTween.stop()
            // UtilPub.log("----------速度如何：", this.getWalkTime(), this.spineAni.getCurrent(1))
            this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).call(() => {
                //开始
                this.state = GGuestState.streetWalk
            }).start()
        }
    }

    checkStreet() {
        if (this.state == GGuestState.streetWalk) {
            //一定概率进入到排队区域
            if (UtilPub.ranInt(0, 100) < 30 && this.guestData && this.guestData.id != 88014) { //不是财神其他人都可以去
                this.state = GGuestState.waitInQueueToRoom
                // UtilPub.log("--------进入房间等待队列--", this.state )
            } else if (this.curGridPoint) {

                this.node.parent = Const.StreetFixedNode //自动切换父节点
                //随机获得目标格子
                this.targetPoint = this.getEmptyStreetTargetPoint() //v2(UtilPub.ranInt(0, Const.MaxStreetX), UtilPub.ranInt(0, Const.MaxStreetY))
                // this.targetPoint = v2(22,8)
                //使用AStar找到路径，然后开始循环的走
                this.star.init(v2(Const.MaxStreetX, Const.MaxStreetY - 1), this.curGridPoint, this.targetPoint, UtilScene.streetObstacles)
                this.star.run()
                this.path = this.star.getPath()

                //路径有概率会算错
                if (this.path.length == 1) {
                    if (this.guestData.id != 88014) this.failCnt += 1
                    this.state = GGuestState.streetWalk
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.streetWalking
                }
            }

            // let targetPoint = this.path.shift()!
            // UtilPub.log("--------设定的路径--", this.curPoint)
            // this.path.forEach(item=>{
            //     UtilPub.log("--------设定的路径--", item.x," ", item.y)
            // })
        }
    }

    checkWaitInQueueToRoom() {
        //在队列中的对象，由管理器来进行控制
        if (this.state == GGuestState.waitInQueueToRoom) {
            this.aniTween.stop()
            this.node.parent = Const.StreetFixedNode //自动切换父节点
            //随机获得目标格子
            // this.targetPoint = this.getEmptyTargetPoint() //v2(UtilPub.ranInt(0, Const.MaxStreetX), UtilPub.ranInt(0, Const.MaxStreetY))
            // this.targetPoint = v2(22,8)
            //使用AStar找到路径，然后开始循环的走
            this.star.init(v2(Const.MaxStreetX, Const.MaxStreetY), this.curGridPoint, this.targetPoint, UtilScene.streetObstacles)
            this.star.run()
            this.path = this.star.getPath()
            //查看路径信息是否正确
            // UtilPub.log(this.path.length,"@@@跑去排队-------当前点----", this.curGridPoint, "----终点--",  this.targetPoint)
            // for(let i=0;i<this.path.length; i++){
            //     UtilPub.log("-------路径是否错误----", this.path[i].x, ", ",this.path[i].y)
            // }
            if (this.path.length == 1) {
                this.failCnt += 1
                this.state = GGuestState.waitInQueueToRoom
            } else {
                this.failCnt = 0
                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.waitInQueueToRooming
                // UtilPub.log(this.path.length,"@@@跑去排队2----是否移动中--", this.isMoving, "----状态--",  this.state)
            }
        }
    }

    checkRoomWalk() {
        if (this.state == GGuestState.roomWalk) {
            //有概率去工作的那个点，切换为工作状态。
            if (this.calEnterRoomTime > this.maxRoomTime) {
                this.calEnterRoomTime = 0
                this.state = GGuestState.back
                UtilPub.log("-------选择离开----")
            } else if (UtilPub.ranInt(0, 100) < this.toWorkRate && this.calTimeWorkRest <= 0 && this.guestData.id != 88011 && this.guestData.id != 88801) { //如果是建筑工时不会去工作的
                this.state = GGuestState.goToWork
                // UtilPub.log("-------去工作----")
            } else {
                let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

                let endPoint = this.getEmptyRoomTargetPoint()
                this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
                this.star.run()
                this.path = this.star.getPath()

                //查看路径信息是否正确
                // UtilPub.log("-------当前点----", this.curGridPoint, "----终点--",  endPoint)
                // for(let i=0;i<this.path.length; i++){
                //     UtilPub.log("-------路径是否错误----", this.path[i].x, ", ",this.path[i].y)
                // }
                if (this.path.length == 1) {
                    this.failCnt += 1
                    this.state = GGuestState.roomWalk
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.roomWalking
                }
            }
        }
    }

    checkBack() {
        if (this.state == GGuestState.back) {
            let endPoint = UtilScene.roomDoorPos
            this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
            this.star.run()
            this.path = this.star.getPath()

            //查看路径信息是否正确
            // UtilPub.log("-------xx当前点----", this.curGridPoint, "----终点--",  endPoint)
            // for(let i=0;i<this.path.length; i++){
            //     UtilPub.log("-------路径是否错误----", this.path[i].x, ", ",this.path[i].y)
            // }
            if (this.path.length == 1) {
                this.failCnt += 1
                this.state = GGuestState.back
                //出不去就不出去
                // UtilPub.log("-------出不去就不出去----", this.failCnt)
                if (this.failCnt > this.maxFailCnt / 3) {
                    this.state = GGuestState.roomWalk
                }
            } else {
                // UtilPub.log("-------开始回家----", this.failCnt)
                this.failCnt = 0
                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.backing
            }
        }
    }

    /**
     * 找到目标周围的点，目标就是障碍物
     * 寻路目标点不能是障碍物
     */
    getTargetRoundEmptyGrid() {
        let startPos = v2(this.targetSceneItemScript.curGridPoint.x - 1, this.targetSceneItemScript.curGridPoint.y - 1)
        let size = v2(this.targetSceneItemScript.itemSize.x + 1, this.targetSceneItemScript.itemSize.y + 1)
        for (let i = 0; i < size.x; i++) {
            for (let j = 0; j < size.y; j++) {
                let x = startPos.x + i
                let y = startPos.y + j
                if (UtilScene.roomEmptyGridsMap.get(x + "," + y) != null) {
                    return v2(x, y)
                }
            }
        }
        return null
    }

    checkToWork() {
        if (this.state == GGuestState.goToWork) {
            this.state = GGuestState.goToWorking
            this.getIdleSceneItem()

            if (this.targetSceneItemScript != null) {
                this.targetSceneItemScript.guestNode = this.node
                UtilPub.log("-------找到工作----", this.targetSceneItemScript)
                //设定item为目标
                let endPoint = this.getTargetRoundEmptyGrid()
                if (endPoint == null) {
                    // UtilPub.log("-------无法到达工作区----", this.targetSceneItemScript)
                    this.state = GGuestState.roomWalk
                    return
                }
                this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
                this.star.run()
                this.path = this.star.getPath()

                //查看路径信息是否正确
                // UtilPub.log("-------当前点----", this.curGridPoint, "----终点--",  endPoint)
                // for(let i=0;i<this.path.length; i++){
                //     UtilPub.log("-------路径是否错误----", this.path[i].x, ", ",this.path[i].y)
                // }
                if (this.path.length == 1) {
                    this.failCnt += 1
                    this.state = GGuestState.goToWork
                    UtilPub.log("-------寻找工作失败----", this.failCnt)
                    //无法去工作就继续游走
                    if (this.failCnt < this.maxFailCnt / 3) {
                        this.state = GGuestState.roomWalk
                    }
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.goToWorking
                }

            } else {
                // UtilPub.log("-------目标家具未找到，找工作失败，继续走----", this.targetSceneItemScript)
                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.roomWalk
            }
        }
    }

    ops(isUp: boolean) {
        this.isSelOps = isUp
    }

    setWorkingAni() {
        //播放对应的动画
        let selIconNode = this.targetSceneItemScript.node.getChildByName("icon" + this.targetSceneItemScript.curFace)!
        selIconNode.active = false
        //通过客人ID和场景道具皮肤ID确定对应的动画皮肤ID
        let aniData = tables.ins().getTableValuesByType2(Const.Tables.scene_guest_ani, "guest", this.guestData.id, "skin", this.targetSceneItemScript.skin + "")[0]
        // UtilPub.log("###-----家具的朝向", this.targetSceneItemScript.curFace)
        //根据目标家具朝向调用对应动画
        let delta = v2(0, 0)
        //设置皮肤
        this.setSkin(aniData)
        if (this.targetSceneItemScript.curFace == GCurFace.face1) { //右下角
            this.setAniState(-1, aniData.ani + "1", true)
            delta = v2(aniData.offset1[0], aniData.offset1[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face2) { //左下
            this.setAniState(1, aniData.ani + "1", true)
            delta = v2(aniData.offset2[0], aniData.offset2[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face3) { //左上
            this.setAniState(-1, aniData.ani + "2", true)
            delta = v2(aniData.offset3[0], aniData.offset3[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face4) { //右上
            this.setAniState(1, aniData.ani + "2", true)
            delta = v2(aniData.offset4[0], aniData.offset4[1])
        }

        this.node.parent = this.targetSceneItemScript.node
        this.node.worldPosition = selIconNode.worldPosition
        //设置偏移
        UtilPub.log("###-----设置偏移", this.targetSceneItemScript.id, this.targetSceneItemScript.curFace, delta)
        this.node.worldPosition = v3(this.node.worldPosition.x + delta.x, this.node.worldPosition.y + delta.y, this.node.worldPosition.z)
    }

    checkWork() {
        if (this.state == GGuestState.work) {
            this.state = GGuestState.working
            this.setWorkingAni()
        }
    }

    runPath() {
        // UtilPub.log("为什么没进1---------", this.path.length, this.isMoving, this.state%2, this.state)
        if (this.path.length > 0 && this.isMoving == false && this.state % 2 == 0) {
            // UtilPub.log("为什么没进2---------", this.path.length, this.isMoving, this.state%2, this.state)
            this.isMoving = true
            this.isMovingEnd = false

            //有概率原地摆pose
            let delay = 0
            let targetPoint = new AStarNode(this.curGridPoint.x, this.curGridPoint.y)

            if (UtilPub.ranInt(0, 100) < this.poseRate) {
                delay = 3
                if (UtilPub.ranInt(0, 100) < 50) {
                    this.setAniState(this.node.scale.x, GSpineAni.pose1, false)
                } else {
                    this.setAniState(this.node.scale.x, GSpineAni.pose2, false)
                }
                let pos = UtilScene.getBottomGridPos(targetPoint.x, targetPoint.y)
                this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
            } else {
                targetPoint = this.path.pop()!
                // if(targetPoint.y>50 || targetPoint.x>50){
                //     UtilPub.log("-BlOCK---------", this.path, targetPoint)
                // }
                if (this.nextPosIsBlock(v2(targetPoint.x, targetPoint.y))) {
                    //如果下一个目标点有障碍物，那么直接停住，然后重新选择
                    this.path = []
                    this.isMoving = true
                    //如果找工作被拦截
                    if (this.state == GGuestState.goToWorking) {
                        this.state = GGuestState.roomWalk
                    } else {
                        // UtilPub.warn("-------当前点----", this.curGridPoint, "----终点--",  this.targetPoint)
                        // for(let i=0;i<this.path.length; i++){
                        //     UtilPub.warn("-------路径是否错误----", this.path[i].x, ", ",this.path[i].y)
                        // }
                        this.state = this.state - 1 //切换到对应的准备状态
                    }
                    this.failCnt += this.maxFailCnt

                    UtilPub.warn("!!!!!!-BlOCK---------", this.state, this.targetPoint.x, this.targetPoint.y)
                    return
                }

                let pos = UtilScene.getBottomGridPos(targetPoint.x, targetPoint.y)
                this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

                //根据目标的方向决定正反面
                //           15,1
                //  14,2  15,2  16,2
                // 14,3  15,3
                let deltaX = this.curGridPoint.x - targetPoint.x
                let deltaY = this.curGridPoint.y - targetPoint.y

                if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                    //异常情况直接飞过去
                    UtilPub.error("-------异常情况直接飞过去----", this.curGridPoint, "----终点--", this.targetPoint)
                    for (let i = 0; i < this.path.length; i++) {
                        UtilPub.error("-------路径是否错误----", this.path[i].x, ", ", this.path[i].y)
                    }
                    deltaX = 0
                    deltaY = 0
                    this.curGridPoint = v2(targetPoint.x, targetPoint.y)
                    let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                    this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                }

                if (deltaX > 0 && deltaY == 0) { // 16,2 左上角
                    // UtilPub.log("--------1左上角", deltaX, deltaY)
                    this.setAniState(-1, GSpineAni.walk2, true)

                } else if (deltaX < 0 && deltaY == 0) { //14,2 往右下走
                    // UtilPub.log("--------2往右下走", deltaX, deltaY)
                    this.setAniState(-1, GSpineAni.walk1, true)

                } else if (deltaX == 0 && deltaY < 0) { //15,3 往左下走
                    // UtilPub.log("--------3往左下走", deltaX, deltaY)
                    this.spineAni.node.scale = v3(1, 1, 1)
                    this.setAniState(1, GSpineAni.walk1, true)

                } else if (deltaX == 0 && deltaY > 0) { //15,1 往右上走
                    // UtilPub.log("--------4往右上走", deltaX, deltaY)
                    this.spineAni.node.scale = v3(1, 1, 1)
                    this.setAniState(1, GSpineAni.walk2, true)
                } else {
                    // UtilPub.log("--------原地", deltaX, deltaY)
                    // this.setAniState(this.node.scale.x, GSpineAni.pose1, true)
                }
            }


            this.aniTween.stop()
            // UtilPub.log("--------走路延迟", delay)
            if (delay == 0) {
                this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).call(() => {
                    this.runPathEnd(targetPoint)
                }).start()
            } else {
                this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).delay(delay / Const.GuestSpeedTime).call(() => {
                    this.runPathEnd(targetPoint)
                }).start()
            }

        }
    }

    runPathEnd(targetPoint: AStarNode) {
        this.targetPos = null!
        this.curGridPoint = v2(targetPoint.x, targetPoint.y)
        // UtilPub.log("--------走完结束---当前节点", this.curGridPoint, this.state, this.path.length)
        if (this.path.length == 0) {
            this.isMovingEnd = true
            this.isMoving = false
            //走完状态回收
            if (this.state == GGuestState.streetWalking) {
                this.state = GGuestState.streetWalk
            } else if (this.state == GGuestState.waitInQueueToRooming) {
                // UtilPub.log("--------去排队", this.curGridPoint, this.state, this.path.length)
                this.setAniState(this.node.scale.x, GSpineAni.idle1, true)
                this.state = GGuestState.roomDoorStay
            } else if (this.state == GGuestState.roomWalking) {
                this.state = GGuestState.roomWalk //roomWalk有概率切换到work //到时间会选择离开
            } else if (this.state == GGuestState.goToWorking) {
                this.state = GGuestState.work //开始工作
            } else if (this.state == GGuestState.backing) {
                // UtilPub.log("--------走完结束---当前节点", this.curGridPoint, this.state, this.path.length)
                this.leaveAway()
            }
        } else {
            this.isMoving = false
            this.runPath()
        }
    }

    leaveAway() {
        this.state = GGuestState.subway
        this.node.active = false
        this.emit(GD.event.guestLeave, this.node)
    }

    update(deltaTime: number) {
        this.calTime += deltaTime
        if (this.calTime > 0.3 / Const.GuestSpeedTime) {
            this.calTime = 0
            this.checkWork()
            this.checkToWork()
            this.checkBack()
            this.checkRoomWalk()
            this.checkStandy()
            this.checkStreet()
            if (this.isMovingEnd == true) this.runPath()
            // UtilPub.log("-----当前节点信息", this.node.scale.x , this.aniState, this.node.children[0].scale)
        }

        //工作倒计时
        if (this.state == GGuestState.working) {
            if (this.targetSceneItemScript != null) {
                if (this.isSelOps) { //客人被拉起
                    this.targetSceneItemScript.setFace(this.targetSceneItemScript.curFace)
                    this.spineAni.node.active = false
                } else {//客人是放下的状态
                    let selIconNode = this.targetSceneItemScript.node.getChildByName("icon" + this.targetSceneItemScript.curFace)!
                    selIconNode.active = false
                    this.spineAni.node.active = true

                    if (this.curSceneItemFace != this.targetSceneItemScript.curFace) {
                        this.curSceneItemFace = this.targetSceneItemScript.curFace
                        this.setWorkingAni()
                        UtilPub.log("--------测试---")
                    }

                }
            }

            //客人的道具被拉起停止计时
            if (!this.isSelOps) {
                this.calWorkTime += deltaTime
            }
            if (this.calWorkTime > this.workTime) {
                this.workTime = UtilPub.ranInt(this.workTimeBaseVal * 0.7, this.workTimeBaseVal * 1.3)
                this.calWorkTime = 0
                this.targetSceneItemScript.guestNode = null!
                this.node.parent = Const.ItemParent
                //如果是工作状态，当前点必须找一个空地的格子，找不到直接处理掉
                let curPos = this.getTargetRoundEmptyGrid()
                if (curPos == null) {
                    this.leaveAway()
                    UtilPub.log("-----被强制离开", this.targetSceneItemScript.node)
                } else {
                    this.state = GGuestState.roomWalk
                    this.curGridPoint = curPos
                    let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                    this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                    this.setAniState(this.node.scale.x, GSpineAni.idle1, false)
                }

                this.targetSceneItemScript.setFace(this.targetSceneItemScript.curFace)
                this.spineAni.node.active = true
                this.calTimeWorkRest = 10
                // UtilPub.log("-----工作完毕离开", this.targetSceneItemScript.node)
                this.targetSceneItemScript = null!
            }

        } else {
            this.calTimeWorkRest -= deltaTime
        }

    }
}


