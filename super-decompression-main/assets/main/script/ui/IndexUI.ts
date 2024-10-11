import { Label } from "cc"
import { ccclass, EUILayer, EBlockOnceAdType, _scene, _platform, EPlatformType, EBottomAdType, _ui, _rank, _logic, _gameType } from "../Main"
import { AnimBaseUI } from "./AnimBaseUI"
import { EGameType } from "../module/define/GameTypeDefine"


@ccclass("IndexUI")
export class IndexUI extends AnimBaseUI {
	public layerType = EUILayer.WindowUp
	public blockOnceAdType = EBlockOnceAdType.Show
	public bottomAdType = EBottomAdType.None

	private onClickADefault() {
		this.clickRun(EGameType.endless)
	}

	private onClickLevel() {
		this.clickRun(EGameType.level)
	}

	private clickRun(type: EGameType) {
		if (_gameType.hasRun(type))
			this.playAnim(false, () => {
				if (!_gameType)
					return
				if (!this.scene) {
					_gameType.type = type
					_ui.Loading.wait(true)
					return
				}

				_gameType.run(type)
			})
	}
}
