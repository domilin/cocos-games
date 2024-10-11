import { Label, Node } from "cc";
import { ccclass, BaseUI, EUILayer, EBlockOnceAdType, EPlatformType, EBottomAdType, NodeHelper, _language, _main, ButtonCC, _platform, ELanguageType, _audio, _ui, Times, _logicLevel, _logic, _gameType } from "../../../main/script/Main";
import { ToDayMaxRecode } from "../../../main/script/ui/ToDayMaxRecode";




@ccclass("SuccessUI")
export class SuccessUI extends BaseUI {
	public layerType = EUILayer.Notice
	public blockOnceAdType = EBlockOnceAdType.Show

	private cAShare: Node = null!
	private cButtonCCNext: ButtonCC = null!
	private cBtns: Node = null!
	private cNativeHight: Node = null!
	private cLabel_time: Label = null!

	protected openByAudioUrls = [
		"scene/audio/success",
	]

	protected onCreate(): void {
		switch (_platform.type) {
			case EPlatformType.vivo:
				if (_platform.isLongScreen)
					this.bottomAdType = EBottomAdType.Banner
				else
					this.bottomAdType = EBottomAdType.None
				break
			case EPlatformType.oppo:
				if (_platform.isLongScreen)
					this.bottomAdType = EBottomAdType.Banner
				else
					this.bottomAdType = EBottomAdType.None
				break
			case EPlatformType.wx:
				this.bottomAdType = EBottomAdType.Native
				break
			default:
				this.bottomAdType = EBottomAdType.Banner
				break
		}
	}

	onOpen() {
		if (_platform.type == EPlatformType.oppo
			|| _platform.type == EPlatformType.vivo
		)
			_platform._nativeTemp_.showRoot()
		else
			if (this.bottomAdType == EBottomAdType.Banner)
				NodeHelper.setPositionY(this.cBtns, _platform._banner_.worldTopY, true)
			else {

			}

		if (this.cNativeHight)
			if (_platform.type == EPlatformType.oppo)
				NodeHelper.setSize(this.cNativeHight, 0, 520)
			else if (_platform.type == EPlatformType.vivo)
				NodeHelper.setSize(this.cNativeHight, 0, 690)

		if (_language.cur == ELanguageType.chinese) {
			if (this.cAShare)
				this.cAShare.active = true
			this.cButtonCCNext.isPlayBreathe = false
		}
		else {
			if (this.cAShare)
				this.cAShare.active = false
			this.cButtonCCNext.isPlayBreathe = true
		}

		_audio.play(this.audioUrls[0])
		this.cButtonCCNext.node.active = true

		if (_platform.type == EPlatformType.overseas_kwai)
			_platform._interstitial_.show()

		this.cLabel_time.string = Times.numMinute(_logicLevel.getSuccessTime(_logic._level.curLevel) * 1000)
	}


	private onClickIndex() {
		this.closeUI()
		_gameType.exit()

		if (_platform.type == EPlatformType.oppo)
			_platform._nativeTemp_.hideRoot()
	}

	private onClickNext() {
		this.closeUI()
		_gameType.next()
	}


	private onClickAShare() {
		_main.showVideo("好友自创通关分享", () => {
			_ui.tip(_language.get(40004))
		}, true)
	}
}
