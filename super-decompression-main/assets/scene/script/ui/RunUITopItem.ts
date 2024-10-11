import { Node, Sprite, SpriteFrame } from "cc";
import { ccclass, BaseComponent, _logic, _resouces, _config_, AnimtorByTweenCC } from "../../../main/script/Main";
import { CubeItem } from "../CubeItem";


@ccclass("RunUITopItem")
export class RunUITopItem extends BaseComponent {

	private cALight: Node = null!
	private cALightTop: Node = null!
	private cAnimtorByTweenCC_icon: AnimtorByTweenCC = null!

	private get item() { return this.getCacheComponent(CubeItem) }

	public init(index: number, topIndex: number) {

		if (topIndex > index) {
			this.cAnimtorByTweenCC_icon.stop()
			this.SwitchChildrenCC.index = 0
		}
		else {
			this.SwitchChildrenCC.index = 1
			let num = _logic.maxCardNumsTop[index]
			if (topIndex == index) {
				this.cAnimtorByTweenCC_icon.play()
				this.item.init(num, false)
			}
			else {
				this.item.init(num, true)
				this.cAnimtorByTweenCC_icon.stop()
			}

			if (index == _logic.maxCardNumsTop.length - 1) {
				this.cALight.active = true
				this.cALightTop.active = true
			}
			else {
				this.cALight.active = false
				this.cALightTop.active = false
			}
		}

	}

}
