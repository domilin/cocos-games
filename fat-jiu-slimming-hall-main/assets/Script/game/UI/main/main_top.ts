import { find, Label, Node, Sprite, tween, Tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { WidgetType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
import { numAction } from '../../comm/numAction';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
const { ccclass, property } = _decorator;

@ccclass('main_top')
export class main_top extends BaseView {
    @property({ type: Label, displayName: "体力Label" }) powerLabel: Label = null!
    @property({ type: Label, displayName: "金币Label" }) coinLabel: Label = null!
    @property({ type: Label, displayName: "钻石Label" }) diamondsLabel: Label = null!
    @property({ type: Label, displayName: "装扮券Label" }) dressMoneyLabel: Label = null!

    @property({ type: Label, displayName: "等级Label" }) lvLabel: Label = null!
    @property({ type: Sprite, displayName: "等级bar" }) lvBar: Sprite = null!

    @property({ type: Label, displayName: "倒计时Label" }) timeLabel: Label = null!

    @property({ type: Node, displayName: "升级特效" }) levelEffect: Node = null!
    @property({ type: Node }) star: Node = null!

    @property({ type: Node, displayName: "无限能量特效" }) wuxianEffect: Node = null!

    public static ShowLevel = 1
    public static ShowCoin = 1 << 1
    public static ShowDress = 1 << 2
    public static ShowPower = 1 << 3
    public static ShowDiamond = 1 << 5

    private static _topNode: Node = null!

    private _isUpdateMoney = false
    _step = 13;


    public static getTopNode() {
        return main_top._topNode;
    }

    onLoad() {
        this.updateMoney()
        this.fitNodeWidgetY(find("root/top", this.node)!, WidgetType.top, -50)
        this.fitNodeWidgetY(find("root/level", this.node)!, WidgetType.top, -20)
    }

    onEnable() {
        this.on(GD.event.updateMoney, this.updateMoney)
        this.on(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.updateMoney()

        this.coinLabel.string = userData.coin + ""
        this.diamondsLabel.string = userData.diamonds + ""
        main_top._topNode = this.node
        this.on(GD.event.refreshHandLayer, this.refreshHandLayerRet, this)
        this.refreshHandLayer();
    }

    refreshHandLayer() {
        let handIndex = composeModel.getHandIndex();
        if (handIndex == handIndexs.btnLvUp) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = find("root/level", this.node);
            obj.click2 = 1;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
        if (handIndex == handIndexs.btnLvUp3) {
            let lvdata = tables.ins().getTableValueByID(Const.Tables.herolevel, userData.roleLv)
            if (userData.roleExp >= lvdata.exp) {
                let obj: any = {};
                obj.id = handIndex;
                obj.node = find("root/level", this.node);
                obj.click2 = 1;
                uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
                //  composeModel.addHandIndex()
            }
        }
    }

    refreshHandLayerRet() {
        this.refreshHandLayer();
    }

    onDisable() {
        this.off(GD.event.updateMoney, this.updateMoney)
        this.off(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.off(GD.event.refreshHandLayer, this.refreshHandLayerRet)
    }

    start() {
        let flag = this._layerData.flag
        this.timeLabel.string = ""
        find("root/level", this.node)!.active = (flag & main_top.ShowLevel) != 0
        find("root/top/dressup", this.node)!.active = (flag & main_top.ShowDress) != 0
        find("root/top/gold", this.node)!.active = (flag & main_top.ShowCoin) != 0
        find("root/top/power", this.node)!.active = (flag & main_top.ShowPower) != 0
        find("root/top/diamond", this.node)!.active = (flag & main_top.ShowDiamond) != 0
    }

    updateMoney() {
        this.powerLabel.string = userData.power + ""
        //  this.coinLabel.string = userData.coin + ""
        // this.diamondsLabel.string = userData.diamonds + ""
        this.lvLabel.string = userData.roleLv + ""
        this.dressMoneyLabel.string = userData.dressMoney + ""
        let lvdata = tables.ins().getTableValueByID(Const.Tables.herolevel, userData.roleLv)
        if (lvdata) {
            this.lvBar.fillRange = userData.roleExp / lvdata.exp
        }

        if (userData.power < 100) {
            this.timeLabel.getComponent(CdComponent)!.setCD(CDType.CDCountdown, "video_powerAuto", 2 * 60, (time: number) => {
                if (userData.power + time >= 100) {
                    userData.power = Math.max(userData.power, 100)
                    this.timeLabel.getComponent(CdComponent)!.clearCD()
                } else {
                    userData.power += time
                    this.updateMoney()
                }
                this.powerLabel.string = userData.power + ""
            })
        } else {
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }

        if (userData.roleExp >= lvdata.exp) {
            this.levelEffect.active = true
            tween(this.star).to(0.6, { scale: v3(1.2, 1.2, 1.2) }).to(0.6, { scale: v3(1, 1, 1) }).union().repeatForever().start()
        } else {
            this.levelEffect.active = false
            Tween.stopAllByTarget(this.star)
            this.star.scale = v3(1, 1, 1)
        }
    }

    updateMoneyAction() {
        let coinCom = this.coinLabel.getComponent(numAction) || this.coinLabel.addComponent(numAction)
        coinCom!.setTargetNum(userData.coin)

        let diamondsCom = this.diamondsLabel.getComponent(numAction) || this.diamondsLabel.addComponent(numAction)
        diamondsCom!.setTargetNum(userData.diamonds)

        let powerCom = this.powerLabel.getComponent(numAction) || this.powerLabel.addComponent(numAction)
        powerCom!.setTargetNum(userData.power)

        let dressMoneyCom = this.dressMoneyLabel.getComponent(numAction) || this.dressMoneyLabel.addComponent(numAction)
        dressMoneyCom!.setTargetNum(userData.dressMoney)
    }

    addMoney(event: any, data: any) {
        if (data == 1) { //  获得体力
            //  userData.checkAndUsePower(2)
            //  this.emit(GD.event.updateMoney)
            uiManager.instance.showDialog(Const.Dialogs.ShopPowerDialog)
            //    RechargeManager.RechargeTest()
        } else if (data == 2) { // 获得金币
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "4" })
            // if (NATIVE) {
            //     return
            // }
            // uiManager.instance.showDialog(Const.Dialogs.ShopDialog)
        } else if (data == 3) { // 获得钻石
            // if (NATIVE) {
            //     return
            // }
            // uiManager.instance.showDialog(Const.Dialogs.ShopSynthesisDialog)
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "1" })

        } else if (data == 4) {
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "3" })
        }
    }

    showLevelDialog() {
        composeModel.closeHandLayer();
        uiManager.instance.pushShowDialog(Const.Dialogs.LevelDialog)
    }

    update() {
        if (userData.power >= 100) {
            this.timeLabel.string = ""
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }
    }

    lateUpdate() {
        if (composeModel.getComposePowerRemainTime() > 0) {
            this.powerLabel.node.active = false;
            this.wuxianEffect.active = true;
            this.timeLabel.string = UtilPub.getDurationStr(composeModel.getComposePowerRemainTime());
        } else {
            this.powerLabel.node.active = true;
            this.wuxianEffect.active = false;
        }
    }

}

