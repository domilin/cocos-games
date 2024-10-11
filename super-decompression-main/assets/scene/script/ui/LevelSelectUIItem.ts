import { Label } from "cc";
import { ccclass, BaseComponent, _language, _ui, _gameType, _logic } from "../../../main/script/Main";
import { LevelSelectUI } from "./LevelSelectUI";
import { initData } from "../../../app/GameDefine";
import { EGameType } from "../../../main/script/module/define/GameTypeDefine";




@ccclass("LevelSelectUIItem")
export class LevelSelectUIItem extends BaseComponent {

	private cLabel_level: Label = null!

	public levelId: number = -1
	public ui: LevelSelectUI = null!

	public init(levelId: number, ui: LevelSelectUI) {
		this.levelId = levelId
		this.ui = ui

		this.cLabel_level.string = this.levelId + ""

		let level = ui._openData.level.cur
		if (this.levelId == level) {
			this.ControllerCC.index = 1
		}
		else if (this.levelId < level) {
			this.ControllerCC.index = 2
		}
		else {
			this.ControllerCC.index = 0

		}
		// this.ControllerCC.index = 1
	}

	onClick() {
		switch (this.ControllerCC.index) {
			case 1:
				this.run()
				break
			case 0:
				_ui.tip(_language.get(40002))
				if (initData.isTest)
					this.run()
				break
			case 2:
				this.run()
				break
		}
	}

	private run() {
		if (_gameType.hasRun(EGameType.level))
			_gameType.run(EGameType.level, this.levelId)
	}

}
