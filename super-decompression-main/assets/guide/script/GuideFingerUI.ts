import { EventTouch, Vec2 } from "cc"
import { IVector2, Rectangle, ccclass, BaseUI, EUILayer, _guide, _main, IGuideFingerUI } from "../../main/script/Main"


const v2T = new Vec2()


@ccclass("GuideFingerUI")
export class GuideFingerUI extends BaseUI {
    public layerType = EUILayer.GuideUp

    public _openData: IGuideFingerUI = null!


    public onCreate(): void {
        this.addEvent(_main.EventType.TOUCH_UP, (e: EventTouch) => {

            if (this._openData.touchStartCloseUI === undefined || this._openData.touchStartCloseUI)
                this.closeUI()
            if (this._openData.range && this._openData.clickRange) {
                e.getUILocation(v2T)
                if (this._openData.range.contains(v2T))
                    this._openData.clickRange(e)
            }

            if (this._openData.click)
                this._openData.click(e)
            _guide.emit(_guide.EventType.FINGER_CLICK)
        }, this, _main)
    }

    onOpen() {
        this.AnimtorCC.setPositionX(-10000, false)
        let finger = this._openData
        if (finger.delay != undefined && finger.delay >= 0)
            this.scheduleOnce(this.setFingerPosition, finger.delay)
        else
            this.setFingerPosition()
    }

    onClose() {
        this.AnimtorCC.setPositionX(-10000, false)
    }


    private setFingerPosition() {
        let pos = this._openData.position
        if (typeof pos == "function")
            pos = pos()
        this.AnimtorCC.setPositionXY(pos as IVector2, true)
        this.AnimtorCC.setRotateZ(this._openData.angle || 0, false)
    }

}