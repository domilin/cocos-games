import { Asset, AudioClip, Color, Prefab, Size, SpriteFrame, Vec3 } from "cc";
import { CGameData, initData } from "../../../app/GameDefine";
import { EModuleType, BaseModuleEvent, _scene, DataLogicHelper, TResoucesUrl, _ui, _timer, _config_, Vector2, winSize, Rectangle, Sets, Maths, NodeHelper, _platform, MaxBoxCC, _main, _logic, _login, _guide, _audio, _logicLevel, EPlatformType, moduleMgr, _gameType } from "../Main";
import { CBorderBottomEntityUrl, CBorderTopEntityUrl, CCubeEntityUrl, CCubeOffsetY, CCubeYSpace, CCubesCount, CCubesEntityUrl, CCubesPadding, CCubesSize, CCubesUpEntity, ECubeCreateAnim, ECubesType, ELogicCahce, ILogicCache, ILogicData, ILogicReset } from "./define/LogicDefine";
import { Scene } from "../../../scene/script/Scene";
import { IConfigCardItem } from "../../../app/Config";
import { CubeEntity } from "../../../scene/script/entity/CubeEntity";
import { gameTypeModule, EGameType } from "./define/GameTypeDefine";
import { LevelGameType } from "./gameType/LevelGameType";

const v2T = new Vector2()

@moduleMgr.add(EModuleType.logic)
export class LogicModule extends BaseModuleEvent {

    public readonly EventType = {
        MERGE_CHANGE: "MERGE_CHANGE",
        MAX_ID_CHANGE: "MAX_ID_CHANGE",
        MOVE: "MOVE",
        CUBE_FLY_START: "CUBE_FLY_START",
        CUBE_FLY_END: "CUBE_FLY_END",
    }
    public preLoadRes: TResoucesUrl<Asset>[] = []

    public data: DataLogicHelper<ILogicData> = null!

    /**棋牌大小 */
    public size = new Vector2()
    /**整体偏移 */
    public offset = new Vector2()

    /**根据屏幕大小计算的动态缩放 */
    public scaleRatio = 1
    /**屏幕大小缩放后 的真实高宽 */
    public cubeSize = new Size()
    public cubeSizePadding = new Size()
    public cubeYSpace = -1

    private get scene() { return _scene.getCurrent<Scene>() }

    public cacheInitNum = -1
    public maxCardIndex = -1

    private get initNum() { return this.cacheInitNum + this.interval }

    public maxCardNums: number[] = null!
    public maxCardNumsTop: number[] = null!
    public topRemoveIndex = 3

    private interval = 6

    public cardColors: { [configId: number]: { font: Color, icon: Color } } = {}

    public get _level(): LevelGameType { return gameTypeModule.get(EGameType.level) }

    onCreate(): void {
        this.preLoadRes.push(
            { type: Prefab, url: CCubeEntityUrl },
            { type: Prefab, url: CCubesEntityUrl },
            { type: Prefab, url: CBorderBottomEntityUrl },
            { type: Prefab, url: CBorderTopEntityUrl },
            { type: Prefab, url: CCubesUpEntity },
            { type: AudioClip, url: "scene/audio/put" },
        )

        for (let config of _config_.arr.card_item)
            this.preLoadRes.push({ type: SpriteFrame, url: config.icon_url })

        for (let config of _config_.arr.card_item)
            this.cardColors[config.id] = {
                font: Color.fromHEX(new Color(), config.font_color),
                icon: Color.fromHEX(new Color(), config.level_icon_color),
            }
    }

