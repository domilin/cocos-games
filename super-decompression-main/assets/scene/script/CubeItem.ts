import { Color, Node, SpriteFrame, Vec3 } from "cc";
import { ccclass, BaseComponent, _prop, _language, _main, property, _config_, _scene, _ui, _resouces, _logic } from "../../main/script/Main";




const w = 120

const colorT = new Color()
const v3T = new Vec3()

@ccclass("CubeItem")
export class CubeItem extends BaseComponent {

	public init(num: number, gray: boolean, showNum = true) {
		let id = _logic.converNumById(gray ? -1 : num)
		let config = _config_.obj.card_item[id]
		this.Sprite.spriteFrame = _resouces.get(config.icon_url, SpriteFrame)

		if (showNum) {
			this.FontCC.node.active = true

			this.FontCC.string = num + ""
			this.FontCC.color = _logic.cardColors[id].font

			let allW = this.FontCC.UITransform.width

			let scale = w / allW
			if (scale > 1)
				scale = 1

			scale *= .5

			v3T.x = scale
			v3T.y = scale * .8
			v3T.z = 1
			this.FontCC.setScale(v3T, false)
		}
		else {
			this.FontCC.node.active = false
		}
	}

}
