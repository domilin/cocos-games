import { Label, Node } from "cc";
import { ccclass, BaseUI, EUILayer, EBlockOnceAdType, EPlatformType, EBottomAdType, NodeHelper, _language, _main, ButtonCC, _platform, ELanguageType, _audio, _ui, Times, _logicLevel, _gameType } from "../../../main/script/Main";




@ccclass("ResetUI")
export class ResetUI extends BaseUI {
	public layerType = EUILayer.Panel
	public blockOnceAdType = EBlockOnceAdType.Show

	private cLabel_time: Label = null!

	public _openData: number = null!

	protected onCreate(): void {
		switch (_platform.type) {
			case EPlatformType.vivo:
				this.bottomAdType = EBottomAdType.Native
				break
			default:
				this.bottomAdType = EBottomAdType.Banner
				break
		}
	}

	onOpen() {
		this.cLabel_time.string = Times.numMinute(_logicLevel.getSuccessTime(this._openData) * 1000)
	}


	private onClickBtn() {
		this.closeUI()
		_gameType.reset()
	}

}
