import { Label } from "cc";
import { ccclass, BaseComponent, winSize, _timer } from "../../main/script/Main";

const videoAllTime = .5

@ccclass("RewardedVideoTemp")
export class RewardedVideoTemp extends BaseComponent {

	private cLabelTime: Label = null!
	public onCloseCallBack: (isEnd: boolean) => void = null!

	onLoad() {
		super.onLoad()
		this.setSize(winSize())
	}

	onEnable() {
		super.onEnable()
		_timer.clearUpdateAddTime(this.uuid + "test")
		this.SwitchChildrenCC.index = 1
	}

	onUpdate() {
		if (this.SwitchChildrenCC.index == 0)
			return
		let curTime = _timer.updateAddTime(this.uuid + "test")
		this.cLabelTime.string = Math.floor(videoAllTime - curTime) +"秒"
		if (curTime >= videoAllTime) {
			this.SwitchChildrenCC.index = 0
		}
	}

	private onClickClose() {
		if (this.onCloseCallBack) {
			if (this.SwitchChildrenCC.index == 0)
				this.onCloseCallBack(true)
			else
				this.onCloseCallBack(false)
		}
	}

}