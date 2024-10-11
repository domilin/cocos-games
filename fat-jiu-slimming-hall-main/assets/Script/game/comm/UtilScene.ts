import { _decorator, Node, v3, v2, Vec2, Vec3, UITransform, Prefab, Scene, tween, SpriteFrame, Sprite, director } from 'cc';
import { Const } from '../../config/Const';
import { GCurFace, GIGridData, GISceneItemParent, GLockState, GSceneItemData, GSceneItemType, GSceneRoomReceiveState, GSceneRoomState, GSceneSkinState, GStreetQueueFlag, GTypeStrNode } from '../../config/global';
import { comm } from '../../easyFramework/mgr/comm';
import { poolManager } from '../../easyFramework/mgr/poolManager';
import tables from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { grid } from '../UI/scene/grid';
import { grid_wall } from '../UI/scene/grid_wall';
import { guest_mgr } from '../UI/scene/guest_mgr';
import { scene_item_parent } from '../UI/scene/scene_item_parent';
import { SceneData } from './SceneData';
import { userData } from './UserData';
import GD from '../../config/GD';
import { Notifications } from '../../easyFramework/mgr/notifications';
import { guest } from '../UI/scene/guest';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
const { ccclass, property } = _decorator;

/**
 * 本游戏中特有的工具类
 */
@ccclass('UtilScene')
export class UtilScene extends comm {
    public static restartGame() {
        Notifications.clear()
        ServerCtrJSF.GetInstance().isLoadAll = false
        ServerCtrJSF.GetInstance().isLogin = false
        Const.isGodWealthShow = false
        director.loadScene("loading")
    }

    //最大和最小
    public static maxVal: number = 3000
    public static minVal: number = 500
    public static initVal: number = 925
    public static ExpTimes: number = 5
    //客人随机的最大客人数
    public static GuestMaxNum: Map<number, number> = new Map<number, number>()

    public static setSkinIcon(node: Sprite, skinData: any) {
        let icon = skinData.icon0
        if (icon == "") {
            icon = "icon_" + skinData.id
        }
        UtilPub.getPic(UtilScene.getResSceneIcon(icon), (sf: SpriteFrame) => {
            if (sf != null) {
                node.spriteFrame = sf
            } else {
                UtilPub.getPic(Const.resPath.defaultSceneIcons + "icon_default", (sf: SpriteFrame) => {
                    node.spriteFrame = sf
                })
            }
        })
    }

    public static hideDebugPoint1() {
        Const.FloorFixedNode.children.forEach((row) => {
            if (row.children.length > 0) {
                // console.log("@@@@@@@@@@@@@@@)))", row.children[0])
                row.children[0].getChildByName("points1")!.active = false
            }
        })
        Const.WallFixedNode.children.forEach((row) => {
            if (row.children.length > 0) {
                // console.log("@@@@@@@@@@@@@@@)))", row.children[0])
                row.children[0].getChildByName("points1")!.active = false
            }
        })
    }

