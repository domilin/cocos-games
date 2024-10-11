import { Asset } from "cc"
import { BaseInstanceStorage, BaseModule, IBaseModule, ModuleMgr, RandomSeed, TResoucesUrl } from "../../Main"



export enum EGameType {
    none,
    index,
   /**闯关 */
   level,

   /**挑战 无尽模式 */
   endless,
}

export const gameTypeModule = new ModuleMgr<EGameType>()
export const gameTypeLogicModule = new ModuleMgr<EGameType>()

/**游戏模式的实现 */
export interface IGameTypeLogic extends IBaseModule {
    /**进入时 需要预加载的资源 */
    preLoadRes?(res: TResoucesUrl<Asset>[]): void,
    /**开始 */
    run(...param: any[]): void
    /**进入下一关时 接着调用run */
    next?(): void
    /**游戏中 每秒校验成功或失败 */
    checkComplete?(): void
    /**setting界面点击退出 */
    settingExit?(): void
    reset?(): void

    beforeRun?(): void
    hasRun?(): boolean
}
