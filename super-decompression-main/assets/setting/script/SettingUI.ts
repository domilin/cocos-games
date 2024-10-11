import { game, Game, Label, Node, SpriteFrame, sys, Toggle } from "cc"
import { ccclass, BaseUI, EUILayer, EBlockOnceAdType, EPlatformType, EBottomAdType, _config_, _privacy, SwitchSpriteCC, _platform, _ui, _guide, _audio, _gameType } from "../../main/script/Main"
import { CGameData, initData } from "../../app/GameDefine"
import { ILevelSelectUIData } from "../../scene/script/ui/LevelSelectUI"


@ccclass("SettingUI")
export class SettingUI extends BaseUI {
	public layerType = EUILayer.Panel
	public blockOnceAdType = EBlockOnceAdType.Show

	private cSwitchChildrenCC_music: SwitchSpriteCC = null!
	private cSwitchChildrenCC_sound: SwitchSpriteCC = null!
	private cSwitchChildrenCC_btn: SwitchSpriteCC = null!
	private cBtns: Node = null!
	private cAUser: Node = null!
	private cADec: Node = null!

	protected onCreate(): void {
		switch (_platform.type) {
			case EPlatformType.wx:
				this.bottomAdType = EBottomAdType.Native
				break;
			case EPlatformType.vivo:
				this.bottomAdType = EBottomAdType.Native
				break;
			case EPlatformType.oppo:
				this.bottomAdType = EBottomAdType.Native
				break;
			default:
				this.bottomAdType = EBottomAdType.Banner
				break;
		}
	}

	protected onOpen() {
		this.updateView()
		_guide.closeFinger()

		if (!initData.openPrivacy) {
			this.cAUser.active = false
			this.cADec.active = false
		}
		else {
			this.cAUser.active = true
			this.cADec.active = true
		}


		if (_gameType.isRun)
			this.cSwitchChildrenCC_btn.index = 0
		else
			this.cSwitchChildrenCC_btn.index = 1
	}


	private onClickReset() {
		if (_gameType.hasRun()) {
			this.closeUI()
			_gameType.reset()
		}
	}

	private onClickExit() {
		this.closeUI()
		_gameType.settingExit()
	}

	private onClickAUser() {
		_privacy.openUserUI()
	}


	private onClickADec() {
		_privacy.openDecUI()
	}

	private onClickSwitchChildrenCC_music() {
		if (_audio.getVolume(true) == 1)
			_audio.setVolume(true, 0)
		else
			_audio.setVolume(true, 1)
		this.updateView()
	}

	private onClickSwitchChildrenCC_sound() {
		if (_audio.getVolume(false) == 1)
			_audio.setVolume(false, 0)
		else
			_audio.setVolume(false, 1)
		this.updateView()
	}


	private updateView() {
		if (_audio.getVolume(true) == 1)
			this.cSwitchChildrenCC_music.index = 0
		else
			this.cSwitchChildrenCC_music.index = 1

		if (_audio.getVolume(false) == 1)
			this.cSwitchChildrenCC_sound.index = 0
		else
			this.cSwitchChildrenCC_sound.index = 1

	}


}
