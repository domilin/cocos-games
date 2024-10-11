import { _decorator, Component, Node, find, Sprite, Label, UIOpacity, instantiate, Vec3, SpriteFrame, color } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GLockState, GResType, GSceneItemType, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_skin_detailList')
export class scene_ui_skin_detailList extends BaseView {
    get root() { return find("root", this.node)! }
    get closeBtn() { return find("root/btnClose", this.node)! }
    get icon() { return find("root/obj/detail_icon_bg/icon", this.node)!.getComponent(Sprite)! }
    get desc() { return find("root/obj/desc", this.node)!.getComponent(Label)! }
    get skinName() { return find("root/obj/detail_icon_bg/skinName", this.node)!.getComponent(Label)! }

    get btnInfo() { return find("root/obj/btnInfo", this.node)! }
    get buyBtn() { return find("root/obj/btnbg", this.node)! }
    get skinList() { return find("root/obj/Layout", this.node)! }

    get lockStr() { return find("root/obj/lockStr", this.node)! }

    get resVal() { return find("root/obj/btnbg/res/res_val", this.node)!.getComponent(Label)! }
    get resIcon() { return find("root/obj/btnbg/res/res_icon", this.node)!.getComponent(Sprite)! }
    get title() { return find("root/titleTxt", this.node)!.getComponent(Label)! }
    get dressVal() { return find("root/obj/detail_icon_bg/dress/dress_val", this.node)!.getComponent(Label)! }


    @property({ type: Node }) skinItem: Node = null!;



    skinId: number = 0
    dressData: any = null

    start() {
        this.bindButton(this.buyBtn, () => {
            if (this.skinId > 0) {
                this.onSceneIDBuy()
            }
        })
        this.bindButton(this.btnInfo, () => {
            if (this.skinId > 0) {
                this.close()
                uiManager.instance.hideDialog(Const.Dialogs.Tujian)
                let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.skinId)
                this.emit(GD.event.goToBuildScene, skinData.scene, GBuildType.item)
                this.emit(GD.event.popOpsWindow, UtilScene.getSceneItemNodeById(skinData.scene)!.node)
                this.emit(GD.event.clickDressItem, this.skinId)
            }
        })