    onLogic(): void {
        _main.preLoadQueue
            .add(complete => _ui.load("scene/prefab/ui/TipUI", complete))
            .add(complete => _audio.load("scene/audio/cuowu", -1, complete))
            .add(complete => _audio.load("scene/audio/hecheng", -1, complete))
            .add(complete => _audio.load("scene/audio/fill", -1, complete))
            .add(complete => _audio.load("scene/audio/open", -1, complete))
            .add(complete => _audio.load("scene/audio/touch", -1, complete))
            .add(complete => _audio.load("scene/audio/homebgm", -1, complete))
            .add(complete => _audio.load("scene/audio/bgm", -1, complete))
            .add(complete => _ui.load("scene/prefab/ui/TipNextUI", complete))

        if (_platform.type == EPlatformType.oppo
            || _platform.type == EPlatformType.vivo) {
            _main.preLoadQueue
                .add(complete => _ui.load("scene/prefab/ui/TipClickUI", complete))
        }

        this.data = new DataLogicHelper<ILogicData>(
            () => ({
                index: new Vector2(),
                dataIndex: -1,
                unlockIndex: -1,
                configId: -1,
                type: ECubesType.data,
                itemNums: [],
                entity: null!,
                entitys: [],
                pos: new Vector2(),
                borderTop: null!,
                borderBottom: null!,
                isVideo: false,
                isVideoByAdd: false,
                isBorder: false,
            }),
            (data) => {
                data.entity = null!
                data.borderTop = null!
                data.borderBottom = null!
                data.itemNums.length = 0
                data.entitys.length = 0
                data.dataIndex = -1
                data.unlockIndex = -1
                data.configId = -1
                data.isVideo = false
                data.isVideoByAdd = false
                data.isBorder = false
            }
        )

        let isOnce = false
        _scene.once(_scene.EventType.CHANG_SUCCESS, () => {

            _timer.once(this, () => {
                if (_gameType.type == EGameType.none)
                    if (_gameType.onceEnter(false))
                        _gameType.type = EGameType.endless
                    else
                        _gameType.type = EGameType.index

                isOnce = true
                _gameType.run(_gameType.type)
            }, 2 / 60)
        })

    }



    public getTopIndex(index = this.maxCardIndex) {
        let topIndex = index
        if (topIndex > this.topRemoveIndex)
            topIndex--
        return topIndex
    }

    /**无限数字转换为配置表id */
    public converNumById(num: number) {
        let gray = 13
        if (num == -1)
            return gray

        let len = _config_.arr.card_item.length - 1

        return (num % len) + 1
    }

