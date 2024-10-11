import { Asset, Node, Vec3, ccenum } from "cc";
import { DataLogicHelper, Rectangle, TResoucesUrl, Vector2 } from "../../Main";
import { CubeEntity } from "../../../../scene/script/entity/CubeEntity";
import { CubesEntity } from "../../../../scene/script/entity/CubesEntity";
import { BorderTopEntity } from "../../../../scene/script/entity/BorderTopEntity";
import { BorderBottomEntity } from "../../../../scene/script/entity/BorderBottomEntity";

export enum EEntityType {
    None,
    Cube,
    Cubes,
    BorderTop,
    BorderBottom,
    CubesUp,
}

/**房间加载的优先级排序 越前越先加载*/
export const CResoucesLoadPriority: EEntityType[] = [
    EEntityType.Cube,
    EEntityType.Cubes,
]


export interface ILogicData {
    dataIndex: number
    index: Vector2

    type: ECubesType
    itemNums: number[]
    isVideoByAdd: boolean

    entity: CubesEntity
    entitys: CubeEntity[]

    pos: Vector2
    borderTop: BorderTopEntity
    borderBottom: BorderBottomEntity

    isBorder: boolean

    unlockIndex: number
    isVideo: boolean

    // 关卡模式需要的
    configId: number
}

export interface ILogicCache {
    maxCardIndex: number
    cacheInitNum: number
    datas: any[]
}

export enum EPropId {
    /**提示 */
    tip = 1,
    /**消除 */
    remove = 2,
    /**洗牌 */
    reset = 3,
    time = 7,
    /**体力 */
    power = 8,
}
ccenum(EPropId)

/**数组索引 缓存量最小 */
export enum ELogicCahce {
    type,
    itemNums,
    isVideoByAdd,
    configId,
    isBorder,
}

export enum ECubesType {
    /**有数据 */
    data,
    /**可解锁 */
    unlock,
    /**临时槽位-锁住 */
    tempLock,
    /**临时槽位-视频解锁 */
    tempVideo,
    /**有数据锁住 */
    dataLock,
}

export enum ECubeCreateAnim {
    scale,
    move,
    none,
}

export interface ILogicReset {
    datas: { id: number, entitys: CubeEntity[] }[]
    removeEntitys: CubeEntity[]
    maxCount: number
    _datas: ILogicData[]
}

export const CCubeSelectOffsetY = 10
export const CCubeOffsetY = 18
export const CCubeYSpace = 18
export const CCubesCount = 10
export const CCubesSize = new Vector2(103, 195)
export const CCubesPadding = new Vector2(37, 55)
export const CCubeEntityUrl = "scene/prefab/entity/CubeEntity"
export const CCubesEntityUrl = "scene/prefab/entity/CubesEntity"
export const CBorderTopEntityUrl = "scene/prefab/entity/BorderTopEntity"
export const CBorderBottomEntityUrl = "scene/prefab/entity/BorderBottomEntity"
export const CCubesUpEntity = "scene/prefab/entity/CubesUpEntity"

