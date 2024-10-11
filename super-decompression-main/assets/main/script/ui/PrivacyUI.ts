import { Label } from "cc"
import { ccclass, BaseUI, EUILayer, _privacy, _ui, _platform } from "../Main"



@ccclass("PrivacyUI")
export class PrivacyUI extends BaseUI {
	public layerType = EUILayer.Notice

	private cLabel_dec: Label = null!

	public _openData: () => void = null!

	protected onCreate(): void {
		this.cLabel_dec.string = "欢迎您使用《" + apeng.initData.gameName + "》，我们将严格遵守相关法律法规和隐私政策以保护您的个人信息。"
	}

	private onClickConfirm() {
		this.closeUI()
		this._openData()
	}

	private onClickCancel() {

		_ui.dialogue(
			"不同意协议将无法进入游戏，请确定操作",
			{
				text: "退出",
				onClick: () => {
					_platform.instance.killGame()
				},
			},
			{
				text: "同意",
				color: "darkBlue",
				onClick: () => {
					this.onClickConfirm()
				},
			},
		)
	}

	private onClickAUser() {
		_privacy.openUserUI()
	}


	private onClickAPrivacy() {
		_privacy.openDecUI()
	}


}
