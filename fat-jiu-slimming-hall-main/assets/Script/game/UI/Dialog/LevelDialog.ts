import { find, Label, Layout, ProgressBar, tween, v3, _decorator, Node, Tween } from 'cc';
import { NATIVE, WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;

@ccclass('LevelDialog')
export class LevelDialog extends BaseView {
    @property({ type: Label, displayName: "等级Label" }) lvLabel: Label = null!
    @property({ type: ProgressBar, displayName: "等级bar" }) lvBar: ProgressBar = null!
    @property({ type: Layout, displayName: "奖励list" }) itemLayer: Layout = null!
    @property({ type: Label, displayName: "经验label" }) expLab: Label = null!


    @property({ type: Node, displayName: "升级特效" }) levelEffect: Node = null!
    @property({ type: Node }) star: Node = null!

    _leveldata: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        this.bindButton(find("root/btnGrowup", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.GrowUpDialog)
        })
        if (WECHAT) {
            find("root/btnGrowup", this.node)!.active = false
        }
    }

    show(args: any) {
        super.show(args)
        this.initData()

        let hadnIdnex = composeModel.getHandIndex();
        if (hadnIdnex == handIndexs.btnLvUp || hadnIdnex == handIndexs.btnLvUp3) {
            let obj: any = {};
            obj.id = hadnIdnex + 1;
            obj.node = find("root/btnbg", this.node);
            obj.delayTime = 0.5;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
    }
    initData() {

        find("root/lvicon/Label", this.node)!.getComponent(Label)!.string = "" + userData.roleLv
        this._leveldata = tables.ins().getTableValueByID(Const.Tables.herolevel, userData.roleLv)

        this.itemLayer.node.removeAllChildren()
        this._leveldata.reward.forEach((element: any, index: number) => {
            this.addPrefab(Const.Prefabs.PropItem, this.itemLayer.node, (item: any) => {
                item.getComponent(PropItem).setData(element[0], PropItemFlag.TouchInfo, element[1]).setItemBg(1).setSize(180)
                // tween(item).set({ scale: v3(0, 0, 0) }).delay(0.06 + index * 0.05).to(0.15, { scale: v3(1, 1, 1) }).call(() => {
                //     item.scale = v3(1, 1, 1)
                // }).start()
            })
        });
        this.lvBar.progress = Math.min(1, userData.roleExp / this._leveldata.exp)
        this.expLab.string = userData.roleExp + "/" + this._leveldata.exp

        if (userData.roleExp >= this._leveldata.exp) {
            this.levelEffect.active = true
            tween(this.star).to(0.6, { scale: v3(1.2, 1.2, 1.2) }).to(0.6, { scale: v3(1, 1, 1) }).union().repeatForever().start()
        } else {
            this.levelEffect.active = false
            Tween.stopAllByTarget(this.star)
            this.star.scale = v3(1, 1, 1)
        }
    }

    onClickBtnUpgrade() {
        if (userData.checkAndUseExp(this._leveldata.exp)) {
            this._leveldata.reward.forEach((element: any, index: number) => {
                composeModel.addPropNum(element[0], element[1])
            });
            let handIndex = composeModel.getHandIndex();
            if (handIndex == handIndexs.btnLvUp || handIndex == handIndexs.btnLvUp3) {
                if (handIndex == handIndexs.btnLvUp3) {
                    composeModel.closeHandLayer()
                    composeModel.addHandIndex();
                    composeModel.addHandIndex();

                    this.popClose();
                    this.emit(GD.event.refreshHandLayer);
                    audioManager.instance.playSound(Const.Audio.sceneChange);
                    uiManager.instance.showDialog(Const.Dialogs.ComposeLayer);
                } else {
                    composeModel.addHandIndex();
                    composeModel.addHandIndex();
                    this.popClose();
                    this.emit(GD.event.refreshHandLayer);
                }
            }

            userData.roleLv++
            tyqSDK.eventSendCustomEvent(userData.roleLv + "等级的玩家");

            this.initData()
            this.emit(GD.event.updateMoney)
            this.emit(GD.event.chgGreenStar)
            this.emit(GD.event.refreshTask)
        } else {
            this.emit(GD.event.showTip, { msg: "解锁装饰位获得更多经验" })
        }
    }


}

