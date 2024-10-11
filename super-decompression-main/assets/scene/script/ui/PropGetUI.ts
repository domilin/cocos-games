import { EventTouch, Label } from "cc";
import { ccclass, BaseUI, EUILayer, EBlockOnceAdType, SpriteLoaderCC, SwitchSpriteCC, PropHelper, EPlatformType, EBottomAdType, _prop, _main, _language, SwitchChildrenCC, _platform, _config_, _ui } from "../../../main/script/Main";

@ccclass("PropGetUI")
export class PropGetUI extends BaseUI {
	public layerType = EUILayer.Notice
	public blockOnceAdType = EBlockOnceAdType.None

	private cSpriteLoaderCC_title: SpriteLoaderCC = null!
	private cSpriteLoaderCC_tip: SpriteLoaderCC = null!
	private cSpriteLoaderCC_icon: SpriteLoaderCC = null!

	public _openData: PropHelper = null!


	onCreate() {
		switch (_platform.type) {
			case EPlatformType.wx:
				this.bottomAdType = EBottomAdType.Native
				break;
			default:
				this.bottomAdType = EBottomAdType.Banner
				break;
		}
	}

	onOpen() {
		this.updateView()
	}

	private updateView() {
		let id = this._openData.id
		let config = _config_.obj.prop[id]

		this.cSpriteLoaderCC_title.setSpriteFrameUrl(config.ui_img_url[0], true)
		this.cSpriteLoaderCC_tip.setSpriteFrameUrl(config.ui_img_url[1], true)
		this.cSpriteLoaderCC_icon.setSpriteFrameUrl(config.ui_img_url[2], true)
	}

	private onClickVideo() {
		let id = this._openData.id

		_main.showVideo(
			id + "道具",
			() => {
				_ui.tip(_language.get(40001))
				this.closeUI()
				_prop.addProp(this._openData.id)
			},
			false,
			() => {
				_prop.addPropBuyShare(this._openData.id)
				this.updateView()
			}
		)
	}

}
