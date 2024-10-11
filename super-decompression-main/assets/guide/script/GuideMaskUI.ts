import { Mask, Node, EventTouch, Vec2, Prefab, instantiate, Vec3, Graphics, Label } from "cc"
import { IVector2, Rectangle, ccclass, BaseUI, EUILayer, TweenHelper, Vector2, Sets, NodeHelper, BaseHollow, _ui, CGuideDefine, IGuideMaskUI, _timer } from "../../main/script/Main"


const v2T = new Vec2()

@ccclass("GuideMaskUI")
export class GuideMaskUI extends BaseUI {
    public layerType = EUILayer.GuideUp

    private cMask_hollow: Mask = null!
    private cFingerParent: Node = null!
    private cItemParent: Node = null!
    private cGraphics_outline: Graphics = null!
    private cFinger: Node = null!
    private cAText: Node = null!
    private cLabel_str: Label = null!

    public _openData: IGuideMaskUI = null!

    private hollows: BaseHollow[] = []

    private orginFingerPostion = new Vec3()
    private framFingerPostion = new Vec3()
    private toFingerPostion = new Vec3()

    public get graphics() { return this.cMask_hollow.subComp as Graphics }
    public get outlineGraphics() { return this.cGraphics_outline }

    private get fingerTween() {
        return TweenHelper.getTween(this.cFinger, "move", (tween) => {
            tween
                .set({ worldPosition: this.framFingerPostion, active: true })
                .to(1, { worldPosition: this.toFingerPostion })
                .set({ active: false })
                .delay(1.5)
                .union()
                .repeatForever()

            return { worldPosition: this.orginFingerPostion }
        })
    }

    onCreate() {
        this.orginFingerPostion.set(this.cFinger.worldPosition)
    }

    onOpen() {
        this.onClose()

        if (this._openData.text) {
            _timer.once(this, () => {
                this.cAText.active = true
                this.cLabel_str.string = this._openData.text.str

                NodeHelper.setPositionXY(this.cAText, this._openData.text.worldPos, true)
            }, this._openData.text.delay)
        }

        let drag = this._openData.drag
        if (drag) {
            Vector2.set(this.framFingerPostion, drag.framWorldPosition)
            Vector2.set(this.toFingerPostion, drag.toWorldPosition)
            this.cFinger.active = true
            this.fingerTween.start()
        }
        else {
            this.fingerTween.stop()
            this.cFinger.active = false
        }

        for (let value of this._openData.hollows)
            if (value.delay == -1)
                this.initHowllow(value)
            else
                this.scheduleOnce(() => {
                    this.initHowllow(value)
                }, value.delay)
        this.graphics.fill()
        if (this.outlineGraphics)
            this.outlineGraphics.stroke()
    }

    onClose() {
        this.cAText.active = false

        this.hollows.length = 0

        this.graphics.clear()
        this.graphics.rect(-100000, 10000, 1, 1)
        this.graphics.fill()
        if (this.outlineGraphics) {
            this.outlineGraphics.clear()
            this.outlineGraphics.rect(-100000, 10000, 1, 1)
            this.outlineGraphics.fill()
        }
        this.cItemParent.destroyAllChildren()
        Sets.forEach(this.cFingerParent.children, (node) => _ui.pool.put(node))

        _timer.clearAll(this)
    }

    onUpdate() {
        let dirty = false
        for (let value of this.hollows) {
            if (value.onUpdate)
                value.onUpdate()

            if (value.onUpdate2)
                value.onUpdate2()
            if (!dirty && value.dirty)
                dirty = true
        }

        if (dirty) {
            this.graphics.clear()
            if (this.outlineGraphics)
                this.outlineGraphics.clear()
        }

        for (let value of this.hollows) {
            if (value.isDraw)
                if (dirty && value.draw)
                    value.draw()
            value.dirty = false
        }

        if (dirty) {
            this.graphics.fill()
            if (this.outlineGraphics)
                this.outlineGraphics.stroke()
        }
    }

    private initHowllow(hollow: BaseHollow) {
        this.hollows.push(hollow)
        if (hollow.isFingerAnim) {
            hollow.fingerNode = _ui.pool.get(CGuideDefine.fingerUrl)
            NodeHelper.setPositionX(hollow.fingerNode, -10000, false)
            hollow.fingerNode.active = true
            this.cFingerParent.addChild(hollow.fingerNode)
            NodeHelper.setRotateZ(hollow.fingerNode, hollow.fingerAngle, false)
        }
        hollow.init(this.cItemParent, this.graphics, this.cGraphics_outline)
    }

    protected onClick(e: EventTouch) {
        e.getUILocation(v2T)
        let isIntersection = false
        let isIntersection2 = false
        for (let value of this.hollows)
            if (this._openData.anyTrigger || value.intersection(v2T)) {
                value.onClick(e)
                if (!isIntersection) {
                    if (!isIntersection2) {
                        isIntersection2 = true
                        if (this._openData.clickShapeByCloseUI)
                            this.closeUI()
                    }
                    isIntersection = true
                }
            }



        return false
    }

    protected onTouchStart(e: EventTouch) {
        let drag = this._openData.drag
        if (drag) {
            e.getUILocation(v2T)
            if (drag.startRect.contains(v2T)) {
                drag.touchStart()
                this.fingerTween.stop()
                this.cFinger.active = false
            }
        }
    }


    protected onTouchEnd(e: EventTouch) {
        let drag = this._openData.drag
        if (drag) {
            e.getUILocation(v2T)
            if (!TweenHelper.hasRun(this.cFinger))
                this.fingerTween.start()
        }
    }

}