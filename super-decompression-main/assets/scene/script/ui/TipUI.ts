import { ccclass, BaseUI, EUILayer, _scene, _ui, winSize, TweenHelper, ETweenType } from "../../../main/script/Main"
import { CubeItem } from "../CubeItem"


@ccclass("TipUI")
export class TipUI extends BaseUI {
	public layerType = EUILayer.Notice

	public _openData: number = null!

	private get item() { return this.getCacheComponent(CubeItem) }


	protected onOpen(): void {

		let offsetY = winSize().height / 2 - 300
		TweenHelper.setDefaultData(ETweenType.TipShowTop, offsetY)
		this.item.init(this._openData, false)
		this.AnimtorByTweenCC.play(() => {
			this.closeUI()
		})
	}


}