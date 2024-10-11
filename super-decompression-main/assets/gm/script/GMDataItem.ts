import { Label } from "cc"
import { ccclass, BaseComponent, menu, _ui, IGMData } from "../../main/script/Main"

@ccclass("GMDataItem")
@menu("gm/GMDataItem")
export class GMDataItem extends BaseComponent {

	private cLabelDec: Label = null!

	private data: IGMData = null!


	public init(data: IGMData) {
		this.data = data
		this.cLabelDec.string = data.dec
		this.EditBox.node.active = !!data.inputTip
		if (data.inputTip)
			this.EditBox.placeholder = data.inputTip
	}


	public onClickItem() {
		_ui.close("gm/prefab/GMDataUI")
		this.data.click(this.EditBox.string)
	}

}