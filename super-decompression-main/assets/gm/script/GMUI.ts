import { ccclass, menu, BaseUI, EUILayer, _scene, _ui } from "../../main/script/Main"


@ccclass("GMUI")
@menu("gm/GMUI")
export class GMUI extends BaseUI {
	public layerType = EUILayer.Top

	public onClickBtn() {
		if (!_scene.isProChange)
			_ui.open("gm/prefab/GMDataUI")
	}

}