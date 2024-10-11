import { Vec2, Vec3, Camera, Node, EventTouch, EventMouse, rect, Label } from "cc"
import { ccclass, BaseScene, LoadDir, _config_, _guide, EPlatformType, _ui, Polygon, NodeHelper, IVector2, _timer, Maths, _logic, Rectangle, Sets, _main, RectHollow, Vector2, IGuideMaskUIText, BaseHollow, EventHandlerCC, ETweenType, TweenHelper, EUIState, _audio, _logicLevel, EEntityState, _language, _platform, _gameType } from "../../main/script/Main"
import { CGameData, initData } from "../../app/GameDefine"
import { EntityMgr } from "./EntityMgr"
import { CCubesSize, ECubeCreateAnim, ECubesType, ILogicData } from "../../main/script/module/define/LogicDefine"
import { Entity } from "./entity/Entity"
import { CubeEntity } from "./entity/CubeEntity"
import { RunUI } from "./ui/RunUI"
import { EGameType } from "../../main/script/module/define/GameTypeDefine"



const v2T = new Vec2()
const v3T = new Vec3()
const rectT = new Rectangle()

@ccclass("Scene")
export class Scene extends BaseScene {

    public entityMgr = new EntityMgr(this)

    public cContent: Node = null!
    public cCubeParent: Node = null!
    public cCubesParent: Node = null!
    public cCubesUpParent: Node = null!
    public cBorderBottomParent: Node = null!
    public cBorderTopParent: Node = null!
    public cCubsBg: Node = null!
    private cLabel_tip: Label = null!

    public isIndexShow: boolean = true
    public isLoadComplete: boolean = false

    public selectData: ILogicData = null!

    public cubeStartPos = new Vec3()
    public endPos = new Vec3()

    onCreate() {

        TweenHelper.setDefaultData(ETweenType.MoveTopDown, { dis: -17, duration: .5 })

        this.cCubsBg.active = false
        let indexUrl = initData.uiUrl.index
        this.addEvent(_ui.EventType.OPEN, (url: string) => {
            if (url == indexUrl) {
                this.isIndexShow = true
                this.playMusic()
            }
        }, this, _ui)

        this.addEvent(_ui.EventType.CLOSE, (url: string) => {
            if (url == indexUrl) {
                this.isIndexShow = false
                this.playMusic()
            }
        }, this, _ui)

        if (_ui.getModule(indexUrl).state == EUIState.Open) {
            this.isIndexShow = true
            this.playMusic()
        }

        this.updateTip()

    }

    onUpdate() {
        this.entityMgr.updateStateMachine()
    }

    private playMusic() {
        console.log("播放背景音乐", this.isIndexShow)
        // if (this.isIndexShow)
        //     _audio.playMusic("scene/audio/homebgm")
        // else
        _audio.playMusic("scene/audio/bgm")
    }

    public create() {
        this.updateTip()
        let datas = _logic.data.datas
        this._createInit()

        this.isLoadComplete = true

        let len = datas.length
        if (len == 0) {
            this.cCubsBg.active = false
            return
        }


        this.LayoutCC.itemSize.width = _logic.cubeSize.x
        this.LayoutCC.itemSize.height = _logic.cubeSize.height
        this.LayoutCC.spacingX = _logic.cubeSizePadding.x
        this.LayoutCC.spacingY = _logic.cubeSizePadding.y
        this.LayoutCC.verticalGridCount = _logic.size.x
        this.LayoutCC.numItems = _logic.size.x * _logic.size.y

        for (let data of datas) {
            data.pos.set(this.LayoutCC.getItemPosition(data.dataIndex, false, _logic.offset))
            data.borderTop = this.entityMgr.createBorderTop(data)
            data.borderBottom = this.entityMgr.createBorderBottom(data)
            data.entity = this.entityMgr.createCubes(data)

            this.entityMgr.createCubesUp(data)
        }


        this.entityMgr.entites.forEach(v => v.entityStateMackine.change(EEntityState.Reset))
        this.entityMgr.entites.forEach(v => v.entityStateMackine.change(EEntityState.Run))

        if (_gameType.type == EGameType.level)
            this.cCubsBg.active = false
        else {
            this.cCubsBg.active = true
            let layoutSize = this.LayoutCC.UITransform.contentSize

            let w = Math.max(523, layoutSize.width)
            let h = Math.max(695, layoutSize.height)
            NodeHelper.setSize(this.cCubsBg, w, h)

            NodeHelper.setPositionXY(this.cCubsBg, _logic.offset, false)
        }


        // 默认数据
        for (let data of datas)
            if (data.type == ECubesType.data) {
                for (let i = 0; i < data.itemNums.length; i++) {
                    let entity = this.entityMgr.createCube(data, i, ECubeCreateAnim.none, -1, -1)
                    data.entitys.push(entity)
                }

                if (_gameType.type == EGameType.endless)
                    _logic.updateMerge(data)
            }

        if (_gameType.type != EGameType.index)
            this.isIndexShow = false
        else
            this.isIndexShow = true

        if (_gameType.type == EGameType.endless) {

            if (!_guide.newUserComplete) {
                _guide.trigger()

                this.playMusic()
            }
            else {

                this.scheduleOnce(() => {
                    this.tip(_logic.maxCardNumsTop[_logic.getTopIndex()])
                }, .5)
            }
        }
        else {

        }
        this.updateTip()

    }

