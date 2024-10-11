
import { ccclass, menu, BaseUI, EUILayer, _gm } from "../../main/script/Main"
import { GMDataItem } from "./GMDataItem"


@ccclass("GMDataUI")
@menu("gm/GMDataUI")
export class GMDataUI extends BaseUI {
	public layerType = EUILayer.Top


	onOpen() {
		this.ListCC.render(_gm.getDatas(), GMDataItem, (comp, data) => {
			comp.init(data)
		})
	}

}