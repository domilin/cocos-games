import { _decorator, Node, Label, find, Sprite, SpriteFrame, UITransform, math, Layout, } from 'cc';
import { Const } from '../../../config/Const';
import { Email, EmailRewardState, EmailState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { EmailManager } from '../../comm/EmailManager';
import { PropItem, PropItemFlag } from './PropItem';

const { ccclass, property } = _decorator;


@ccclass('EmailDialog')
export class EmailDialog extends BaseView {
    @property({ type: Node, tooltip: "邮件列表" }) emailScroll: Node = null!;
    @property({ type: Node, tooltip: "邮件" }) emailIcon: Node = null!;

    @property({ type: SpriteFrame }) iconOpen: SpriteFrame = null!;
    @property({ type: SpriteFrame }) iconClose: SpriteFrame = null!;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        if (EmailManager.getInstance().popNewEmails()) {
            this.updateInfo()
        } else {
            this.scheduleOnce(() => {
                this.updateInfo()
            }, 0.2)
        }
    }

    updateInfo() {
        let arr = EmailManager.getInstance().EmailList
        let fun = (a: Email, b: Email) => {
            return b.time - a.time
        }
        arr.sort(fun)
        this.scrollViewSetData(this.emailScroll, arr, this.initItem, this)
        this.emailIcon.active = arr.length <= 0
    }

    initItem(itemUI: Node, email: Email, index: number, self: EmailDialog) {
        find("title", itemUI)!.getComponent(Label)!.string = email.title
        find("info", itemUI)!.getComponent(Label)!.string = email.content
        let date = new Date(email.time)
        find("time", itemUI)!.getComponent(Label)!.string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        self.addButtonHander(itemUI, self.node, "EmailDialog", "onTouchEmail", email)
        find("redpoint", itemUI)!.active = (email.reward && email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive)
        find("icon", itemUI)!.getComponent(Sprite)!.spriteFrame = email.readState == EmailState.unRead ? self.iconClose : self.iconOpen

        if (email.reward.length > 0) {
            find("info", itemUI)!.active = false
            find("Layout", itemUI)!.active = true
            let layer = find("Layout", itemUI)!
            layer.removeAllChildren()
            for (let index = 0; index < email.reward.length; index++) {
                self.addPrefab(Const.Prefabs.PropItem, layer, (item: Node) => {
                    item.getComponent(PropItem)!.setData(email.reward[index].propId, PropItemFlag.ShowMinInfo, email.reward[index].cnt)!.setSize(80).setItemBg(1)
                })
            }
        } else {
            find("info", itemUI)!.active = true
            find("Layout", itemUI)!.active = false
        }
    }

    onTouchEmail(event: any, data: Email) {
        uiManager.instance.pushShowDialog(Const.Dialogs.EmailInfoDialog, { email: data })
    }

    onClickRemove() {
        EmailManager.getInstance().removeAllEmail()
        this.updateInfo()
    }

    onClickReceive() {
        let arr = []
        for (let index = 0; index < EmailManager.getInstance().EmailList.length; index++) {
            let email: Email = EmailManager.getInstance().EmailList[index];
            if (email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive) {
                arr.push(...email.reward)
                email.receicedState = EmailRewardState.received
                email.readState = EmailState.readFinish
                EmailManager.getInstance().saveEmail(email)
            }
        }

        if (arr.length > 0) {
            uiManager.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: arr })
        } else {
            this.toast("没有可领取的奖励")
        }
    }

    addEmailTest() {
        EmailManager.getInstance().addEmail()
    }
}

