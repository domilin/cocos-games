import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, director, EditBox, } from 'cc';
import { Const } from '../../../config/Const';
import { CodeState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import GD from '../../../config/GD';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { audioManager } from '../../../easyFramework/mgr/audioManager';

const { ccclass, property } = _decorator;


@ccclass('DuihuanDialog')
export class DuihuanDialog extends BaseView {

    @property({ type: EditBox }) codeEditBox: EditBox = null!


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        //   userData.setGetPropTujian(10005, Const.TujianState.geted)

    }
    onEnable() {
        // console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetActiveCode.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetActiveCode.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        //console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetActiveCode.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        if (value.status != 'success') {
            //"msg":  "CodeIsNotExist", // "RewardsAlreadyGotted", //ActiveCodeExpired
            console.log("请求失败~!", value.msg)
            let msg = ""
            if (value.msg == "CodeIsNotExist") {
                msg = "激活码不存在"
            } else if (value.msg == "RewardsAlreadyGotted") {
                msg = "无效的激活码"
            } else if (value.msg == "ActiveCodeExpired") {
                msg = "激活码已过期"
            }
            this.emit(GD.event.showTip, { msg: msg })
            return null;
        }
        uiManager.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: value.rewards })
    }

    openDuihuanMa() {
        audioManager.instance.playSound(Const.Audio.btn)
        let code = this.codeEditBox.string
        tyqSDK.eventSendCustomEvent("查看设置-兑换码兑换")
        ServerCtrJSF.GetInstance().reqGetActiveCode(code)

    }
}

