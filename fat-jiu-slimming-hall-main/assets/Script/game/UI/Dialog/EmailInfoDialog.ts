import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, } from 'cc';
import { Const } from '../../../config/Const';
import { Email, EmailRewardState, EmailState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { EmailManager } from '../../comm/EmailManager';
import { PropItem, PropItemFlag } from './PropItem';

const { ccclass, property } = _decorator;


@ccclass('EmailInfoDialog')
export class EmailInfoDialog extends BaseView {
    private _email: any;
    @property({ type: Node }) btnReceive: Node = null!;
    @property({ type: Node }) btnRemove: Node = null!;



    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        this._email = EmailManager.getInstance().getEmailById(this._layerData.email.id);
        this._email.readState = EmailState.readFinish
        EmailManager.getInstance().saveEmail(this._email)
        this.initItem(find("root/Email", this.node)!, this._layerData.email)
        this.initBtns()

        tyqSDK.eventSendCustomEvent("查看邮件")

    }

    initItem(itemUI: Node, email: Email) {
        find("title", itemUI)!.getComponent(Label)!.string = "主题：" + email.title
        find("info", itemUI)!.getComponent(Label)!.string = email.content
        let date = new Date(email.time)
        find("time", itemUI)!.getComponent(Label)!.string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        let layer = find("Layout", itemUI)!
        layer.removeAllChildren()
        for (let index = 0; index < email.reward.length; index++) {
            const element = email.reward[index];
            this.addPrefab(Const.Prefabs.PropItem, layer, (item: any) => {
                item.getComponent(PropItem).setData(element.propId, PropItemFlag.TouchInfo, element.cnt)
                item.getComponent(PropItem).setSize(150).setItemBg(1)
            })
        }
    }

    initBtns() {
        if (this._email.receicedState == EmailRewardState.unReceive) {
            this.btnReceive.active = true
            this.btnRemove.active = false
        } else {
            this.btnReceive.active = false
            this.btnRemove.active = true
        }
    }

    onClickReceive() {
        // let reward = this._layerData.email.reward
        // for (let index = 0; index < reward.length; index++) {
        //     const element = reward[index];
        //     //  composeModel.addPropNum(element.propId, element.num)
        // }
        uiManager.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: this._layerData.email.reward })

        this._email.receicedState = EmailRewardState.received
        this.initBtns()
        EmailManager.getInstance().saveEmail(this._email)
        
    }


    onClickRemove() {
        EmailManager.getInstance().removeEmail(this._email.id)
        this.popClose()
    }
}

