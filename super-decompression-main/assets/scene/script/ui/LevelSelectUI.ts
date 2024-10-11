import { EventTouch, Label } from "cc";
import { LevelHelper, ccclass, BaseUI, EUILayer, EBottomAdType, EBlockOnceAdType, _gameType } from "../../../main/script/Main";
import { LevelSelectUIItems } from "./LevelSelectUIItems";


const rowCount = 4

export interface ILevelSelectUIData {
	level: LevelHelper<null, null>,
	configLength: number
	add?: boolean
}

@ccclass("LevelSelectUI")
export class LevelSelectUI extends BaseUI {
	public layerType = EUILayer.Panel
	public bottomAdType = EBottomAdType.None
	public blockOnceAdType = EBlockOnceAdType.None


	public allCount = -1
	public colCount = -1
	public endCount = -1

	public _openData: ILevelSelectUIData = null!

	protected onCreate(): void {
		this.addEvent(LevelHelper.EventType.CHNAGE, this.updateView, this, () => this._openData.level)
		this.ListRollCC.itemDataRender = (data, item, index) => {
			item.getComponent(LevelSelectUIItems)!
				.init(data * rowCount, data == this.colCount - 1 ? this.endCount : rowCount, this)
		}
	}

	onOpen() {
		let curLevel = this._openData.level.cur
		this.allCount = Math.max(this._openData.add ? curLevel + 1000 : curLevel, this._openData.configLength)
		this.colCount = Math.ceil(this.allCount / rowCount)
		this.endCount = this.allCount % rowCount

		this.ListRollCC.setItemDatas(this.colCount)
		this.scheduleOnceCover(() => {
			this.ListRollCC.showIndex(Math.floor(curLevel / rowCount), -300)
		})

	}

	private updateView() {
		this.onOpen()
		this.ListRollCC.updateItemDatas()
	}


	private onClickExit() {
		this.closeUI()
		_gameType.exit()
	}

}
