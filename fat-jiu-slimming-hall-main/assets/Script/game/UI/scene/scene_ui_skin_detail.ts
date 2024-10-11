import { _decorator, Component, Node, find, Sprite, Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GResType, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_skin_detail')
export class scene_ui_skin_detail extends BaseView {
    get root() { return find("root", this.node)! }
    get closeBtn() { return find("root/btnClose", this.node)! }
    get icon() { return find("root/obj/icon", this.node)!.getComponent(Sprite)! }
    get desc() { return find("root/obj/desc", this.node)!.getComponent(Label)! }

    get buyBtn() { return find("root/obj/btnbg", this.node)! }

    get resVal() { return find("root/obj/btnbg/res/res_val", this.node)!.getComponent(Label)! }
    get resIcon() { return find("root/obj/btnbg/res/res_icon", this.node)!.getComponent(Sprite)! }
    get title() { return find("root/titleTxt", this.node)!.getComponent(Label)! }
    get dressVal() { return find("root/obj/dress/dress_val", this.node)!.getComponent(Label)! }

    skinId: number = 0
    dressData: any = null

    start() {
        this.bindButton(this.buyBtn, () => {
            if (this.skinId > 0) {
                this.onSceneIDBuy()
            } else if (this.dressData) {
                this.onClickDress()
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
            this.close()
            this.emit(GD.event.showTip, { msg: "购买成功" })
            //保存数据
            SceneData.ins.setSceneSkinById(this.skinId, GSceneSkinState.gotted)
            this.emit(GD.event.clickDressItem, this.skinId)
            UtilScene.setSceneItemAni(Const.SelSceneNode)

        }
    }

    show(args: any) {
        super.show(args)
        if (args.skinId) {
            this.skinId = args.skinId
            let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.skinId)
            UtilScene.setSkinIcon(this.icon, skinData)
            let itemId = skinData.res.split(",")[0]
            let itemData = tables.ins().getTableValueByID(Const.Tables.prop, itemId)
            this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 50)
            this.resVal.string = "x" + skinData.res.split(",")[1]
            this.dressVal.string = "+" + skinData.zb.split(",")[1]
            this.title.string = skinData.name
            this.desc.string = skinData.desc
            //如果已经拥有该皮肤就隐藏按钮
            this.buyBtn.active = true
            if (SceneData.ins.getSceneSkinById(this.skinId) == GSceneSkinState.gotted) {
                this.buyBtn.active = false
            }
        } else {
            this.dressData = args.dressUpData
            this.setSpriteFrame(this.icon, Const.resPath.roleIcon + this.dressData.icon, undefined, 200)

            this.title.string = this.dressData.name
            this.desc.string = this.dressData.desc
            this.dressVal.string = "+" + this.dressData.changeZhi
            if (this.dressData.price != 0) {
                let itemId = this.dressData.price[0][0]
                let itemData = tables.ins().getTableValueByID(Const.Tables.prop, itemId)
                this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 40)
                this.resVal.string = "x" + this.dressData.price[0][1]
            }
            if (this.dressData.price == 0 || userData.isHaveDressUpId(this.dressData.id)) {
                this.resIcon.node.active = false
                this.resVal.string = "穿戴"
                if (userData.roleDressUpId == this.dressData.id) {
                    this.buyBtn.active = false
                } else {
                    this.buyBtn.active = true
                }
            }
        }
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


