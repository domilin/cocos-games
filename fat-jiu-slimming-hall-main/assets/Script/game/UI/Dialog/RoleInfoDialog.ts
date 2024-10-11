import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, EditBox, sp, } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;

@ccclass('RoleInfoDialog')
export class RoleInfoDialog extends BaseView {

    @property({ type: Node, tooltip: "名字输入框" }) nameEditBox: Node = null!;
    @property({ type: Node, tooltip: "名字Label" }) nameLabel: Node = null!;
    @property({ type: Node, tooltip: "名字Label" }) modifybtnLabel: Node = null!;

    @property({ type: sp.Skeleton }) roleSpine: sp.Skeleton = null!;

    @property({ type: Node, tooltip: "头像" }) avatarNode: Node = null!;
    @property({ type: Node, tooltip: "头像背景" }) avatarBg: Node = null!;


    @property({ type: SpriteFrame }) avatarBg1: SpriteFrame = null!;
    @property({ type: SpriteFrame }) avatarBg2: SpriteFrame = null!;


    _isEditState = false

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        this.bindButton(find("root/btnDress", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.RoleDressUp)
        })
    }

    updateInfo() {
        let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
        //动态设置spine文件
        resourceUtil.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })

        find("root/Layout/nameLabel", this.node)!.getComponent(Label)!.string = userData.roleName + ""

        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        }else{
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }
        // this.setSpriteFrame(find("root/RoleIcon", this.node)!.getComponent(Sprite)!, Const.resPath.icon + item.icon)
    }

    show(args: any) {
        super.show(args)
      //  let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
      //  this.setSpriteFrame(find("root/RoleIcon", this.node)!.getComponent(Sprite)!, Const.resPath.icon + item.icon)

        let infoNode = find("root/Layout", this.node)!
        find("dressNode/Label", infoNode)!.getComponent(Label)!.string = "装扮值：" + userData.dressValue + ""
        find("levelNode/Label", infoNode)!.getComponent(Label)!.string = "等级：" + userData.roleLv + ""
        find("idbg/IDLabel", infoNode)!.getComponent(Label)!.string = "ID:" + userData.roleID
        find("root/Layout/nameLabel", this.node)!.getComponent(Label)!.string = userData.roleName + ""

        this.nameEditBox.active = false
        this.nameLabel.active = true
        this._isEditState = false

        this.updateInfo()
    }

    onClickModifyBtn() {
        audioManager.instance.playSound(Const.Audio.btn)
        uiManager.instance.pushShowDialog(Const.Dialogs.ModifyDailog)
        return

        if (this._isEditState) {
            let str = this.nameEditBox.getComponent(EditBox)!.string
            if (str == "") {
                this.toast("名字不能为空")
                return
            }
            userData.roleName = str
            find("root/nameLabel", this.node)!.getComponent(Label)!.string = userData.roleName + ""
            this.nameEditBox.active = false
            this.nameLabel.active = true
            this._isEditState = false
        } else {
            this._isEditState = true
            this.nameEditBox.active = true
            this.nameLabel.active = false
            this.modifybtnLabel.getComponent(Label)!.string + "保存"
            this.nameEditBox.getComponent(EditBox)!.string = userData.roleName
        }
    }

}

