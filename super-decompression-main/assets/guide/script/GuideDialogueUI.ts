import { Node } from "cc"
import { ccclass, BaseUI, EUILayer, NodeHelper, MaxBoxCC, IGuideDialogueUI } from "../../main/script/Main"





@ccclass("GuideDialogueUI")
export class GuideDialogueUI extends BaseUI {
    public layerType = EUILayer.GuideUp

    private cBottom: Node = null!

    public _openData: IGuideDialogueUI = null!

    onCreate() {
        this.AnimtorCC.play("GuideDialogueDefault")
        NodeHelper.setPositionY(this.cBottom, MaxBoxCC.worldYBottom(), true)
    }

    onOpen() {
        this.Label.string = this._openData.dec

        if (this._openData.openAnim)
            this.AnimtorCC.play("GuideDialogueShow")
        else
            this.AnimtorCC.play("GuideDialogueDefault")
    }

    onClick() {
        if (this.AnimtorCC.hasPlayComplete())
            return

        if (this._openData.click)
            this._openData.click()

        let fn = () => {
            this.closeUI()
            this._openData.closeCb()
        }
        if (this._openData.closeAnim)
            this.AnimtorCC.play("GuideDialogueHide", 0, fn)
        else
            fn()
    }

}