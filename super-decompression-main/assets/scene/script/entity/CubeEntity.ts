import { Color, geometry, Material, MeshRenderer, Node, Quat, Size, SpriteFrame, Texture2D, Vec3 } from "cc";
import { Vector2, ccclass, Move, Maths, _resouces, _config_, _logic, NodeHelper, EEaseType, Vector3, TweenHelper, ETweenType, _audio, ScaleAnim, _gameType } from "../../../main/script/Main";
import { CCubeOffsetY, CCubesCount, CCubeSelectOffsetY, CCubeYSpace, ECubeCreateAnim, EEntityType, ILogicData } from "../../../main/script/module/define/LogicDefine";
import { Entity } from "./Entity";
import { CubeItem } from "../CubeItem";
import { EGameType } from "../../../main/script/module/define/GameTypeDefine";

const scaleAnim = new Vector3(1.1, 1.1, 1.1)

@ccclass("CubeEntity")
export class CubeEntity extends Entity {

    public entityType = EEntityType.Cube
    public isPut = true
    public isUpdateStateMackine = true
    public isDestroy = false
    public isMoving() {
        return false
    }

    private cAImg: Node = null!
    private cASelect: Node = null!
    private cAScale: Node = null!


    public data: ILogicData = null!
    public index = -1
    private get item() { return this.getCacheComponent(CubeItem) }

    public createAnim = ECubeCreateAnim.move

    private scaleAnim = new ScaleAnim()
    private scaleAnim2 = new ScaleAnim()

    public animMoveIndex = -1
    public animMoveAll = -1
    public isPlaySound = false
    public isSelect = false


    public oncV3 = new Vector3()

    protected onStateEnterLoad(): void {
        super.onStateEnterLoad()
        this.item.init(this.data.itemNums[this.index], false, _gameType.type == EGameType.endless)
        this.scaleAnim.init(this.cAScale)
        this.scaleAnim2.init(this.item.node)

        Vector3.mul(this.oncV3, Vector3.ONE, _logic.scaleRatio)

        this.addEvent(ScaleAnim.EventType.COMPLETE, this.updateBorder, this, this.scaleAnim2)
    }


    protected onStateEnterReset(): void {
        super.onStateEnterReset()
        this.isPlaySound = false
        this.scaleAnim.stop(Vector3.ONE)
        this.scaleAnim2.stop(Vector3.ONE)
        this.setScaleNum(_logic.scaleRatio, false)

        // if (_baseLogic.gameType == EGameType.level)
        //     this.isSelect = _logic.hasMerge(this.data)
        // else
        this.isSelect = false

        TweenHelper.stop(this.item.node, ETweenType.MoveTopDown)
    }

    protected onStateUpdateRun(): void {
        super.onStateUpdateRun()
        this.scaleAnim.onUpdate()
        this.scaleAnim2.onUpdate()
    }


    protected onStateEnterRun(): void {
        super.onStateEnterRun()
        this.enterRun(true)
        this.updateBorder()
        this.scheduleOnceCover(this.updateUpImg, .1)
    }

    private updateUpImg() {
        if (
            this.index == CCubesCount - 1
            && this._move.isPause
            && !this.scaleAnim.isAnim
            && !this.isSelect
        ) {
            this.cAImg.active = true
        }
        else {
            this.cAImg.active = false
        }

        this.updateBorder()
    }


    public updateBorder() {
        if (this.isShake)
            return
        if (
            this.index == CCubesCount - 1
        ) {
            if (this._move.isPause
                && this.data.isBorder
                && !this.isSelect
            )
                this.cASelect.active = true
            else
                this.cASelect.active = false
        }
        else
            this.cASelect.active = false
    }


    public enterRun(resetInitPos: boolean) {
        this.updateUpImg()
        switch (this.createAnim) {
            case ECubeCreateAnim.move:
                if (resetInitPos)
                    this.setPositionXY(this.scene.cubeStartPos, false)

                this.moveCurPos()
                break
            case ECubeCreateAnim.scale:
                this.setPositionXY(_logic.getCubePos(this.data, this.index), false)
                this.scaleAnim.lerpRun(this.oncV3, .2, Vector3.ZERO)
                break
            case ECubeCreateAnim.none:
                this.setPositionXY(_logic.getCubePos(this.data, this.index), false)
                break
        }
    }

    public remove() {
        this.scheduleOnce(() => {
            this.scene.entityMgr.remove(this)
        }, (CCubesCount - 1 - this.index) / CCubesCount * .3)
    }


    /**
     * 移动到当前位置
     */
    public moveCurPos() {
        let speed = 1
        let onceSpeed = speed / this.animMoveAll

        let fn = () => {
            this._move.setRunData(1, data => {
                Vector2.set(data.target, _logic.getCubePos(this.data, this.index))
                data.ease = EEaseType.quadOut
                data.speedMul = 1 + (CCubesCount - 1 - this.animMoveIndex) * onceSpeed
            })


            _logic.emit(_logic.EventType.CUBE_FLY_START)
            this._move.run(() => {
                this.updateUpImg()
                _logic.emit(_logic.EventType.CUBE_FLY_END)
            })
        }

        let all = .1
        let one = all / this.animMoveAll
        if (this.animMoveIndex == 0)
            fn()
        else
            this.scheduleOnceCover(fn, this.animMoveIndex * one)

        let audioDelay = .2 / this.animMoveAll * this.animMoveIndex

        let isPlaySound = this.isPlaySound
        this.isPlaySound = false
        if (isPlaySound)
            this.scheduleOnce(() => {
                _audio.playMore("scene/audio/put")
            }, audioDelay)
    }

    public setData(
        data: ILogicData,
        index: number,
        createAnim: ECubeCreateAnim,
        animMoveIndex: number,
        animMoveAll: number,
    ) {
        this.data = data
        this.index = index
        this.createAnim = createAnim
        this.animMoveIndex = animMoveIndex
        this.animMoveAll = animMoveAll
        this.updateUpImg()
    }

    public setSelect(value: boolean) {
        this.isSelect = value

        this.updateUpImg()

        this.select(value, _logic.getCubePos(this.data, this.index), () => {
            this.updateUpImg()
        })

        if (value) {
            TweenHelper.default(this.item.node, ETweenType.MoveTopDown)
            this.scaleAnim2.lerpRun(scaleAnim, .1, Vector3.ONE)
        }
        else {
            TweenHelper.stop(this.item.node, ETweenType.MoveTopDown)

            if (this.item.getScale(false).x != 1)
                this.scaleAnim2.lerpRun(Vector3.ONE, .1, scaleAnim)
        }
    }

}