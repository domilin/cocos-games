import { Color, EventMouse, EventTouch, Label, Node, Sprite } from "cc";
import { ccclass, EBlockOnceAdType, EPlatformType, EBottomAdType, NodeHelper, PropHelper, _language, EUIState, _platform, _audio, _timer, _ui, _logic, _main, CreatePrefabToEditorCC, Maths, AnimtorByTweenCC, _guide, Times, _logicLevel, _gameType } from "../../../main/script/Main";
import { AnimBaseUI } from "../../../main/script/ui/AnimBaseUI";
import { CGameData } from "../../../app/GameDefine";
import { RunUITopItem } from "./RunUITopItem";
import { EGameType } from "../../../main/script/module/define/GameTypeDefine";



@ccclass("RunUI")
export class RunUI extends AnimBaseUI {
	private cLabel_time: Label = null!
	private cLabel_level: Label = null!
	private cBottomBtns: Node = null!
	private cAtime: Node = null!
	private cAstep: Node = null!
	private cLabel_step: Label = null!
	private cABottoms: Node = null!
	private cATop: Node = null!
	private cLabel_level_duration: Label = null!

	private cPause: Node = null!
	public cAdds: Node = null!
	public cMerge: Node = null!
	private cALevel: Node = null!

	public cCreatePrefabToEditorCC_ratio: CreatePrefabToEditorCC = null!
	private cSprite_ratio: Sprite = null!
	private cAnimtorByTweenCC_tip: AnimtorByTweenCC = null!

	onCreate() {
		super.onCreate()
		this.blockOnceAdType = EBlockOnceAdType.None
		if (_platform.isLongScreen) {
			switch (_platform.type) {
				case EPlatformType.wx:
					this.bottomAdType = EBottomAdType.Native
					break
				case EPlatformType.web:
					this.bottomAdType = EBottomAdType.None
					break
				default:
					this.bottomAdType = EBottomAdType.Banner
					break
			}
		}
		else {
			this.bottomAdType = EBottomAdType.None
		}

		NodeHelper.setPositionY(this.cBottomBtns, _logic.getBottomY(), false)

		this.addEvent(PropHelper.EventType.CHANGE, this.onEventStepCount, this, _logic._level.step)
		this.addEvent(_gameType.EventType.PLAY_ANIM, () => {
			_audio.play("scene/audio/magic")
			this.cAnimtorByTweenCC_tip.setOpacity(1)
			this.cAnimtorByTweenCC_tip.play()
		}, this, _gameType)
		this.addEvent(_logic.EventType.MERGE_CHANGE, this.onEventMeger, this, _logic)
		this.addEvent(_logic.EventType.MAX_ID_CHANGE, this.updateRatio, this, _logic)
	}

	onOpen() {
		super.onOpen()
		_timer.clear(this, this.onLoopDownCount)
		switch (_gameType.type) {
			case EGameType.level:
				this.cATop.active = false
				this.cABottoms.active = false
				this.cALevel.active = true
				this.cAtime.active = false
				this.onEventLevel()
				this.playAnim(true)
				this.cAstep.active = false
				this.onEventStepCount()
				_timer.loop(this, this.onLoopDownCount, 1, -1, -1)
				break;
			case EGameType.endless:
				this.cATop.active = true
				this.cABottoms.active = true
				this.cALevel.active = false
				this.cAtime.active = false
				this.cAstep.active = false
				this.playAnim(true, () => {
					this.scene.setCubStartPos(this.cAdds.worldPosition)
					this.scene.setEndPos(
						this.cCreatePrefabToEditorCC_ratio.LayoutCC.getItemPosition(
							_logic.maxCardNumsTop.length - 1,
							true
						)
					)
				})
				this.onEventMeger()

				this.updateRatio()

				break;
		}

		this.cAnimtorByTweenCC_tip.setOpacity(0)

	}


	public updateRatio() {
		if (!_gameType.isRun)
			return
		let topIndex = _logic.getTopIndex()

		this.cSprite_ratio.fillRange = topIndex / (_logic.maxCardNumsTop.length - 1)

		this.cCreatePrefabToEditorCC_ratio.render(_logic.maxCardNumsTop, RunUITopItem, (comp, data, index) => {
			comp.init(index, topIndex)
		})
	}

	private onEventMeger() {
		NodeHelper.setOpacity(this.cMerge, _logic.hasAllMerge() ? 1 : .5)
	}

	private updateLevelTime() {
		this.cLabel_level_duration.string = Times.numMinute(_logicLevel.getSuccessTime(_logic._level.curLevel) * 1000)
	}

	private onEventStepCount() {
		let cur = _logic._level.step.cur
		this.cLabel_step.string = cur + ""
	}
	private onLoopDownCount() {
		let state = _ui.getModule(CGameData.SettingUrl).state
		if (state == EUIState.Open
			|| state == EUIState.Load)
			return
		state = _ui.getModule(CGameData.SuccessUrl).state
		if (state == EUIState.Open
			|| state == EUIState.Load)
			return
		state = _ui.getModule(CGameData.FailUrl).state
		if (state == EUIState.Open
			|| state == EUIState.Load)
			return

		this.updateLevelTime()
	}

	private onEventLevel() {
		switch (_gameType.type) {
			case EGameType.level:
				this.cLabel_level.string = _language.replace(40014, _logic._level.curLevel + "")
				break
		}
	}

	private onClickAdds() {
		if (_guide.newUserComplete || _guide.newUserIndex > _guide.getOnceLastByIndex(2))
			_logic.adds()
		else
			_logic.addsGuide()
	}

	private onClickMerge() {
		_logic.merge()
	}

	public onClickReset() {
		let res = _logic.resetAfger()
		if (res.datas.length == 0) {
			// _ui.tip("无牌")
			return
		}
		_main.showVideo("", () => {
			_logic.reset(res)
		})
	}

	private onClickPause() {
		_ui.open(CGameData.SettingUrl)
	}

	protected onTouchStart(e: EventTouch) {
		if (this.scene)
			this.scene.touchStart(e)
	}

	protected onTouchEnd(e: EventTouch) {
		if (this.scene)
			this.scene.touchEnd(e)
	}

	protected onTouchCancel(e: EventTouch) {
		if (this.scene)
			this.scene.touchCancel(e)
	}

	protected onTouchMove(e: EventTouch) {
		if (this.scene)
			this.scene.touchMove(e)
	}

	protected onMouseWheel(e: EventMouse) {
		if (this.scene)
			this.scene.mouseWheel(e)
	}

}