        this.bindButton(this.closeBtn, () => {
            this.close()
        })
    }

    onSceneIDBuy() {
        //资源不足提示
        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.skinId)
        let type = skinData.res.split(",")[0]
        let val = skinData.res.split(",")[1]
        let isBuySuccess: boolean = false
        if (type == GResType.gold) {
            if (userData.checkAndUseCoin(val) == false) {
                this.close()
                // uiManager.instance.showDialog(Const.Dialogs.gold_no_enough, { cb: () => { } })
            } else { //购买成功
                isBuySuccess = true
                tyqSDK.eventSendCustomEvent("金币购买装扮: " + skinData.name)
            }
        } else if (type == GResType.diamond) {
            if (userData.checkAndUseDiamonds(val) == false) {
                this.close()
                // uiManager.instance.showDialog(Const.Dialogs.diamond_no_enough, { cb: () => { } })
            } else {
                isBuySuccess = true
                tyqSDK.eventSendCustomEvent("钻石购买装扮: " + skinData.name)
            }
        } else if (type == GResType.tick) {
            if (userData.checkAndUseDressMoney(val) == false) {
                this.close()
                // uiManager.instance.showDialog(Const.Dialogs.tick_no_enough, { cb: () => { } })
            } else {
                isBuySuccess = true
                tyqSDK.eventSendCustomEvent("装扮券购买装扮: " + skinData.name)
            }
        }

        if (isBuySuccess) {
            // this.close()
            this.emit(GD.event.showTip, { msg: "购买成功" })
            //保存数据
            SceneData.ins.setSceneSkinById(this.skinId, GSceneSkinState.gotted)
            //  this.emit(GD.event.clickDressItem, this.skinId)
            this.initSkinInfo(this.skinId)
            //   UtilScene.setSceneItemAni(Const.SelSceneNode)

        }
    }

    show(args: any) {
        super.show(args)
        if (args.skinId) {
            //   this.skinId = args.skinId
            this.initSkinInfo(args.skinId)
        }
    }

    initSkinInfo(skinId: number) {
        this.skinId = skinId;
        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, skinId)
        UtilScene.setSkinIcon(this.icon, skinData)
        let itemId = skinData.res.split(",")[0]
        let itemData = tables.ins().getTableValueByID(Const.Tables.prop, itemId)
        this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 50)
        this.resVal.string = "x" + skinData.res.split(",")[1]
        this.dressVal.string = "+" + skinData.zb.split(",")[1]
        this.title.string = skinData.name


        let curScene = skinData.scene


        let sData = SceneData.ins.getSceneItemById(curScene, GSceneItemType.item)!
        let isUnLock = sData == null || sData.lockState == GLockState.locked
        if (isUnLock) {
            this.buyBtn.active = false
            this.btnInfo.active = false
            this.lockStr.active = true

            this.skinName.string = "???"
            this.desc.string = "???"
            this.icon.getComponent(Sprite)!.color = color(0, 0, 0, 130)
        } else {
            this.skinName.string = skinData.name
            this.desc.string = skinData.desc
            this.icon.getComponent(Sprite)!.color = color(255, 255, 255, 255)

            this.lockStr.active = false
            //如果已经拥有该皮肤就隐藏按钮
            if (SceneData.ins.getSceneSkinById(skinId) == GSceneSkinState.gotted) {
                this.buyBtn.active = false
                this.btnInfo.active = true
                this.icon.getComponent(UIOpacity)!.opacity = 255
            } else {
                this.buyBtn.active = true
                this.btnInfo.active = false
                this.icon.getComponent(UIOpacity)!.opacity = 125
            }
        }

        let skinList = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", curScene)
        this.skinList.removeAllChildren()
        for (let i = 0; i < skinList.length; i++) {
            let curskin = skinList[i]
            if (curskin.id % curScene > 0) {
                let skin = instantiate(this.skinItem)
                skin.parent = this.skinList
                skin.position = Vec3.ZERO
                this.initSkinItem(skin, curskin, isUnLock)
                if (curskin.id == skinId) {
                    this.setSpriteFrame(skin.getComponent(Sprite)!, Const.resPath.propItembg + "propItembg1")
                } else {
                    this.setSpriteFrame(skin.getComponent(Sprite)!, Const.resPath.propItembg + "propItembg2")
                }
            }
        }
    }

    initSkinItem(item: Node, skinData: any, isUnLock: boolean) {
        let icon = find("icon", item)!.getComponent(Sprite)!
        UtilScene.setSkinIcon(icon, skinData)

        if (isUnLock) {
            icon!.color = color(0, 0, 0, 130)
        } else {
            icon!.color = color(255, 255, 255, 255)
        }

        this.bindButton(item, () => {
            this.initSkinInfo(skinData.id)
        })
    }

    onClickDress() {
        if (this.dressData == null) {
            return
        }
        if (userData.isHaveDressUpId(this.dressData.id) || this.dressData.price == 0) {
            userData.roleDressUpId = this.dressData.id
            this.emit(GD.event.updateDressUp)
            this.popClose()
        } else {
            if (userData.checkAndUseProp(this.dressData.price[0])) {
                userData.buyDressUpId(this.dressData.id)
                tyqSDK.eventSendCustomEvent("购买店长装扮 id：" + this.dressData.id)
                userData.dressValue += this.dressData.changeZhi
                this.emit(GD.event.updateDressUp)
                this.buyBtn.active = true
                this.resIcon.node.active = false
                this.resVal.string = "穿戴"
            } else {
                this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
            }
        }

    }

    onEnable() {
        // this.aniTween.stop()
        // this.bottomBoot.position =v3(0,-1000,0)
        // this.aniTween = tween(this.bottomBoot)
        // .to(0.15, {position:v3(0,25 +this.rootY,0)},{easing: "backIn"})
        // .to(0.25, {position:v3(0,0+this.rootY,0)},{easing: "backIn"})
        // .start()
    }

}


