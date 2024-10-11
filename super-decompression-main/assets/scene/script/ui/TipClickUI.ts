import { ccclass, BaseUI, EUILayer, _scene, _ui, winSize, TweenHelper, ETweenType, _platform } from "../../../main/script/Main"
import { CubeItem } from "../CubeItem"


@ccclass("TipClickUI")
export class TipClickUI extends BaseUI {
	public layerType = EUILayer.Notice

	public _openData: number = null!

	private get item() { return this.getCacheComponent(CubeItem) }


	protected onOpen(): void {

		this.item.init(this._openData, false)
	
		_platform._nativeTemp_.showRoot()
	}


}