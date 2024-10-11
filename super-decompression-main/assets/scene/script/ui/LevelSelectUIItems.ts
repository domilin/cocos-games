import { ccclass, BaseComponent } from "../../../main/script/Main"
import { LevelSelectUI } from "./LevelSelectUI"
import { LevelSelectUIItem } from "./LevelSelectUIItem"



@ccclass("LevelSelectUIItems")
export class LevelSelectUIItems extends BaseComponent {

	public init(start: number, count: number, ui: LevelSelectUI) {
		this.CreatePrefabToEditorCC.render(count, LevelSelectUIItem, (comp, data, index) => {
			comp.init(start + index + 1, ui)
		})
	}

}
