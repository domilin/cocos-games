import { find, Label, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { GBuildType } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
const { ccclass, property } = _decorator;

@ccclass('float_star')
export class float_star extends comm {
    get root() { return find("root", this.node)! }
    get StarLabel() { return find("root/starLabel", this.node)!.getComponent(Label)! }

    id: number = 0
    type: GBuildType = null!
    star: number = 0

    onLoad() {
        this.aniTween.stop()
        this.root.position = v3(0, 110, 0)
        this.aniTween = UtilPub.breathFloat(this.root, 110)

        this.bindButton(this.root, this.onClickBtnPrompt);

    }

    init(id: number, type: GBuildType, star: number) {
        this.id = id
        this.type = type
        this.star = star
        this.StarLabel.string = "x" + star

    }

    onClickBtnPrompt() {
        //id 和 scene_item表id  type为GSceneItemType.room 或者 other，
        composeModel.closeHandLayer();
        uiManager.instance.showDialog(Const.Dialogs.build_prompt, { id: this.id, type: this.type })
    }

}


