import { EventTouch } from "cc"
import { IVector2, ccclass, BaseUI, EUILayer, IGuideClickUI } from "../../main/script/Main"




@ccclass("GuideClickUI")
export class GuideClickUI extends BaseUI {
    public layerType = EUILayer.GuideUp

    public _openData: IGuideClickUI = null!

    onOpen() {
        this.DragonBonesCC.setPositionX(-10000, false)
        let finger = this._openData.finger
        if (finger) {
            if (finger.delay != undefined && finger.delay >= 0)
                this.scheduleOnce(this.setFingerPosition, finger.delay)
            else
                this.setFingerPosition()
        }
        else
            this.onClose()
    }

    onClose() {
        this.DragonBonesCC.setPositionX(-10000, false)
        this.DragonBonesCC.node.active = false
    }

    onClick(e: EventTouch) {
        this.closeUI()
        this._openData.click(e)
    }

    private setFingerPosition() {
        let pos = this._openData.finger?.position
        if (typeof pos == "function")
            pos = pos()
        this.DragonBonesCC.setPositionXY(pos as IVector2, true)
        this.DragonBonesCC.node.active = true
    }

}