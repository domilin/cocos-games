import { _decorator, Component, Node, Prefab, Vec2, v2, UITransform, tween } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GGuestState, GSceneRoomState, GSpineAni, GStreetQueueFlag } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { guest } from './guest';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('guest_mgr')
export class guest_mgr extends comm {
    private static _instance: guest_mgr;
    static get ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new guest_mgr();
        return this._instance;
    }

    
    queueGuests:Node[]=[] //客人队列

    //等待起点
    waitStartPos:Vec2 = v2(16,22)
    waitGrids:Map<string, number>= new Map<string, number>()
    waitGridsArr:Vec2[] = []

    streetLimit:number= 15
    roomLimit:number=15 
    interval:number=3
    spineFile:string=""
    queueCalTime:number=0
    orderGuestCalTime:number=0
    bugLeaveCalTime:number=0
    isOutQueuing:boolean = false //是否正在出队列

    onLoad() {
        this.on(GD.event.intoTheWaitQueue, this.intoTheWaitQueue)
        this.on(GD.event.guestLeave, this.guestLeave)
        this.getRoomMaxGuests()
        this.genWaitGrids()
    }

    getRoomMaxGuests(){
        let roomRows = tables.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        this.roomLimit=0
        roomRows.forEach((item:any)=>{
            if(SceneData.ins.getRoomLockInfoById(item.id)==GSceneRoomState.unlock){
                this.roomLimit+= item.cnt
            }
        })
        UtilPub.log("--------最大房间人数", this.roomLimit)
    }

    guestLeave(node:Node){
        let arr:Node[] = []
        Const.Guests.forEach(item=>{
            if(node.uuid == item.uuid){
                poolManager.instance.putNode(item)
            }else{
                arr.push(item)
            }
        })
        Const.Guests = arr
    }

    //生成排队的数组
    genWaitGrids(){
        for(let i=0;i<this.streetLimit; i++){
            //0 表示没有占用，1表示占用
            this.waitGrids.set(this.waitStartPos.x+","+(this.waitStartPos.y-i), GStreetQueueFlag.noOccupy)
            this.waitGridsArr.push(v2(this.waitStartPos.x, this.waitStartPos.y-i))
        }
    }

    isInTheQueue(node:Node){
        for(let i=0;i<this.queueGuests.length; i++){
            if(node.uuid==this.queueGuests[i].uuid){
                return true
            }
        }
        return false 
    }

    intoTheWaitQueue(){
        //检查所有的人，然后设置在房间等待的人，设置他们的目标点，并且执行运行
        //选1个没在队列中的人进入队列，强制拉入。 
        let pickOne:Node = null! 
        // UtilPub.log("#####----指派客人去排队, 客人数量", this.streetGuests)
        for(let i=0;i<Const.Guests.length; i++){
            let script = Const.Guests[i].getComponent(guest)!
            let isInTheQueue:boolean = this.isInTheQueue(Const.Guests[i])
            // UtilPub.log("#####----队列角色", isInTheQueue, script.state)
            if(script.state==GGuestState.waitInQueueToRoom && !isInTheQueue){
                pickOne = Const.Guests[i]
            }
        }
        if(pickOne!=null){
            //往前走
            // UtilPub.log("#####---指派进入队伍", pickOne)
            let script = pickOne.getComponent(guest)!
            let next = this.queueGuests.length
            script.targetPoint =  this.waitGridsArr[next]
            script.checkWaitInQueueToRoom()
            this.queueGuests.push(pickOne)
        }
    }

    outTheWaitQueue(){
        //先寻路，如果有路径，那么才走

        //从队列中走出来1个，所有对象往前移动1格
        if(this.queueGuests.length>0 && this.isOutQueuing==false){
            let gusetFirst = this.queueGuests[0].getComponent(guest)!
            // UtilPub.log("-----------11111队列第一个客人情况！！", gusetFirst.state)
            if(gusetFirst.state==GGuestState.roomDoorStay){
                let isBlock = gusetFirst.testRoomWayIsBlock()
                // UtilPub.log("-----------22222队列第一个客人情况！！", gusetFirst.state, isBlock)
                if(isBlock==false){
                    this.isOutQueuing = true
                    //选择第一个出来
                    let pickOne:Node = this.queueGuests.shift()!
                    let script = pickOne.getComponent(guest)!
                    let oldPos = pickOne.worldPosition.clone()

                    //第一个客人要就位才可以取
                    pickOne.parent = Const.ItemParent
                    pickOne.worldPosition = oldPos
                    script.curGridPoint = v2(UtilScene.roomDoorPos.x, UtilScene.roomDoorPos.y)
                    let pos = UtilScene.getBottomGridPos(script.curGridPoint.x, script.curGridPoint.y)
                    // script.node.worldPosition = script.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                    script.targetPos = script.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                    // UtilPub.log("--333333-------队列第一个客人情况！！", oldPos)
                    script.setAniState(script.node.scale.x, GSpineAni.walk1)
                    this.aniTween = tween(script.node).to(script.getWalkTime(), {worldPosition: script.targetPos}).call(()=>{
                        // UtilPub.log("--444444---------队列第一个客人情况！！", pickOne.worldPosition)
                        pickOne.getComponent(guest)!.state = GGuestState.roomWalk
                        this.isOutQueuing = false
                        //到位后其他人再移动
                        //遍历所有等待的人，前进1格
                        for(let i=0;i<this.queueGuests.length; i++){
                            let item = this.queueGuests[i]
                            let script1 = item.getComponent(guest)!
                            let next = i
                            script1.targetPoint =  this.waitGridsArr[next]
                            if(script1!.state!=GGuestState.roomDoorStay){
                                //还未到达排队终点的肥啾重新设定路线
                                // script1!.state=GGuestState.waitInQueueToRoom
                                // continue
                                script1.isMovingEnd=true
                            }
                            script1.state=GGuestState.waitInQueueToRoom
                            script1.checkWaitInQueueToRoom()
                        }
                        

                    }).start()
                }
            }
        }
    }

    updQueue(){
        //每秒更新队列里的客人，调整位置
    }

    getStreetGuestCnt(){
        let streetCnt =0
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.state<=GGuestState.roomDoorStay){
                streetCnt+=1
            }
        })
        return streetCnt
    }

    getRoomGuestCnt(){
        let roomCnt =0
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.state>GGuestState.roomDoorStay){
                roomCnt+=1
            }
        })
        return roomCnt
    }

    init(){
        //解锁的客人池子中获得1个客人的信息
        this.spineFile = ""
        UtilScene.setGuestMaxNum()
        //初始化障碍物
        UtilScene.initAStarObstacles()
        //初始化随机n个出现在街道上，之后都是从地铁进来的。房间没有满员，就进去，满员就排队。
        //从地铁口到房间门口
        //房间对应解锁，就有新客人，默认都有
        let unlockGuestsData = UtilScene.getUnlockGuestData()
        if(unlockGuestsData.length>0){
            UtilPub.getPrefab(Const.Prefabs.guest,(p:Prefab)=>{
                //街道出现n个
                let n = UtilPub.ranInt(2, Math.floor(this.streetLimit/2))
                // let n = 1
                for(let i=0;i<n;i++){
                    //房间对应解锁
                    UtilPub.log("----------街道出现n个", i)
                    let item = poolManager.instance.getNode(p, Const.StreetFixedNode,false) //默认放在街道上，如果进入房间自动切换父节点
                    item.getComponent(guest)!.init(GGuestState.streetWalk)
                }
                let roomCnt= Math.round(this.roomLimit * UtilPub.ranInt(15,35)/100)
                for(let i=0;i<roomCnt;i++){
                    //房间对应解锁
                    UtilPub.log("----------房间瞬间出现n个", i)
                    let item = poolManager.instance.getNode(p, Const.ItemParent,false) //默认放在街道上，如果进入房间自动切换父节点
                    item.getComponent(guest)!.init(GGuestState.roomWalk)
                }
            })
        }
    }

    orderGuests(){
       UtilScene.orderSceneItemNodeChildren(Const.StreetFixedNode)
       UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
    }

    guestBugLeave(){
        //把这个离开的客人搞到地铁口那里出来
        let newArr:Node[] = []
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.failCnt>=script.maxFailCnt){
                script.state = GGuestState.subway
                poolManager.instance.putNode(script.node)
                UtilPub.log("----------清理bug客人", script)
            }
            newArr.push(script.node)
        })
        Const.Guests = newArr
        
    }

    checkGuests(){
        Const.Guests.forEach(item=>{
            let g = item.getComponent(guest)!
            UtilPub.log("-----客人信息---", g.state)
        })
    }

    update(deltaTime:number) {
        this.calTime += deltaTime
        if(this.calTime > this.interval){
            this.interval = UtilPub.ranInt(2,5)
            this.calTime = 0

            //如果街道未满员，那么就从地铁口出来
            if(this.getStreetGuestCnt() < this.streetLimit && this.getRoomGuestCnt()<this.roomLimit){
                // let delta= this.streetLimit - this.getStreetGuestCnt()
                //一次性给出n个
                let unlockGuestsData = UtilScene.getUnlockGuestData()
                if(unlockGuestsData.length>0){
                    // UtilPub.log("----------街道未满员，那么就从地铁口出来")
                    UtilPub.getPrefab(Const.Prefabs.guest,(p:Prefab)=>{
                        let item = poolManager.instance.getNode(p, Const.StreetFixedNode,false) //默认放在街道上，如果进入房间自动切换父节点
                        item.getComponent(guest)!.init(GGuestState.subway)
                    })
                }
            }

            //增加1个财神
            if(userData.roleLv >= tables.ins().config["theGodOfWealthShowLv"] && Const.isGodWealthShow==false ){
                //如果玩家等级大于固定值
                Const.isGodWealthShow=true
                UtilPub.log("----------增加财神-----")
                UtilPub.getPrefab(Const.Prefabs.guest,(p:Prefab)=>{
                    let item = poolManager.instance.getNode(p, Const.StreetFixedNode,false) //默认放在街道上，如果进入房间自动切换父节点
                    item.getComponent(guest)!.initGodWealth(GGuestState.streetWalk)
                })
            }

        }

        //派遣去排队
        this.queueCalTime += deltaTime
        if(this.queueCalTime>1){
            this.queueCalTime=0
            this.intoTheWaitQueue()

            //如果房间未满员
            if(this.getRoomGuestCnt()< this.roomLimit){
                this.outTheWaitQueue()
            }
        }

        this.orderGuestCalTime += deltaTime
        if(this.orderGuestCalTime>0.6){
            this.orderGuestCalTime=0
            this.orderGuests()
           
        }

        this.bugLeaveCalTime += deltaTime
        if(this.bugLeaveCalTime>3){
            this.bugLeaveCalTime = 0
            this.guestBugLeave()
            this.getRoomMaxGuests()

            // this.checkGuests()
        }
        
    }
}


