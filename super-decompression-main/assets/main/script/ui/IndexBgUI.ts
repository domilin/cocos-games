import { Color, Sprite } from "cc"
import { ccclass, BaseUI, EUILayer, _ui, EUIState, _gameType } from "../Main"
import { initData } from "../../../app/GameDefine"
import { EGameType } from "../module/define/GameTypeDefine"


@ccclass("IndexBgUI")
export class IndexBgUI extends BaseUI {
	public layerType = EUILayer.Window


	protected onCreate(): void {
		this.addEvent(_ui.EventType.OPEN_BEFORE, (url: string) => {
			if (url != "guide/prefab/GuideFingerUI")
				this.updateView()
		}, this, _ui)

	}

	protected onOpen(): void {
		this.updateView()
	}

	private updateView() {
		let indexUI = _ui.getModule(initData.uiUrl.index)
		if (indexUI.state == EUIState.Load ||
			indexUI.state == EUIState.Open) {
			this.SwitchChildrenCC.index = 1
		}
		else {
			if (_gameType.type == EGameType.level)
				this.SwitchChildrenCC.index = 0
			else
				this.SwitchChildrenCC.index = 1
		}
	}
}