    public create(sizes: number[]) {
        this.data.reset()
        this.offset.set()

        let openCount = 5

        this.size.set(sizes)
        if (this.size.x * this.size.y == 0)
            return

        this.createAutoSize()

        // 缓存数据
        let caches: ILogicCache = _guide.newUserComplete ? this.storage.get(this.getCacheKey(), null!) : null!

        if (caches) {
            this.maxCardIndex = caches.maxCardIndex
            this.cacheInitNum = caches.cacheInitNum
        }
        else {
            this.maxCardIndex = 0
            this.cacheInitNum = 1 - this.interval
        }

        let cardNums = this.getCardNums(this.initNum)
        this.maxCardNumsTop = cardNums.tops
        this.maxCardNums = cardNums.nums


        // 视频临时槽
        let isVideo = false

        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                let index = x * this.size.y + y
                let data = this.data.create()
                data.dataIndex = index
                data.index.set(x, y)

                if (index < openCount)
                    data.type = ECubesType.data
                else {
                    if (index < openCount + this.maxCardNumsTop.length - 1) {
                        data.type = ECubesType.dataLock
                        data.unlockIndex = index - openCount
                    }
                    else {
                        if (!isVideo)
                            data.type = ECubesType.tempVideo
                        else
                            data.type = ECubesType.tempLock
                        isVideo = true
                    }
                }

                if (
                    data.type == ECubesType.tempVideo
                    || data.type == ECubesType.tempLock
                ) {
                    data.isVideo = true
                }
                else
                    data.isVideo = false
            }
        }

        let _initNum = this.initNum
        // 新玩家引导
        if (!_guide.newUserComplete) {
            let datas = [
                this.data.datas[0],
                this.data.datas[2],
            ]
            for (let data of datas)
                for (let i = 0; i < 5; i++)
                    data.itemNums.push(_initNum)
        }
        else {

            if (caches && caches.datas) {
                for (let i = 0; i < caches.datas.length; i++) {
                    let cache = caches.datas[i]
                    let data = this.data.datas[i]
                    data.type = cache[ELogicCahce.type]
                    data.itemNums.length = 0
                    data.itemNums.push(...cache[ELogicCahce.itemNums])
                    data.isVideoByAdd = cache[ELogicCahce.isVideoByAdd]
                }
            }
            else {
                // 默认数据
                let curId = this.maxCardNums[this.maxCardIndex]

                for (let data of this.data.datas) {
                    if (data.type == ECubesType.data) {
                        let count = Maths.minToMax(2, 5)
                        for (let i = 0; i < count; i++) {
                            let num = Maths.minToMax(_initNum, curId - 1)
                            data.itemNums.push(num)
                        }
                    }
                }
                this.setCache()
            }
        }
    }

    public createAutoSize() {
        // 动态缩放
        let maxWidth = this.size.x * CCubesSize.x + (this.size.x - 1) * CCubesPadding.x
        let maxHeight = this.size.y * CCubesSize.y + (this.size.y - 1) * CCubesPadding.y

        let winW = winSize().width - 100
        let ratio = maxWidth / winW

        // 横屏 放大
        if (ratio > 1)
            this.scaleRatio = Math.max(.5, 1 / ratio)
        else
            this.scaleRatio = 1
        Vector2.mul(this.cubeSize, CCubesSize, this.scaleRatio)
        Vector2.mul(this.cubeSizePadding, CCubesPadding, this.scaleRatio)
        this.cubeYSpace = CCubeYSpace * this.scaleRatio

        // 屏幕适配居中
        if (_platform.isLongScreen)
            this.offset.y += 80
    }

    private setCache() {
        if (!_gameType.isRun)
            return
        _timer.callLater(this, this._setCache)
    }

    private _setCache(isDatas = true, isCacheDelay = true) {
        if (!_gameType.isRun)
            return
        let datas: any[] = null!
        if (isDatas) {
            datas = []
            for (let data of this.data.datas) {
                let res = []
                res[ELogicCahce.type] = data.type
                res[ELogicCahce.itemNums] = [...data.itemNums]
                res[ELogicCahce.isVideoByAdd] = data.isVideoByAdd
                res[ELogicCahce.configId] = data.configId
                res[ELogicCahce.isBorder] = data.isBorder
                datas.push(res)
            }
        }

        this.storage.set(this.getCacheKey(), <ILogicCache>{
            maxCardIndex: this.maxCardIndex,
            cacheInitNum: this.cacheInitNum,
            datas
        }, isCacheDelay)
    }

    public getCacheKey(level: number = this._level.curLevel) {
        let dataKey = "datas"
        switch (_gameType.type) {
            case EGameType.endless:
                dataKey = "datas"
                break;
            case EGameType.level:
                dataKey = "levelData" + level
                break;
            default:
                break;
        }
        return dataKey
    }

    public getCardNums(initNum: number) {
        // 1 => 5,6,7,9,10
        // 7 => 11,12,13,15,16
        // 递增6

        let interval = 4

        let nums: number[] = []
        let tops: number[] = []
        for (let i = 0; i < this.interval; i++) {
            let v = initNum + interval
            nums.push(v + i)

            if (i != this.topRemoveIndex)
                tops.push(v + i)
        }

        return { nums, tops }
    }

    public getBottomY() {
        if (_platform.isLongScreen)
            return _platform._banner_.worldTopY + 5
        return 0
    }

    public changeType(data: ILogicData, type: ECubesType) {
        let lastType = data.type
        data.type = type
        if (data.type == ECubesType.tempVideo)
            data.isVideoByAdd = false

        data.entity.updateType(lastType)

        this.setCache()
    }

    /**发牌 */
    public adds() {
        // 取消选中
        this.scene.cancleSelect()

        let allCount = 0
        let datas = this.data.datas

        let configs: { num: number, score: number }[] = []
        let curId = this.maxCardNums[this.maxCardIndex] - 1

        let addDatas: { data: ILogicData, sub: number, score: number }[] = []
        for (let data of datas) {
            if (!data.isVideo)
                if (data.type == ECubesType.data) {
                    for (let item of data.itemNums) {
                        if (curId == item)
                            continue
                        let _config = Sets.filterValue(configs, v => v.num == item)
                        if (!_config) {
                            _config = { num: item, score: 0 }
                            configs.push(_config)
                        }
                        _config.score++
                    }

                    let count = CCubesCount - data.itemNums.length
                    if (count == 0)
                        continue
                    allCount += count
                    let { count: count2, index } = this.getBottomData(data)

                    addDatas.push({ data, sub: count, score: count2 + (CCubesCount - index) * 3 })
                }
        }

        // 评分排序
        Sets.sortMax(addDatas, v => v.score)


        for (let num = this.initNum; num < curId; num++) {
            let _config = Sets.filterValue(configs, v => v.num == num)
            if (!_config) {
                _config = { num, score: 3 }
                configs.push(_config)
            }
        }

        // 保证最小的值 分数也有
        for (let config of configs) {
            config.score %= CCubesCount

            // 最小的值权重增加 稀释较大的
            config.score += (curId - config.num) / 2

            config.score += Maths.zeroToMax(5, _gameType.curRandom.run())
        }



        Sets.sortMax(configs, v => v.score)

        if (allCount == 0) {
            console.log("已满")
            return
        }

        let addCount = 0
        if (allCount <= 3)
            addCount = allCount
        else
            addCount = Math.floor(allCount / 2) + 1


        let randomMax = addCount > 3 ? Math.floor(addCount / 2) : (addCount + 1)

        let arr: { num: number, count: number }[] = []
        let subCount = 0
        while (true) {
            for (let config of configs) {
                // 总个数
                let count2 = addCount == 1 ? 1 : Maths.zeroToMax(randomMax, _gameType.curRandom.run())

                if (count2 == 0)
                    continue

                // 分批次段
                let num = addCount == 1 ? 1 : Maths.minToMax(1, 3, true, _gameType.curRandom.run())


                let sub = 0
                for (let i = 0; i < num; i++) {
                    // 加上剩余的
                    if (i == num - 1) {

                        let _count = count2 - sub
                        arr.push({ count: _count, num: config.num })
                    }
                    else {
                        // 随机添加
                        let _count = Maths.minToMax(1, count2, true, _gameType.curRandom.run())
                        arr.push({ count: _count, num: config.num })
                        sub += _count
                        if (sub >= count2) {
                            break
                        }
                    }
                }

                subCount += count2
                if (subCount >= addCount)
                    break
            }
            if (subCount >= addCount)
                break
        }


        let nums: number[] = []
        for (let v of arr)
            for (let i = 0; i < v.count; i++)
                nums.push(v.num)

        nums.length = addCount


        let _datas: { [index: number]: number[] } = {}
        while (true) {
            for (let data of addDatas) {
                let _data = _datas[data.data.dataIndex]
                if (!_data)
                    _data = _datas[data.data.dataIndex] = []

                let max = CCubesCount - data.data.itemNums.length - _data.length

                let count3 = Math.min(max, Maths.zeroToMax(data.sub + 1, _gameType.curRandom.run()))
                let addIds = nums.splice(0, Math.min(nums.length, count3))

                _data.push(...addIds)

                if (nums.length == 0)
                    break
            }

            if (nums.length == 0)
                break
        }

        for (let key in _datas) {
            let addNums = _datas[key]
            let data = datas[Number(key)]

            let len = addNums.length
            for (let i = 0; i < len; i++) {
                this.createCube(data, addNums[i], ECubeCreateAnim.move, i, len)
            }
        }

        for (let data of addDatas)
            this.updateMerge(data.data)

        this.scene.sortCubes()
        this.setCache()
    }

    public addsGuide() {
        let counts = [3, 4, 1]
        for (let i = 0; i < 3; i++) {
            let data = this.data.datas[i]
            let count = counts[i]
            for (let j = 0; j < count; j++)
                this.createCube(data, 2, ECubeCreateAnim.move, j, count)
        }
    }

    public createCube(
        data: ILogicData,
        num: number,
        anim: ECubeCreateAnim,
        animMoveIndex: number,
        animMoveAll: number,
    ) {
        let index = data.itemNums.length
        data.itemNums.push(num)
        let entity = this.scene.entityMgr.createCube(data, index, anim, animMoveIndex, animMoveAll)
        data.entitys.push(entity)
        data.isVideoByAdd = true
        this.setCache()
    }

    public getCubeY(index: number) {
        let all = CCubesCount * this.cubeYSpace
        let y = 0
        y -= all / 2
        y += (CCubesCount - 1 - index) * this.cubeYSpace
        y += CCubeOffsetY * this.scaleRatio
        return y
    }

    public move(orgin: ILogicData, cur: ILogicData) {
        // 满了
        if (cur.itemNums.length == CCubesCount)
            this.shake(cur)
        else {
            // 空白移动
            if (cur.itemNums.length == 0) {
                let { count, index } = this.getBottomData(orgin)
                this._move(orgin, cur, index, count)
            }
            // 移动相同的
            else {
                let pop = Sets.pop(cur.itemNums, false)
                let orginPop = Sets.pop(orgin.itemNums, false)
                if (pop == orginPop) {

                    let { count: allCount, index } = this.getBottomData(orgin)

                    let subCount = CCubesCount - cur.itemNums.length
                    if (allCount > subCount) {

                        let isNo = false
                        // 关卡模式不移动
                        if (_gameType.type == EGameType.level) {
                            // 纯色可移动
                            if (index != 0)
                                isNo = true

                            // 当前也需要纯色
                            if (this.getBottomData(cur).index != 0)
                                isNo = true
                        }

                        if (isNo)
                            this.shake(cur)
                        else {
                            let sub = allCount - subCount
                            index += sub
                            allCount = subCount
                            this._move(orgin, cur, index, allCount)
                        }
                    }
                    else
                        this._move(orgin, cur, index, allCount)
                }
                else
                    this.shake(cur)
            }
        }
        this.updateMerge(cur)
        this.updateMerge(orgin)
        this.setCache()
    }

    private getBottomData(data: ILogicData) {
        let count = 0
        let index = 0
        let len = data.itemNums.length
        let pop = data.itemNums[len - 1]
        for (let i = len - 1; i >= 0; i--) {
            let id = data.itemNums[i]
            if (id == pop)
                count++
            else {
                index = i + 1
                break
            }
        }
        return { index, count }
    }

    private shake(data: ILogicData) {
        _audio.play("scene/audio/cuowu")
        data.entity.shake()
        data.borderTop.shake()
        data.borderBottom.shake()
        for (let v of data.entitys)
            v.shake()
    }

    public setSelect(data: ILogicData, value: boolean) {
        let borderValue = value
        if (!value)
            borderValue = this.hasMerge(data)
        this.setBorder(data, borderValue)

        let { index, count } = this.getBottomData(data)

        let len = data.entitys.length
        for (let i = 0; i < len; i++) {
            let entity = data.entitys[i]
            if (i >= index)
                entity.setSelect(value)
            else
                entity.setSelect(false)
            entity.node.setSiblingIndex(entity.node.parent.children.length - 1)
        }

        data.borderBottom.setSelect2(value)
    }

    public completeGuide() {
        this.storage.set("isGuide", "true")
    }

    public setBorder(data: ILogicData, value: boolean) {
        data.isBorder = value
        data.borderTop.setSelect(value)
        data.borderBottom.setSelect(value)

        data.entity.updateLevel()
    }

    public merge() {
        let isPlayHeCheng = false
        for (let data of this.data.datas) {
            if (this.hasMerge(data)) {
                this.setBorder(data, false)

                for (let entity of data.entitys)
                    entity.remove()

                let num = data.itemNums[0]
                data.entitys.length = 0
                data.itemNums.length = 0

                let nextNum = num + 1
                isPlayHeCheng = true
                _timer.once(this, () => {
                    for (let i = 0; i < 2; i++)
                        this.createCube(data, nextNum, ECubeCreateAnim.scale, -1, -1)


                    let curId = this.maxCardNums[this.maxCardIndex]
                    if (curId <= nextNum) {
                        this.maxCardIndex = this.maxCardIndex + 1

                        if (this.maxCardIndex == this.maxCardNums.length) {
                            // 下个阶段
                            this.maxCardIndex = 0
                            this.cacheInitNum = this.initNum
                            this._setCache(false, false)
                            _gameType.isRun = false
                            _ui.open("scene/prefab/ui/TipNextUI", data, null!, () => {
                                this.emit(this.EventType.MAX_ID_CHANGE)

                                _timer.once(this, () => {
                                    _gameType.run(EGameType.endless)
                                }, .5)
                            })
                        }
                        else {
                            this.emit(this.EventType.MAX_ID_CHANGE)

                            if (this.maxCardIndex == this.topRemoveIndex + 1)
                                return
                            let topIndex = this.getTopIndex()

                            this.scene.tip(this.maxCardNumsTop[topIndex], true)
                            // 增加空格
                            for (let i = 0; i <= topIndex; i++) {
                                let index = 4 + i
                                let _data = this.data.datas[index]
                                if (_data.type == ECubesType.dataLock)
                                    this.changeType(_data, ECubesType.unlock)
                            }
                        }
                    }
                    this.setCache()
                }, .3)
            }
        }

        if (isPlayHeCheng)
            _audio.play("scene/audio/hecheng")
        _timer.callLater(this, this._emitMergeChange)
        this.setCache()
    }


    private _move(orgin: ILogicData, cur: ILogicData, start: number, count: number = -1) {
        if (count == -1)
            count = orgin.itemNums.length

        let removes = orgin.entitys.splice(start, count)
        let removeIds = orgin.itemNums.splice(start, count)

        for (let entity of removes)
            entity.isPlaySound = true

        this._moveAdd(cur, removeIds, removes)


        if (orgin.isVideo)
            if (orgin.itemNums.length == 0)
                this.videoReset()
        this.setCache()

        this.emit(this.EventType.MOVE)
    }

    private videoReset() {
        if (_gameType.type == EGameType.level)
            return
        // 视频槽还原 
        for (let data of this.data.datas)
            if (data.isVideo)
                if (data.isVideoByAdd)
                    if (data.type == ECubesType.data) {
                        this.changeType(data, ECubesType.tempLock)
                        break
                    }
        this.setCache()
    }

    private _moveAdd(data: ILogicData, ids: number[], entitys: CubeEntity[]) {
        let len = ids.length
        for (let i = 0; i < len; i++) {
            let entity = entitys[i]
            data.entitys.push(entity)

            let index = data.itemNums.length
            data.itemNums.push(ids[i])

            entity.setData(data, index, ECubeCreateAnim.move, len - 1 - i, len)
            entity.enterRun(false)

            entity.node.setSiblingIndex(entity.node.parent.children.length - 1)
        }
        data.isVideoByAdd = true
        this.setCache()
    }

    public hasAllMerge() {
        for (let data of this.data.datas)
            if (data.type == ECubesType.data)
                if (this.hasMerge(data))
                    return true
        return false
    }

    public resetAfger() {
        let res: ILogicReset = {
            datas: [],
            removeEntitys: [],
            maxCount: 0,
            _datas: [],
        }

        for (let data of this.data.datas)
            if (data.type == ECubesType.data) {
                res.maxCount++
                for (let i = 0; i < data.itemNums.length; i++) {
                    let id = data.itemNums[i]
                    let entity = data.entitys[i]

                    let _datas = Sets.filterValue(res.datas, v => v.id == id)
                    if (!_datas) {
                        _datas = { id, entitys: [] }
                        res.datas.push(_datas)
                    }

                    if (_datas.entitys.length < CCubesCount)
                        _datas.entitys.push(entity)
                    // 删除
                    else
                        res.removeEntitys.push(entity)
                }
                res._datas.push(data)

            }

        return res
    }

    public reset(res: ILogicReset) {
        for (let v of res._datas) {
            v.itemNums.length = 0
            v.entitys.length = 0
        }

        // 顺序排列
        Sets.sortMin(res.datas, v => v.id)

        // 超出的阶段
        if (res.maxCount < res.datas.length) {
            let entites = res.datas.splice(0, res.datas.length - res.maxCount)
            for (let entity of entites) {
                for (let v of entity.entitys)
                    this.scene.entityMgr.remove(v)
            }
        }

        for (let entity of res.removeEntitys)
            this.scene.entityMgr.remove(entity)

        for (let data of this.data.datas)
            if (data.type == ECubesType.data) {
                let _data = res.datas.shift()
                if (!_data)
                    break
                this._moveAdd(data, _data.entitys.map(v => _data.id), _data.entitys)
                this.updateMerge(data)
            }
            else {
                this.setBorder(data, false)
            }

        this.videoReset()
        this.setCache()
    }

    public updateMerge(data: ILogicData) {
        if (this.hasMerge(data))
            this.setBorder(data, true)
        else
            this.setBorder(data, false)

        _timer.callLater(this, this._emitMergeChange)
    }

    private _emitMergeChange() {
        this.emit(this.EventType.MERGE_CHANGE)
    }

    public hasMerge(data: ILogicData): boolean {
        if (data.itemNums.length != CCubesCount)
            return false
        let one = data.itemNums[0]
        for (let v of data.itemNums)
            if (v != one)
                return false
        return true
    }

    public getCubePos(data: ILogicData, index: number) {
        let pos = data.entity.node.position
        v2T.x = pos.x
        v2T.y = pos.y + this.getCubeY(index)
        return v2T
    }

}