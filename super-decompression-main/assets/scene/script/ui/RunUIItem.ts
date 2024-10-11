import { Node } from "cc";
import { ccclass, BaseComponent, _prop, _language, _main, property, _config_, _scene, _ui, _logic, _gameType } from "../../../main/script/Main";
import { Scene } from "../Scene";
import { EPropId } from "../../../main/script/module/define/LogicDefine";





@ccclass("RunUIItem")
export class RunUIItem extends BaseComponent {

	@property({
		type: EPropId,
		displayName: "道具id"
	})
	private configID = EPropId.tip

	private cAAdd: Node = null!

	private get prop() { return _prop.singles.get(this.configID) }
	protected get scene() { return _scene.getCurrent<Scene>() }

	private get isOpenUI() { return false }
	// private get isOpenUI() { return PlatformMgr.type != EPlatformType.OverseasKWai }
	private get curCount() {
		return this.prop.cur + _gameType.propCount[this.configID]
	}

	onLoad() {
		super.onLoad()
		this.addEvent(_prop.EventType.PROP_CHANGE, this.onEventPropChange, this, _prop)
	}

	onEnable() {
		super.onEnable()
		this.onEventPropChange()
	}

	onClick() {
		if (!this.scene.isLoadComplete)
			return

		if (_prop.hasToDayMax(this.prop.id)) {
			// _ui.tip(_language.get(40003))
			return
		}
		if (this.curCount > 0) 
			_prop.useProp(this.prop.id)
		else {
			let id = this.prop.id

			if (this.isOpenUI) {
				_prop.openGetUI(this.prop)
				return
			}

			_main.showVideo(
				"",
				() => {
					_ui.tip(_language.get(40001))
					_prop.addProp(id)
				},
				false,
				() => {
					_prop.addPropBuyShare(id)
				}
			)
		}
	}



	private onEventPropChange() {
		let cur = this.curCount
		if (cur > 0) {
			this.Label.string = "" + cur
			this.SwitchChildrenCC.index = 0

			if (this.isOpenUI)
				this.ButtonCC.isPlayBreathe = true
			else
				this.ButtonCC.isPlayBreathe = false
		}
		else {
			this.SwitchChildrenCC.index = 1
			if (this.isOpenUI)
				this.ButtonCC.isPlayBreathe = false
			else
				this.ButtonCC.isPlayBreathe = true
		}
	}

}