    private updateTip() {

        if (_gameType.type == EGameType.level) {
            let curLevel = _logic._level.curLevel
            if (_logicLevel.hasComplete(curLevel)) {
                this.cLabel_tip.node.active = true
                NodeHelper.setPositionY(this.cLabel_tip.node, 20, true)
                this.cLabel_tip.string = _language.get(40025)
            }
            else {
                if (false && curLevel == 1) {
                    NodeHelper.setPositionY(this.cLabel_tip.node, 300, true)
                    this.cLabel_tip.node.active = true
                    this.cLabel_tip.string = "*10个相同颜色硬币为一组，并放到对应颜色的凹槽上;" + "\n"
                        + "*颜色相同、空位充足时硬币才能放一起;" + "\n"
                        + "*两凹槽上都只有同一种硬币，可彼此摆放。"
                }
                else {
                    this.cLabel_tip.node.active = false
                }
            }
        }
        else
            this.cLabel_tip.node.active = false
    }


    private _createInit() {
        this.isLoadComplete = false
        this.unscheduleAllCallbacks()
        _timer.clearAll(this)
        // 回收所有的
        this.entityMgr.clear(false)
        _guide.closeFinger()
        this.selectData = null!
    }


    public touchStart(e: EventTouch) {
        _guide.closeFinger()
    }

    public touchEnd(e: EventTouch) {
        if (!this.isLoadComplete)
            return

        if (_gameType.type == EGameType.level) {
            let curLevel = _logic._level.curLevel
            if (_logicLevel.hasComplete(curLevel)) {
                _ui.open("scene/prefab/ui/ResetUI", curLevel)
                return
            }
        }
        let data = this.touchData(e)
        if (!data)
            return

        this._touchEndData(data)
    }

    public _touchEndData(data: ILogicData) {
        _audio.play("scene/audio/touch")
        switch (data.type) {
            case ECubesType.dataLock:
                this.tip(_logic.maxCardNumsTop[data.unlockIndex])
                break
            // 点击解锁
            case ECubesType.unlock:
                _audio.play("scene/audio/open")
                _logic.changeType(data, ECubesType.data)
                break
            case ECubesType.data: {
                if (!this.selectData) {
                    if (data.itemNums.length > 0) {
                        this.selectData = data
                        _logic.setSelect(this.selectData, true)
                    }
                }
                else {
                    _logic.setSelect(this.selectData, false)
                    if (this.selectData != data)
                        _logic.move(this.selectData, data)
                    this.selectData = null!
                }
                break
            }
            case ECubesType.tempVideo:
                _main.showVideo("", () => {
                    _logic.changeType(data, ECubesType.data)

                    if (_gameType.type == EGameType.endless)
                        // 设置其他为视频解锁
                        for (let data of _logic.data.datas) {
                            if (data.type == ECubesType.tempLock) {
                                _logic.changeType(data, ECubesType.tempVideo)
                                break
                            }
                        }
                })
                break
        }
    }

    public cancleSelect() {
        if (this.selectData) {
            _logic.setSelect(this.selectData, false)
            this.selectData = null!
        }
    }

    public tip(id: number, click = false) {

        if (click
            && (_platform.type == EPlatformType.oppo
                || _platform.type == EPlatformType.vivo)
        )
            _ui.open("scene/prefab/ui/TipClickUI", id)
        else
            _ui.open("scene/prefab/ui/TipUI", id, undefined, undefined, false)
    }


    public touchCancel(e: EventTouch) {

    }

    public touchMove(e: EventTouch) {

    }


    public mouseWheel(e: EventMouse) {

    }

    private touchData(e: EventTouch) {
        e.getUILocation(v2T)
        NodeHelper.convertToNodeSpaceAR(v3T, this.cContent, v2T)
        return this.pointInData(v3T)
    }


    private pointInData(point: IVector2) {
        for (let data of _logic.data.datas) {
            if (!data)
                continue
            if (!data.entity)
                continue

            this.LayoutCC.getItemRectange(rectT, data.dataIndex, false, _logic.offset)
            if (rectT.contains(point))
                return data
        }
        return null!
    }

    public setCubStartPos(pos: Vec3) {
        NodeHelper.convertToNodeSpaceAR(this.cubeStartPos, this.cCubeParent, pos)
    }

    public setEndPos(pos: Vec3) {
        this.endPos.set(pos)
    }

    public sortCubes() {
        // y轴排序
        NodeHelper.zIndexSort(
            this.cCubeParent.children,
            node => {
                let entity = node.getComponent("CubeEntity")! as CubeEntity
                let pos = _logic.getCubePos(entity.data, entity.index)

                return -pos.y + entity.data.index.y * 10000
            }
        )
    }

}