    //获得场景图片资源的路径
    public static getResSceneIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {//没配置就走默认的图标路径
            reval = Const.resPath.defaultSceneIcons + path
        } else {
            reval = path
        }
        // UtilPub.log("---------增加图标", reval)
        return reval
    }

    //获得场景预制体资源的路径
    public static getResPrefabIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {//没配置就走默认的图标路径
            reval = Const.resPath.defaultScenePrefabs + path
        } else {
            reval = path
        }
        // UtilPub.log("---------增加预制体", reval)
        return reval
    }

    //获得场景Spine资源的路径
    public static getResSpineIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {//没配置就走默认的图标路径
            reval = Const.resPath.defaultGuestSpine + path
        } else {
            reval = path
        }
        // UtilPub.log("---------增加Spine", reval)
        return reval
    }

    /**
     * 设置场景解锁动画
     * @param node 
     */
    public static setSceneItemAni(node: Node, cb?: Function) {
        let oriPos = node.position.clone()
        node.position = v3(oriPos.x, oriPos.y + 100, oriPos.z)
        tween(node)
            .to(0.1, { position: oriPos })
            .to(0.1, { position: v3(oriPos.x, oriPos.y + 50, oriPos.z) })
            .to(0.1, { position: oriPos })
            .to(0.1, { position: v3(oriPos.x, oriPos.y + 25, oriPos.z) })
            .to(0.1, { position: oriPos }).call(() => {
                cb && cb()
            }).start()
    }

    public static setGuestMaxNum() {
        let guestsData = tables.ins().getTableValuesByType(Const.Tables.scene_guest, "eff", "1")
        guestsData.forEach((item) => {
            UtilScene.GuestMaxNum.set(item.id, UtilPub.ranInt(item.limit[0], item.limit[1]))
        })
    }

    /**
     * 获得解锁道具对应的的客人数据
     * @returns 
     */
    public static getUnlockGuestData() {
        let guestsData = tables.ins().getTableValuesByType(Const.Tables.scene_guest, "eff", "1")
        let unlockGuestsData: any = []
        guestsData.forEach((item) => {
            //对应的皮肤解锁的那些客人才可以出现
            if (SceneData.ins.getSceneSkinById(item.skin) == GSceneSkinState.gotted) {
                //对应存在的客人数量不能超过最大数量
                let cur = UtilScene.getGuestCntById(item.id)
                let max = UtilScene.GuestMaxNum.get(item.id)!
                // UtilPub.log("客人情况-----", cur, max, UtilScene.GuestMaxNum, item.id)
                if (cur < max) {
                    unlockGuestsData.push(item)
                }
            }
        })
        return unlockGuestsData
    }

    public static getGuestCntById(guestId: number) {
        let cnt = 0
        Const.Guests.forEach(item => {
            let script = item.getComponent(guest)!
            if (script.guestData.id == guestId) {
                cnt += 1
            }
        })
        return cnt
    }

    public static getRoomBuildProgress(roomId: number) {
        let roomItems = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
        let totalStar: number = 0
        let curStar: number = 0
        for (let i = 0; i < roomItems.length; i++) {
            let itemData = roomItems[i]
            totalStar += parseInt(itemData.stars.split(",")[1])
            if (SceneData.ins.getSceneItemById(itemData.id, itemData.type)!.lockState == GLockState.unlock) {
                curStar += parseInt(itemData.stars.split(",")[1])
            }
            // UtilPub.log("======星星数---", totalStar, curStar, itemData.id)
        }
        let val = curStar / totalStar
        return val
    }


    /**
     * 根据地板的ID获得对应的节点
     * @param id 
     * @returns 
     */
    public static getFloorNodeById(id: number) {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.FloorFixedNode.children.length; i++) {
            let item = Const.FloorFixedNode.children[i].children[0]
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == id) {
                resScript = script
                break;
            }
        }
        return resScript
    }

    public static getFloorNodePos(id: number) {
        let floorNode: Node = null!
        for (let i = 0; i < Const.FloorFixedNode.children.length; i++) {
            let item = Const.FloorFixedNode.children[i]
            if (item.name.split("_")[1] == id + "") {
                floorNode = item
                break;
            }
        }
        return floorNode
    }

    /**
     * 根据墙壁的ID获得对应的节点
     * @param id 
     * @returns 
     */
    public static getWallNodeById(id: number) {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.WallFixedNode.children.length; i++) {
            let item = Const.WallFixedNode.children[i].children[0]
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == id) {
                resScript = script
                break;
            }
        }
        return resScript
    }

    //是否有场景的道具可以被建造
    public static isSceneItemCouldBeBuild() {
        let needShowRooms = UtilScene.getNeedShowStarRooms()
        for (let i = 0; i < needShowRooms.length; i++) {
            let roomId = needShowRooms[i].id
            let items = UtilScene.getNeedShowStarSceneItems(roomId)
            // console.log("----------是否有场景的道具可以被建造---",roomId, userData.greenStar, items[0].stars.split(",")[1])
            if (items.length > 0) {
                if (userData.greenStar >= items[0].stars.split(",")[1]) {
                    return true
                }
            }
        }
        return false
    }

    public static getNeedShowStarSceneItems(roomId: number) {
        let roomItems = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
        roomItems.sort((a, b) => {
            return a.order - b.order
        })

        //获得未解锁的场景道具
        let items: any = []
        for (let i = 0; i < roomItems.length; i++) {
            let itemData = roomItems[i]
            let script = SceneData.ins.getSceneItemById(itemData.id, itemData.type)!
            if (script != null) {
                if (script.lockState == GLockState.locked) {
                    items.push(itemData)
                }
            }
        }
        return items
    }

    /**
     * 获得要展示的房间配表数据
     * @returns 
     */
    public static getNeedShowStarRooms() {
        //展示已经解锁的房间 + 未解锁的（达成等级条件的）1个房间
        let roomRows = tables.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        let needShowRooms: any = []
        for (let i = 0; i < roomRows.length; i++) {
            let row = roomRows[i]
            if (SceneData.ins.getRoomLockInfoById(row.id) == GSceneRoomState.unlock) {
                // UtilPub.log("####--------已解锁房间", row.id)
                let items = UtilScene.getNeedShowStarSceneItems(row.id)
                if (items.length > 0 || SceneData.ins.getRoomReceiveInfoById(row.id) == GSceneRoomReceiveState.unReceive) { //至少有一个道具可以解锁
                    needShowRooms.push(row)
                }
            } else {
                //满足解锁条件
                // UtilPub.log("####--------未解锁房间满足解锁条件", userData.roleLv, row.id, row.lv)
                if (userData.roleLv >= row.lv) {
                    needShowRooms.push(row)
                    break
                }
            }
        }
        return needShowRooms
    }

    /**
     * 获得场景道具，通过ID
     */
    public static getSceneItemNodeById(sceneId: number): GISceneItemParent | undefined {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.AllItems.length; i++) {
            let item = Const.AllItems[i]
            if (item == null) {
                continue
            }
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == sceneId) {
                resScript = script
                // console.log("------!!!!!xxxxxxxxxxxxxx", script.id)
                break;
            }
        }
        return resScript
    }

    public static exportAllItems() {
        let arr: Node[] = Object.assign([], Const.AllItems);
        arr.sort((a, b) => {
            let a1 = UtilScene.getSceneNodeScript(a)
            let b1 = UtilScene.getSceneNodeScript(b)
            return a1.id - b1.id
        })
        let s = ""
        arr.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, script.skin)
            // UtilPub.log(script.skin+" ", 
            //     skinData.name+" 位置("+script.curGridPoint.x +","+script.curGridPoint.y+") 朝向curFace "+script.curFace
            //     // " --位置Points", JSON.stringify(script.getPointsArr())
            // )
            s += skinData.name + "," + script.skin + "," + script.id + "," + "[" + script.curGridPoint.x + "_" + script.curGridPoint.y + "]" + "," + script.curFace + "\n"

        })
        UtilPub.log(s)
    }


    //房间中的障碍物，在23x60中剔除
    public static roomEmptyGrids: Vec2[] = [] //房间空的地方
    public static roomEmptyGridsMap: Map<string, number> = new Map<string, number>(); //房间空的地方
    public static roomObstacles: Vec2[] = []
    public static roomObstaclesMap: Map<string, number> = new Map<string, number>();
    //街道上的障碍物，在88x88种剔除
    public static streetEmptyGrids: Vec2[] = [] //街道空的地方
    public static streetEmptyGridsMap: Map<string, number> = new Map<string, number>(); //街道空的地方
    public static streetObstacles: Vec2[] = []
    public static streetObstaclesMap: Map<string, number> = new Map<string, number>();
    //初始位置
    public static subway: Vec2 = v2(11, 0); //地铁
    public static roomDoorPos: Vec2 = v2(12, 0); //房间门入口

    //街道
    public static streetGrids: Map<string, number> = new Map<string, number>();
    //底部的格子
    public static grids: Map<string, number> = new Map<string, number>();
    //侧向的格子
    public static wallGrids: Map<string, number> = new Map<string, number>();
    //临时显示的网格节点，当长按箭头后
    public static tmpGridsUI: Node[] = []
    //初始化墙壁网格
    public static initWallGrids() {
        let len = 24  //88
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < 8; j++) {
                this.wallGrids.set(i + "," + j, 1)
            }
        }
        for (let i = 1; i < len + 1; i++) {
            for (let j = 0; j < 8; j++) {
                this.wallGrids.set(-i + "," + j, 1)
            }
        }
        this.genWallGrids(this.wallGrids)
    }

    public static genWallGrids(grids: Map<string, number>) {
        poolManager.instance.putNodeArr(this.tmpGridsUI)
        UtilPub.getPrefab(Const.Prefabs.grid_wall, (p: Prefab) => {
            grids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = poolManager.instance.getNode(p, Const.WallGridParent, true)!
                item.getComponent(grid_wall)!.init(x, y)
                UtilPub.log("-------日志--", x, -y)
                if (x < 0) {
                    item.scale = v3(-Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    item.position = UtilScene.getWallGridPos(x, y)
                } else {
                    item.scale = v3(Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    item.position = UtilScene.getWallGridPos(x, y)
                }
                this.tmpGridsUI.push(item)
            })
            // item.getComponent()
            // UtilPub.log("---直接把 scene_day222 挂到主菜单下----",this.SceneNode.layer, item.layer)
        })
    }

    public static initStreetGrids() {
        //88x88, 11,0为地铁出口的位置， 16,22为街区入口位置， 12,0 为房间开始位置
        for (let i = 0; i < 88; i++) {
            for (let j = 0; j < 23; j++) {
                this.streetGrids.set(i + "," + j, 1)
            }
        }
        this.genStreetGrids(this.streetGrids)
    }

    public static genStreetGrids(streetGrids: Map<string, number>) {
        UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
            streetGrids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = poolManager.instance.getNode(p, Const.StreetFixedNode, true)!
                item.getComponent(grid)!.init(x, y)
                // UtilPub.log("-------日志--", x, -y)
                item.position = UtilScene.getBottomGridPos(x, y)
            })
            // item.getComponent()
            // UtilPub.log("---直接把 scene_day222 挂到主菜单下----",this.SceneNode.layer, item.layer)
        })
    }

    public static initBottomGrids() {
        //88x88
        for (let i = 0; i < Const.MaxRoomX; i++) {
            for (let j = 0; j < Const.MaxRoomY; j++) {
                this.grids.set(i + "," + j, 1)
            }
        }
        this.genBottomGrids(this.grids)
    }

    public static genBottomGrids(grids: Map<string, number>) {
        poolManager.instance.putNodeArr(this.tmpGridsUI)
        UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
            grids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = poolManager.instance.getNode(p, Const.GridParent, true)!
                item.getComponent(grid)!.init(x, y)
                // UtilPub.log("-------日志--", x, -y)
                item.position = UtilScene.getBottomGridPos(x, y)
                this.tmpGridsUI.push(item)
            })
            // item.getComponent()
            // UtilPub.log("---直接把 scene_day222 挂到主菜单下----",this.SceneNode.layer, item.layer)
        })
    }

    /**
     * 初始化场景中的障碍物节点，此时所有的节点都具备了
     */
    public static initAStarObstacles() {
        //初始化街道
        UtilScene.streetEmptyGrids = []
        UtilScene.streetEmptyGridsMap = new Map<string, number>()
        UtilScene.streetObstacles = []
        UtilScene.streetObstaclesMap = new Map<string, number>()
        UtilScene.roomObstacles = []
        UtilScene.roomObstaclesMap = new Map<string, number>()
        UtilScene.roomEmptyGrids = []
        UtilScene.roomEmptyGridsMap = new Map<string, number>()

        let tmp = new Map<string, number>()
        let tmpStreet = new Map<string, number>()
        //初始化街道障碍物，遍历所有item类型的家具，设置
        Const.StreetFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            if (script.type == GSceneItemType.street) {
                for (let i = 0; i < script.itemSize.x; i++) {
                    for (let j = 0; j < script.itemSize.y; j++) {
                        UtilScene.streetObstacles.push(v2(script.curGridPoint.x + i, script.curGridPoint.y + j))
                        UtilScene.streetObstaclesMap.set((script.curGridPoint.x + i) + "," + (script.curGridPoint.y + j), 1)
                    }
                }
            }
        })

        for (let i = 0; i < Const.MaxStreetX; i++) {
            for (let j = 0; j < Const.MaxStreetY; j++) {
                tmpStreet.set(i + "," + j, 1)
            }
        }

        for (let key of UtilScene.streetObstaclesMap.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.streetObstacles.push(v2(x, y))

            if (tmpStreet.get(x + "," + y) != null) {
                tmpStreet.delete(x + "," + y)
            }
        }

        for (let key of tmpStreet.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.streetEmptyGrids.push(v2(x, y))
            UtilScene.streetEmptyGridsMap.set(x + "," + y, 1)
        }


        //初始化房间的障碍物
        Const.AllItems.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            if (script.type == GSceneItemType.item) {
                for (let i = 0; i < script.itemSize.x; i++) {
                    for (let j = 0; j < script.itemSize.y; j++) {
                        // UtilScene.roomObstacles.push(v2( script.curGridPoint.x + i, script.curGridPoint.y + j))
                        UtilScene.roomObstaclesMap.set((script.curGridPoint.x + i) + "," + (script.curGridPoint.y + j), 1)
                    }
                }
            }
        })



        //遍历房间的障碍点
        //房间要单独判断，未解锁的房间都是障碍物
        // for (let i = 0; i < Const.MaxRoomX; i++) {
        //     for (let j = 0; j < Const.MaxRoomY; j++) {
        //         tmp.set(i + "," + j, 1)
        //     }
        // }
        let roomRows = tables.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        roomRows.forEach((row: any) => {
            //房间是否解锁
            if (SceneData.ins.getRoomLockInfoById(row.id) == GSceneRoomState.locked) { //锁定的房间时障碍
                let roomSize = v2(row.x, row.y)
                let roomPoint = v2(row.offset[0], row.offset[1])
                for (let i = 0; i < roomSize.x; i++) {
                    for (let j = 0; j < roomSize.y; j++) {
                        let x = i + roomPoint.x
                        let y = j + roomPoint.y
                        // UtilScene.roomObstacles.push(v2( x, y))
                        UtilScene.roomObstaclesMap.set((x) + "," + (y), 1)
                        // tmp.set((x) + "," + (y), 1)
                        // if (tmp.get(x + "," + y) != null) {
                        //     UtilPub.log("---------剔除房间----",roomSize, roomPoint)
                        //     tmp.delete(x + "," + y)
                        // }
                    }
                }
            } else { //解锁的房间格子是开方的
                let roomSize = v2(row.x, row.y)
                let roomPoint = v2(row.offset[0], row.offset[1])
                for (let i = 0; i < roomSize.x; i++) {
                    for (let j = 0; j < roomSize.y; j++) {
                        let x = i + roomPoint.x
                        let y = j + roomPoint.y
                        // UtilScene.roomObstacles.push(v2( x, y))
                        // UtilPub.log("---------解锁房间----",roomSize, roomPoint)
                        // UtilScene.roomObstaclesMap.set((x) + "," + (y), 1)
                        tmp.set((x) + "," + (y), 1)

                    }
                }
            }
        })

        //遍历所有解锁的房间，然后填充空格子，再挖空处理掉障碍物


        for (let key of UtilScene.roomObstaclesMap.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.roomObstacles.push(v2(x, y))

            if (tmp.get(x + "," + y) != null) {
                tmp.delete(x + "," + y)
            }
        }

        for (let key of tmp.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.roomEmptyGrids.push(v2(x, y))
            UtilScene.roomEmptyGridsMap.set(x + "," + y, 1)
        }

        //debug显示的格子
        // this.grids = UtilScene.roomObstaclesMap
        // this.grids = UtilScene.roomEmptyGridsMap
        // this.genBottomGrids(this.grids)
        // UtilPub.log("$$$------------空地的信息",  UtilScene.roomEmptyGrids)
    }

    /**
     * 获得场景节点脚本
     * @param node 
     */
    public static getSceneNodeScript(node: Node) {
        let script = node.getComponent(node.name)!
        if (script == null) {
            script = node.getComponent(scene_item_parent)!
        }
        if (script == null) {
            UtilPub.error("场景脚本绑定错误，请修改----!!", node.name, node)
        }
        return script as unknown as GISceneItemParent
    }

    /**
     * 给场景节点设置脚本
     * @param node 
     */
    public static setSceneNodeScript(node: Node) {
        if (node.getComponent(node.name) == null) {
            try {
                node.addComponent(node.name)
            } catch (error) {
                // UtilPub.log("-------未设置脚本")
            }
        }
        if (node.getComponent(node.name) == null) {
            node.addComponent(scene_item_parent)
        }
    }

    public static orderAllItems() {
        // UtilPub.log("----触发排序------")
        //获得所有item类型为场景的
        Const.AllItems.sort((a, b) => { //按照x位置排一次
            return UtilScene.getSortVal(a, b)
        })

        Const.AllItems.sort((a, b) => { //按类型排1次
            let a1 = UtilScene.getSceneNodeScript(a)
            let b1 = UtilScene.getSceneNodeScript(b)
            return a1.type - b1.type;
        })

    }

    /**
     * 返回底部的网格坐标
     * @param size 
     * @param curPoint 
     * @returns 
     */
    public static getGridBottomPoint(size: Vec2, curPoint: Vec2) {
        if (curPoint == null) {
            return v2(0, 0)
        }
        let xPlus = 1
        let yPlus = 1
        if (curPoint.x < 0) {
            xPlus = -1
        }
        if (curPoint.y < 0) {
            yPlus = -1
        }
        return v2(curPoint.x + xPlus * size.x / 2, curPoint.y + yPlus * size.y / 2)
    }

    /**
     * 设置排序的值
     */
    public static getSortVal(a: Node, b: Node) {
        let a1 = UtilScene.getSceneNodeScript(a)
        let a1p = UtilScene.getGridBottomPoint(a1.itemSize, a1.curGridPoint)
        let b1 = UtilScene.getSceneNodeScript(b)
        let b1p = UtilScene.getGridBottomPoint(b1.itemSize, b1.curGridPoint)
        // UtilPub.log("1-----", a1.id,a1.itemSize, "---", b1.id, b1.itemSize)
        let s1 = a1.itemSize
        let s2 = b1.itemSize
        //特殊处理
        // if(s1.x==5 && s1.y==2 && s2.x==5 && s2.y==2 ){
        if (s1.x / s1.y >= 2.5 && s2.x / s2.y >= 2.5) {
            // UtilPub.log("2---x--", a1.curGridPoint.x - b1.curGridPoint.x, "--y-", a1.curGridPoint.y - b1.curGridPoint.y)
            if (Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 2 || Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 3 || Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 4) {
                let deltaX = a1.curGridPoint.x - b1.curGridPoint.x
                // UtilPub.log("3xx---x--", deltaX)
                return (Math.abs(a1p.x - deltaX + a1p.y)) - (Math.abs(b1p.x + b1p.y));
            }
        }
        // if(s1.x==2 && s1.y==5 && s2.x==2 && s2.y==5){
        if (s1.y / s1.x >= 2.5 && s2.y / s2.x >= 2.5) {
            // UtilPub.log("2--y---", a1.curGridPoint.x - b1.curGridPoint.x, "--y-", a1.curGridPoint.y - b1.curGridPoint.y)
            if (Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 2 || Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 3 || Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 4) {
                let deltaY = a1.curGridPoint.y - b1.curGridPoint.y
                // UtilPub.log("3yy---y--", deltaY)
                return (Math.abs(a1p.x + a1p.y)) - (Math.abs(b1p.x + b1p.y + deltaY));
            }
        }


        return (Math.abs(a1p.x + a1p.y)) - (Math.abs(b1p.x + b1p.y));
    }

    /**
     * 场景内的排序
     * @node 可以是item父节点，可以是pendant挂件父节点，可以是carpet父节点
     */
    public static orderSceneItemNodeChildren(node: Node) {
        let arr: Node[] = []
        node.children.forEach((item) => {
            arr.push(item)
        })
        node.removeAllChildren()

        arr.sort((a, b) => { //按照x位置排一次
            return UtilScene.getSortVal(a, b)
        })

        arr.forEach((item) => {
            node.addChild(item)
        })
    }

    public static getParentByType(type: GSceneItemType) {
        if (type == GSceneItemType.item) {
            return Const.ItemParent
        } else if (type == GSceneItemType.carpet) {
            return Const.CarpetParent
        } else if (type == GSceneItemType.pendant) {
            return Const.PendantParent
        } else if (type == GSceneItemType.wall) {
            return Const.WallFixedNode
        } else if (type == GSceneItemType.floor) {
            return Const.FloorFixedNode
        }
        return Const.ItemParent
    }

    //旋转超界不让转
    public static isBottomGridOutBorder(realX: number, realY: number, itemSize: Vec2) {
        if (realX >= 0 && realX <= Const.MaxRoomX - itemSize.x && realY <= Const.MaxRoomY - itemSize.y && realY >= 0) {
            return { res: true, offset: v2() }
        } else {
            let offset = v2()
            // UtilPub.log("-------1偏移Y， 偏移X----", realY, Const.MaxRoomY-itemSize.y)
            if (realY > Const.MaxRoomY - itemSize.y) {
                offset.y = realY + itemSize.y - Const.MaxRoomY
            }
            // UtilPub.log("-------2偏移Y， 偏移X----", realX, Const.MaxRoomY-itemSize.x)
            if (realX > Const.MaxRoomX - itemSize.x) {
                offset.x = realX + itemSize.x - Const.MaxRoomX
            }
            return { res: false, offset: offset }
        }
    }

    public static getSceneData(script: GISceneItemParent) {
        return {
            id: script.id, //scene_item 表的id
            pos: script.curGridPoint, //当前的坐标点
            curFace: script.curFace, //当前的朝向，如果朝向超过faceMax，那么就等于faceMax
            lockState: script.lockState, //如果锁定状态，必须是皮肤ID
            curGridPoint: script.curGridPoint, //设定当前点
            type: script.type, //场景的道具类型
            skin: script.skin, //默认皮肤
        }
    }

    // public static isFinishInitRoomLoad:boolean = false //是否完成初始化加载
    /**
     * 获得所有目前场景下的物体位置数据
     */
    public static getAllSceneData() {
        let dataObj: { [key: string]: GSceneItemData } = {}
        Const.ItemParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneItem + script.id] = UtilScene.getSceneData(script)
        })
        Const.WallFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneWall + script.id] = UtilScene.getSceneData(script)
        })
        Const.FloorFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneFloor + script.id] = UtilScene.getSceneData(script)
        })
        Const.CarpetParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneCarpet + script.id] = UtilScene.getSceneData(script)
        })
        Const.PendantParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.scenePendant + script.id] = UtilScene.getSceneData(script)
        })
        return dataObj
    }

    public static initRoomFinishFn() {
        UtilPub.log("-----触发房间加载结束===")
        UtilScene.hideDebugPoint1()
        UtilScene.orderAllItems()
        UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
        //如果是第一次登录保存场景数据
        if (SceneData.ins.isInitSceneData() == false) {
            // SceneData.ins.setSceneItems(UtilScene.getAllSceneData())
            SceneData.ins.setRoomLockInfoById(1001, GSceneRoomState.unlock)
            SceneData.ins.finishInitSceneData()
        }


        Const.SceneNode.getComponent(guest_mgr)!.init()
        Notifications.emit(GD.event.chgGreenStar)



    }

    //设置墙壁的边界
    public static setMaxWall() {
        //获得墙壁最大的格子数
        Const.MaxWallXRight = 24
        Const.MaxWallXLeft = -24
        let rows = tables.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        for (let i = 0; i < rows.length; i++) {
            if (SceneData.ins.getRoomLockInfoById(rows[i].id) == GSceneRoomState.unlock) {
                // UtilPub.log("=-#########====房间是否解锁---",  rows[i].wall, rows[i])
                if (rows[i].wall == 1) {
                    Const.MaxWallXRight += rows[i].x
                } else if (rows[i].wall == -1) {
                    Const.MaxWallXLeft += rows[i].y * rows[i].wall
                }
            }
        }
        UtilScene.initGridsWallData(Const.WallGridParent.getComponent(UITransform)!, Math.abs(Const.MaxWallXLeft), Math.abs(Const.MaxWallXRight))
        // UtilPub.log("=-#########====房间是否解锁---1", Const.MaxWallXRight)
        // UtilPub.log("=-#########====房间是否解锁---2", Const.MaxWallXLeft)
    }

    public static async initRoom() {
        //获得所有解锁的房间一次性初始化
        let rows = tables.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        // UtilPub.log("--@@@--解锁房间---", rows)
        for (let i = 0; i < rows.length; i++) {
            if (SceneData.ins.getRoomLockInfoById(rows[i].id) == GSceneRoomState.unlock) {
                // UtilPub.log("--@@@--解锁房间---", rows[i].id)
                await UtilScene.initRoomById(rows[i].id)
            }
        }
        //初始化设置所有墙壁和地板
        // let floors = tables.ins().getTableValuesByType(Const.Tables.scene_item, "type", GSceneItemType.floor+"")
        // for (let i = 0; i < floors.length; i++) {
        //     UtilPub.log("--@@@--刷新地板---", floors[i].id)
        //     await UtilScene.initFloorById(floors[i].id)
        // }

        // //初始化设置所有墙壁和地板
        // let walls = tables.ins().getTableValuesByType(Const.Tables.scene_item, "type", GSceneItemType.wall+"")
        // for (let i = 0; i < walls.length; i++) {
        //     UtilPub.log("--@@@--刷新墙壁---", walls[i].id)
        //     await UtilScene.initWallById(walls[i].id)
        // }
        // UtilPub.log("--@@@--解锁房间---", Const.AllItems)
        this.initRoomFinishFn()
    }


    /**
     * 获得初始房间的配置
     */
    public static initRoomById(roomId: number) {
        return new Promise<void>((resolve, reject) => {

            //读取第一个房间的数据
            let rows = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "eff", "1", "room", roomId + "")
            //生成对应的预制体
            let idx = 0
            for (let i = 0; i < rows.length; i++) {
                let sceneItemSkin = tables.ins().getTableValueByID(Const.Tables.scene_skin, rows[i].skin)
                // if(rows[i].room!=roomId){
                //     idx++
                //     continue
                // }
                if (rows[i].type == GSceneItemType.item || rows[i].type == GSceneItemType.carpet || rows[i].type == GSceneItemType.pendant) {
                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                        // UtilPub.log("-----s加载资源1---", sceneItemSkin.prefab, rows[i].type)
                        let item = poolManager.instance.getNode(p, UtilScene.getParentByType(rows[i].type)!)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)
                        // item.setSiblingIndex(Math.abs(script.curGridPoint.x) + Math.abs(script.curGridPoint.y))
                        script.initByConfigTable(rows[i])
                        // UtilPub.log("-----寻找云端数据1---", script, SceneData.ins.getSceneItemById(script.id, script.type))
                        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, script.skin)
                        UtilPub.log("-----s加载资源2---", skinData.id, script.skin, skinData.name)

                        if (rows[i].type == GSceneItemType.pendant) {   //如果是挂机
                            item.position = UtilScene.getWallGridPos(script.curGridPoint.x, script.curGridPoint.y)
                        } else {   //如果是道具和地毯
                            item.position = UtilScene.getBottomGridPos(script.curGridPoint.x + Const.OriOffset.x, script.curGridPoint.y + Const.OriOffset.y)
                        }

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()
                        }
                    })

                } else if (rows[i].type == GSceneItemType.floor) {
                    let parent = UtilScene.getParentByType(rows[i].type)!.getChildByName("floor_" + rows[i].id)!
                    poolManager.instance.putNodeArr(parent.children)
                    //设定地毯的图片。
                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                        let item = poolManager.instance.getNode(p, parent)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)
                        script.initByConfigTable(rows[i])
                        // UtilPub.log("-----寻找云端数据2---", script, SceneData.ins.getSceneItemById(script.id, script.type), rows[i])
                        item.position = v3(0, 0, 0)

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()
                            // this.initRoomFinishFn(finishCb)
                        }
                    })

                } else if (rows[i].type == GSceneItemType.wall) {
                    let parent = UtilScene.getParentByType(rows[i].type)!.getChildByName("wall_" + rows[i].id)!
                    poolManager.instance.putNodeArr(parent.children)
                    //TODO 设定墙壁的图片。
                    console.log("-----设定墙壁的图片。-----", sceneItemSkin.prefab)
                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                        let item = poolManager.instance.getNode(p, parent)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)
                        script.initByConfigTable(rows[i])
                        UtilPub.log("-----寻找云端数据3---", script, SceneData.ins.getSceneItemById(script.id, script.type), rows[i])
                        //判断是否解锁了，如果没有解锁，那么显示对应的原始状态图片
                        item.position = v3(0, 0, 0)

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()
                            // this.initRoomFinishFn(finishCb)
                        }
                    })
                }

            }
        })
    }

    public static initFloorById(sceneItemData: any) {
        return new Promise<void>((resolve, reject) => {
            let sceneItemSkin = tables.ins().getTableValueByID(Const.Tables.scene_skin, sceneItemData.skin)
            let parent = UtilScene.getParentByType(sceneItemData.type)!.getChildByName("floor_" + sceneItemData.id)!
            poolManager.instance.putNodeArr(parent.children)
            //设定地毯的图片。
            UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                let item = poolManager.instance.getNode(p, parent)!
                UtilScene.setSceneNodeScript(item)
                let script = UtilScene.getSceneNodeScript(item)
                script.initByConfigTable(sceneItemData)
                // UtilPub.log("-----寻找云端数据2---", script, SceneData.ins.getSceneItemById(script.id, script.type), rows[i])
                item.position = v3(0, 0, 0)
                Const.AllItems.push(item)
                resolve()
            })
        })

    }

    public static initWallById(sceneItemData: any) {
        return new Promise<void>((resolve, reject) => {
            let sceneItemSkin = tables.ins().getTableValueByID(Const.Tables.scene_skin, sceneItemData.skin)
            let parent = UtilScene.getParentByType(sceneItemData.type)!.getChildByName("wall_" + sceneItemData.id)!
            poolManager.instance.putNodeArr(parent.children)
            //设定地毯的图片。
            UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                let item = poolManager.instance.getNode(p, parent)!
                UtilScene.setSceneNodeScript(item)
                let script = UtilScene.getSceneNodeScript(item)
                script.initByConfigTable(sceneItemData)
                // UtilPub.log("-----寻找云端数据2---", script, SceneData.ins.getSceneItemById(script.id, script.type), rows[i])
                item.position = v3(0, 0, 0)
                Const.AllItems.push(item)
                resolve()
            })
        })

    }

    /** 
     * 1 3 和 2 4 是需要转面的，尺寸对调
    */
    public static getItemSize(size: Vec2, curFace: GCurFace): Vec2 {
        if (curFace == GCurFace.face2 || curFace == GCurFace.face4) {
            return v2(size.x, size.y)
        }
        return size
    }

    public static getRealGridPoint(size: Vec2): Vec2 {
        return v2(size.x + Const.OriOffset.x, size.y + Const.OriOffset.y)
    }

    //网格数据检索用
    public static gridData: Map<string, GIGridData> = new Map<string, GIGridData>; //可以是网格点的世界坐标。val是对应网格点 10,0 左下角一个点。
    public static gridWallData: Map<string, GIGridData> = new Map<string, GIGridData>; //墙壁的格点
    //底部的格子
    public static gridIntervalX: number = 40.40
    public static gridIntervalY: number = 23.1
    public static gridOffsetX: number = 40.40
    public static gridOffsetY: number = 23.1

    //侧向的格子
    public static wallGridIntervalX: number = 40.1
    public static wallGridIntervalY: number = 22.7

    //获得墙体坐标位置
    public static getWallGridPos(x: number, y: number) {
        if (x < 0) {
            return v3(x * this.wallGridIntervalX, -y * (this.wallGridIntervalY + 25) + x * (this.wallGridIntervalY + 0.5) + 20, 0)
        } else {
            return v3(x * this.wallGridIntervalX, -y * (this.wallGridIntervalY + 25) - x * (this.wallGridIntervalY + 0.5), 0)
        }
    }

    //获得底部坐标位置
    public static getBottomGridPos(x: number, y: number) {
        return v3(x * this.gridIntervalX - y * this.gridOffsetX, -y * this.gridIntervalY - x * this.gridOffsetY, 0)
    }
    public static getBottomGridPosV2(pos: Vec2) {
        return this.getBottomGridPos(pos.x, pos.y)
    }

    //初始化格子数量
    public static initGridsData(gridUIT: UITransform, leftDown: number, rightDown: number) {
        for (let x = 0; x < rightDown; x++) {
            for (let y = 0; y < leftDown; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getBottomGridPos(x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(x, y)
                })
            }
        }
        // UtilPub.log("-------初始化格子数据，", this.gridData)
    }

    public static initGridsWallData(gridUIT: UITransform, left: number, right: number) {
        for (let x = 0; x < right; x++) {
            for (let y = 0; y < 8; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getWallGridPos(x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridWallData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(x, y)
                })
            }
        }
        for (let x = 1; x < left + 1; x++) {
            for (let y = 0; y < 8; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getWallGridPos(-x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridWallData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(-x, y)
                })
            }
        }
        // UtilPub.log("-------初始化墙壁格子数据，", this.gridWallData)
    }

}

