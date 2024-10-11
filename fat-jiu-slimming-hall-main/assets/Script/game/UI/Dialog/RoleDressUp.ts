import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, sp, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { comm } from '../../../easyFramework/mgr/comm';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { ScrollViewUtil } from '../../comm/ScrollViewUtil';
import { userData } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';

const { ccclass, property } = _decorator;



@ccclass('RoleDressUp')
export class RoleDressUp extends BaseView {
    @property({ type: Node, tooltip: "列表" }) scrollViewNode: Node = null!;
    @property({ type: sp.Skeleton }) roleSpine: sp.Skeleton = null!;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.bindButton(find("root/item2", this.node)!, this.selectWomen)
        this.bindButton(find("root/item1", this.node)!, this.selectMen)
    }

    onEnable() {
        this.on(GD.event.updateDressUp, this.updateDressUp)
    }

    onDisable() {
        this.off(GD.event.updateDressUp, this.updateDressUp)
    }

    selectWomen() {
        let dressData = tables.ins().getTableValuesByType(Const.Tables.roleDressUp, "type", RoleSex.women)
        this.scrollViewSetData(this.scrollViewNode, dressData, this.initItem, this)
    }

    selectMen() {
        let dressData = tables.ins().getTableValuesByType(Const.Tables.roleDressUp, "type", RoleSex.men)
        this.scrollViewSetData(this.scrollViewNode, dressData, this.initItem, this)
    }

    initInfo() {
        let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
        resourceUtil.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })
    }

    show(args: any) {
        super.show(args)
        let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
        if (item.type == RoleSex.men) {
            this.selectMen()
        } else {
            this.selectWomen()
        }
        this.initInfo()

        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = userData.dressValue + ""
    }

    openSkinDetail(event: any, data: any) {
        uiManager.instance.showDialog(Const.Dialogs.scene_ui_skin_detail, { dressUpData: data })

    }

    initItem(itemUI: Node, item: any, index: number, self: RoleDressUp) {
        self.setSpriteFrame(itemUI.getChildByName("icon")!.getComponent(Sprite)!, Const.resPath.roleIcon + item.icon, undefined, 200)
        self.addButtonHander(itemUI!, self.node, "RoleDressUp", "onChangeWear", item)
        self.clearButtonHander(itemUI.getChildByName("gantan")!)
        self.addButtonHander(itemUI.getChildByName("gantan")!, self.node, "RoleDressUp", "openSkinDetail", item)

        if (userData.isHaveDressUpId(item.id) || item.price == 0) {
            itemUI.getChildByName("btnBuy")!.active = false
            itemUI.getChildByName("hua1")!.active = false
            if (userData.roleDressUpId == item.id) {
                itemUI.getChildByName("btnWear")!.active = false
                itemUI.getChildByName("wearlab")!.active = true
            } else {
                itemUI.getChildByName("btnWear")!.active = true
                itemUI.getChildByName("wearlab")!.active = false
                self.addButtonHander(itemUI.getChildByName("btnWear")!, self.node, "RoleDressUp", "onClickWear", item)
            }
        } else {
            itemUI.getChildByName("btnWear")!.active = false
            itemUI.getChildByName("wearlab")!.active = false
            itemUI.getChildByName("btnBuy")!.active = true

            let itemId = item.price[0][0]
            let itemData = tables.ins().getTableValueByID(Const.Tables.prop, itemId)
            self.setSpriteFrame(find("btnBuy/Node/icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + itemData.icon, undefined, 40)
            find("btnBuy/Node/Label", itemUI)!.getComponent(Label)!.string = "x" + item.price[0][1]

            if (item.changeZhi > 0) {
                itemUI.getChildByName("hua1")!.active = true
                find("hua1/Label", itemUI)!.getComponent(Label)!.string = "+" + item.changeZhi
            } else {
                itemUI.getChildByName("hua1")!.active = false
            }
            self.addButtonHander(itemUI.getChildByName("btnBuy")!, self.node, "RoleDressUp", "onClickBuy", item)
        }
    }

    onChangeWear(event: any, item: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        //  this.setSpriteFrame(find("root/RoleIcon", this.node)!.getComponent(Sprite)!, Const.resPath.icon + data.icon)
        resourceUtil.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })
    }

    onClickWear(event: any, data: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        userData.roleDressUpId = data.id
        this.updateDressUp()
        //  this.setSpriteFrame(find("root/RoleIcon", this.node)!.getComponent(Sprite)!, Const.resPath.icon + data.icon)
    }

    updateDressUp() {
        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = userData.dressValue + ""
        this.scrollViewNode.getComponent(ScrollViewUtil)?.refreshList()
        this.initInfo()
    }

    onClickBuy(event: any, data: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        if (data.price == 0 || userData.checkAndUseProp(data.price[0])) {
            userData.buyDressUpId(data.id)
            tyqSDK.eventSendCustomEvent("购买角色皮肤：" + data.name)
            userData.dressValue += data.changeZhi
            find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = userData.dressValue + ""
            this.scrollViewNode.getComponent(ScrollViewUtil)!.refreshList()
        } else {
            this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
        }
    }
}

