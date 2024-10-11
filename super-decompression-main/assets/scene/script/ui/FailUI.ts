import { Node } from "cc";
import { ccclass, BaseUI, EUILayer, EBlockOnceAdType, EPlatformType, EBottomAdType, NodeHelper, Times, _main, _language, SpriteLoaderCC, _platform, _audio, _ui, _gameType } from "../../../main/script/Main";
import { ToDayMaxRecode } from "../../../main/script/ui/ToDayMaxRecode";
import { EGameType } from "../../../main/script/module/define/GameTypeDefine";


const tipName = [
	"sffh",
	"test2222",
]

@ccclass("FailUI")
export class FailUI extends BaseUI {
	public layerType = EUILayer.Notice
	public blockOnceAdType = EBlockOnceAdType.None

	private cSpriteLoaderCC_tip: SpriteLoaderCC = null!
	private cBtns: Node = null!
	private cNativeHight: Node = null!

	protected openByAudioUrls = [
		"scene/audio/fail",
	]

	private openTime = -1
	protected get toDayMaxRecode() { return this.getCacheComponent("ToDayMaxRecode") as ToDayMaxRecode }

	protected onCreate(): void {
		switch (_platform.type) {
			case EPlatformType.vivo:
				this.bottomAdType = EBottomAdType.Native
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

		if (_platform.type == EPlatformType.oppo)
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

		_audio.play(this.audioUrls[0])
		this.openTime = Times.second()

		this.cSpriteLoaderCC_tip.setSpriteFrameUrl("scene/texture/end/" + tipName[1])


		if (_platform.type == EPlatformType.overseas_kwai)
			_platform._interstitial_.show()
	}


	private onClickIndex() {
		this.closeUI()
		_gameType.exit()

		if (_platform.type == EPlatformType.oppo)
			_platform._nativeTemp_.hideRoot()
	}


}
