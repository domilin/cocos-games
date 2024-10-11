
import { sys, _decorator, Component, Sprite, Label, lerp, assetManager } from "cc";
import { EDITOR } from "cc/env";
import { initData } from "./GameDefine";


// 加载主包
let isEnter = false;
(function () {
    if (EDITOR)
        return
    if (isEnter)
        return
    isEnter = true

    let _wx = (window as any)["wx"]
    if (_wx && _wx.startRenderDestroy)
        _wx.startRenderDestroy()

    console.log("load bundle main " + Date.now())
    assetManager.loadBundle("main2")
})();


// cc启动脚本
const { ccclass, property, menu } = _decorator;

@ccclass("App")
@menu("App")
export class App extends Component {

    private spriteRatio: Sprite = null!
    private ratio = 0

    __preload() {
        let loading = this.node.getChildByName("Loading")!
        let ratio = loading.getChildByName("Ratio")!

        ratio.getChildByName("TopText")!.active = initData.showLoadingText

        let dec = loading.getChildByName("BottomDec")!
        if (initData.versionId && initData.showLoadingText) {
            dec.active = true
            dec.getComponentInChildren(Label)!.string = initData.versionId
        }
        else {
            dec.active = false
        }

        loading.getChildByName("Age")!.active = initData.showLoadingText

        this.spriteRatio = ratio.getChildByName("Bg")!.getComponentInChildren(Sprite)!

        this.updateRatio()
    }

    private updateRatio() {
        this.spriteRatio.fillRange = this.ratio
    }

    protected update(dt: number): void {
        // 2秒
        this.ratio = lerp(this.ratio, 1, .005)
        this.updateRatio()
    }

}

