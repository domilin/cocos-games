import { Asset, Color, EventTouch, Prefab, Size, SpriteFrame, Vec2, Vec3 } from "cc";
import { CGameData, initData } from "../../../app/GameDefine";
import { EModuleType, BaseModuleEvent, _scene, DataLogicHelper, TResoucesUrl, _ui, _timer, _config_, Vector2, winSize, Rectangle, Sets, Maths, NodeHelper, _platform, MaxBoxCC, _main, _logic, _login, BaseHollow, EventHandlerCC, IVector2, RectHollow, _guide, EUIState, moduleMgr, _gameType } from "../Main";
import { Scene } from "../../../scene/script/Scene";
import { CCubesCount, ECubesType, ELogicCahce, ILogicCache, ILogicData } from "./define/LogicDefine";
import { EGameType } from "./define/GameTypeDefine";


const v2T = new Vector2()

@moduleMgr.add(EModuleType.logicLevel)
export class LogicLevelModule extends BaseModuleEvent {

    private get scene() { return _scene.getCurrent<Scene>() }

    onLogic(): void {

        _logic.on(_logic.EventType.MOVE, () => {
            if (_gameType.type == EGameType.level) {
                if (this.dataCompleteAll()) {
                    this.storage.set("hasComplete" + _logic._level.curLevel, "true")
                    _ui.open("scene/prefab/ui/TipNextUI", null!, null!, () => {
                        _gameType._runComplete.run(true)
                    })
                }
            }
        })

        _timer.loop(this, this.onLoop, 1, -1, -1)
    }

    private onLoop() {
        if (_gameType.type == EGameType.level) {
            if (_gameType.isRun) {
                let level = _logic._level.curLevel
                if (this.hasComplete(level))
                    return
                let state = _ui.getModule(CGameData.SettingUrl).state
                if (!(state == EUIState.Open
                    || state == EUIState.Load))
                    state = _ui.getModule(CGameData.PropGetUrl).state
                if (!(state == EUIState.Open
                    || state == EUIState.Load)) {
                    // 累加时间
                    this.storage.set("levelSuccessTime" + level, this.getSuccessTime(level) + 1)
                }
            }
        }
    }

    public hasComplete(level: number) {
        return this.storage.get("hasComplete" + level, "false") != "false"
    }

    public getSuccessTime(level: number): number {
        return this.storage.get("levelSuccessTime" + level, 0)
    }

    public dataComplete(data: ILogicData) {
        // if (data.configId && data.configId > 0)
        if (data.itemNums.length == CCubesCount) {
            let id = data.itemNums[0]
            for (let v of data.itemNums)
                if (v != id)
                    return false
            return true
        }
        return false
    }

    public dataCompleteAll() {
        for (let data of _logic.data.datas)
            if (data.type == ECubesType.data && data.itemNums.length > 0)
                if (!this.dataComplete(data))
                    return false

        return true
    }


    public create(level: number = _logic._level.curLevel) {
        _logic.data.reset()
        _logic.offset.set()

        let config = _config_.obj.level_item[_logic._level.level.getConverLevel(level)]

        let size = _logic.size

        size.set(config.size)

        _logic.createAutoSize()

        let videoCount = config.video_count

        let nullCount = videoCount + 1

        let caches: ILogicCache = _logic.storage.get(_logic.getCacheKey(), null!)

        let _configNums: number[] = null!
        let configs: number[] = null!
        let startIndex = -1
        let endIndex = -1

        if (!caches) {


            // 1 + 中心区域videoCount个视频槽
            let all = size.x * size.y

            let center = Math.floor(all / 2)
            let r = Math.floor(nullCount / 2)
            startIndex = center - r
            endIndex = center + (nullCount - r)

            // configs = [
            //     7, 7, 7, 7, 7, 7,
            //     2, 2, 2, 2, 2, 2,
            //     3, n, v, v, v, 3,
            //     4, 5, 5, 5, 5, 4,
            //     6, 6, 6, 6, 6, 6,
            // ]
            configs = []
            for (let i = 0; i < config.crad_id.length; i++) {
                let id = config.crad_id[i]
                let c = config.crad_count[i]
                for (let j = 0; j < c; j++)
                    configs.push(id)
            }

            if (false && level == 1) {
                // 第一关指定个数 
                _configNums = []
                for (let i = 0; i < CCubesCount; i++) {
                    if (i < 3)
                        _configNums.push(configs[0])
                    else
                        _configNums.push(configs[1])
                }

                for (let i = 0; i < CCubesCount; i++) {
                    if (i < 3)
                        _configNums.push(configs[1])
                    else
                        _configNums.push(configs[0])
                }
            }
            else {
                if (config.card_random == 1)
                    Sets.shuffle(configs, true, () => _gameType.curRandom.run())

                let configNums: number[][] = []
                for (let config of configs) {

                    let ids: number[] = []
                    for (let i = 0; i < CCubesCount; i++)
                        ids.push(config)

                    while (true) {
                        let c = Maths.minToMax(1, 4, true, _gameType.curRandom.run())
                        configNums.push(ids.splice(0, c))
                        if (ids.length == 0)
                            break
                    }

                }

                Sets.shuffle(configNums, true, () => _gameType.curRandom.run())

                _configNums = []
                for (let v of configNums)
                    for (let _v of v)
                        _configNums.push(_v)
            }


        }


        let configIndex = -1

        let i = -1
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                let index = x * size.y + y
                let data = _logic.data.create()
                data.dataIndex = index
                data.index.set(x, y)

                if (!caches) {
                    if (index >= startIndex && index < endIndex) {
                        if (index == startIndex)
                            data.type = ECubesType.data
                        else
                            data.type = ECubesType.tempVideo
                    }
                    else {
                        i++
                        data.type = ECubesType.data
                        data.configId = configs[i]

                        for (let j = 0; j < CCubesCount; j++) {
                            configIndex++
                            data.itemNums.push(_configNums[configIndex])
                        }
                    }
                }
                else {
                    let cache = caches.datas[index]
                    data.type = cache[ELogicCahce.type]
                    data.configId = cache[ELogicCahce.configId]
                    data.isBorder = cache[ELogicCahce.isBorder]
                    data.itemNums.push(...cache[ELogicCahce.itemNums])
                }
            }
        }


    }

}