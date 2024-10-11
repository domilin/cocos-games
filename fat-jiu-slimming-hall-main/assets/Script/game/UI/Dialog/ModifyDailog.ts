import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, EditBox, sp, } from 'cc';
import { Const } from '../../../config/Const';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;

@ccclass('ModifyDailog')
export class ModifyDailog extends BaseView {

    @property({ type: Node, tooltip: "名字输入框" }) nameEditBox: Node = null!;



    _isEditState = false

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        //  let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
    }

    onClickModifyBtn() {
        audioManager.instance.playSound(Const.Audio.btn)

        let str = this.nameEditBox.getComponent(EditBox)!.string
        if (str == "") {
            this.toast("名字不能为空")
            return
        }
        if(str.length > 7){
            this.toast("名字不能超过7个字")
            return
        }
        userData.roleName = str
        this.popClose()

    }

}

