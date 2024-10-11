import { EventTouch, EventMouse } from "cc"
import { ccclass, BaseUI, MoveCC, _scene, LoadDir } from "../Main"
import { Scene } from "../../../scene/script/Scene"


@ccclass("AnimBaseUI")
export class AnimBaseUI extends BaseUI {
	private enterMoveccs: apeng.MoveCC[] = []
	private exitMoveccs: apeng.MoveCC[] = []

	protected get scene() { return _scene.getCurrent<Scene>() }

	protected onCreate(): void {
		let moveccs = this.getComponentsInChildren(MoveCC)!

		for (let v of moveccs)
			if (v.tag == "enter")
				this.enterMoveccs.push(v)
			else
				this.exitMoveccs.push(v)
	}

	protected onOpen(): void {
		for (let v of this.exitMoveccs)
			v.resetPos()
	}

	protected onClose(): void {

	}

	protected playAnim(enter: boolean, complete?: () => void) {
		let moves = enter ? this.enterMoveccs : this.exitMoveccs
		if (moves.length == 0) {
			if (complete)
				complete()
			return
		}
		let dir = new LoadDir(moves.length, complete || (() => { }))
		for (let v of moves)
			v.startMove(dir.subCount())
	}

	protected playAnimByResetPos(enter: boolean) {
		let moves = enter ? this.enterMoveccs : this.exitMoveccs
		for (let v of moves)
			v.resetPos()
	}



	protected onTouchStart(e: EventTouch) {
		if (this.scene)
			this.scene.touchStart(e)
	}

	protected onTouchEnd(e: EventTouch) {
		if (this.scene)
			this.scene.touchEnd(e)
	}

	protected onTouchCancel(e: EventTouch) {
		if (this.scene)
			this.scene.touchCancel(e)
	}

	protected onTouchMove(e: EventTouch) {
		if (this.scene)
			this.scene.touchMove(e)
	}

	protected onMouseWheel(e: EventMouse) {
		if (this.scene)
			this.scene.mouseWheel(e)
	}
}
