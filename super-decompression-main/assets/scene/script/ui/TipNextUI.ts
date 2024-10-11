import { IVec3, Node, Vec3 } from "cc"
import { ccclass, BaseUI, EUILayer, _scene, _ui, winSize, TweenHelper, ETweenType, _logic, Sets, Move, Vector2, winCenterPostion, NodeHelper, ScaleAnim, Vector3 } from "../../../main/script/Main"
import { CubeItem } from "../CubeItem"
import { CCubesSize, ILogicData } from "../../../main/script/module/define/LogicDefine"
import { Scene } from "../Scene"

const v2T = new Vector2()
const v3TOne = new Vec3(1, 1, 1)

const itemScale = new Vec3(1.2, 1.2, 1)
const itemScale2 = new Vec3(.8, .8, 1)
const itemScale3 = new Vec3(.2, .2, 1)


@ccclass("TipNextUI")
export class TipNextUI extends BaseUI {
	public layerType = EUILayer.Notice

	private cAItem: Node = null!
	private cARotate: Node = null!

	private _move = new Move()
	private _move2 = new Move()

	private scaleAnim = new ScaleAnim()
	private scaleAnim2 = new ScaleAnim()

	public _openData: ILogicData = null!

	private get item() { return this.getCacheComponent(CubeItem) }
	protected get scene() { return _scene.getCurrent<Scene>() }

	protected onCreate(): void {
		this._move.init(this.cAItem, true, 800)
		this._move2.init(this.cARotate, true, 1000)

		this.scaleAnim.init(this.cAItem)
		this.scaleAnim2.init(this.cARotate)
	}

	protected onOpen(): void {
		this.cARotate.active = false
		this.scaleAnim.stop()
		this.scaleAnim.stop()

		if (!this._openData) {
			this.showCircle()
			this.cAItem.active = false
			return
		}
		this.cAItem.active = true

		this.item.init(Sets.pop(_logic.maxCardNums, false), false)

		let pos = this._openData.entity.node.worldPosition
		v2T.x = pos.x
		v2T.y = pos.y + CCubesSize.y / 2 - 10

		NodeHelper.setPositionXY(this.cAItem, v2T, true)

		this.scaleAnim.lerpRun(itemScale, .06, Vector3.ZERO)

		this._move.setRunData(1, (data, index) => {
			Vector2.set(data.target, winCenterPostion())
		})
		this._move.run(() => {
			this.scheduleOnce(() => {

				this.scaleAnim.lerpRun(itemScale2, .02)

				this._move.setRunData(1, (data, index) => {
					Vector2.set(data.target, this.scene.endPos)
				})
				this._move.run(() => {
					this.showCircle()
				})
			}, .5)
		})
	}

	protected onClose(): void {
		this.cARotate.active = false
	}

	protected onUpdate(): void {
		this._move.onUpdate()
		this._move2.onUpdate()
		this.scaleAnim.onUpdate()
		this.scaleAnim2.onUpdate()

	}


	private showCircle() {
		this.scaleAnim2.lerpRun(v3TOne, .06, Vector3.ZERO)
		this.cARotate.active = true
		// 小圈
		NodeHelper.setPositionXY(this.cARotate, winCenterPostion(), true)
		this.scheduleOnce(() => {
			this.scaleAnim2.lerpRun(itemScale3, .1)

			this._move2.setRunData(1, data => {
				data.target.x = -100
				data.target.y = winSize().height
				data.speedMul = 1.3
			})
			this._move2.run(() => {
				this.closeUI()
			})

		}, 1.5)
	}

}