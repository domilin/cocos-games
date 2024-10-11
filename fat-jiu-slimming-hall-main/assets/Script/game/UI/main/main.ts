import { director, find, Label, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { tyqAdManager } from '../../../tyqSDK/SDK/tyqAdManager';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { aiRobot } from '../../comm/AIRobot';
import { composeModel } from '../../comm/composeModel';
import { playerModel } from '../../comm/playerModel';
import { redPointManager, RPointEvent } from '../../comm/RedPointManager';
import { SignUtil } from '../../comm/SignUtil';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { TreasureModel } from '../Dialog/TreasureModel';
import { main_top } from './main_top';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends BaseView {

    //星星
    get starNode() { return find("root/LayoutLeft/buildList/star", this.node)! }

    //场景父节点
    get sceneNode() { return find("root/sceneNode", this.node)! }

    //进入合成按钮
    get menuBtnForCompose() { return find("root/bottom/compose", this.node)! }

    //建造清单节点
    get buildListNode() { return find("root/LayoutLeft/buildList", this.node)! }
    get buildListStarLabel() { return find("root/LayoutLeft/buildList/starLabel", this.node)!.getComponent(Label)! }

    onLoad() {

        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.on(GD.event.SceneNodeScale, this.SceneNodeScale, this)

        // this.on(GEvent.e.diamondUpd, this.diamondUpd)
        // this.on(GEvent.e.clickMenu, this.showContent)
        this.bindButton(this.buildListNode, () => {
            uiManager.instance.showDialog(Const.Dialogs.build_list)
        })
        this.bindButtonNoAudio(this.menuBtnForCompose, this.onClickBtnCompose);

        this.bindButton(find("root/LayoutRight/btnTujian", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.Tujian)
        })

        this.bindButton(find("root/LayoutRight/btndebug", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.DebugDialog)
        })

        find("root/LayoutRight/btndebug", this.node)!.active = Const.isOpenCheat

        this.bindButton(find("root/LayoutRight/btnSet", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.SetDialog)
        })

        this.bindButton(find("root/LayoutRight/btnEmail", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.EmailDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnFree", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.ActivityDialog)
            //  uiManager.instance.showDialog(Const.Dialogs.GodWealthLayer);
        })

        this.bindButton(find("root/LayoutLeft/btnfirstRecharge", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.firstRecharge)
        })

        this.bindButton(find("root/LayoutLeft/btnMonthCard", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.MonthCard)
        })

        this.bindButton(find("root/LayoutRight/btnRoleInfo", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.FeijiuDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnSale", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.RewardActivityDialog)
        })

        this.bindButton(find("root/btnsRight/btnTreasure", this.node)!, () => {
            if (TreasureModel.receiveNum >= 6) {
                uiManager.instance.showDialog(Const.Dialogs.TreasureFinishDialog)
            } else {
                uiManager.instance.showDialog(Const.Dialogs.TreasureDialog)
            }
            //uiManager.instance.showDialog(Const.Dialogs.TreasureDialog)
        })


        this.bindButton(find("root/LayoutLeft/btnSign", this.node)!, () => {

            // let params: any = { propList: "20011,30055,20022,20013,30057,20013", shareName: "胖啾啾啊", shareUserId: "444456302229491712" }
            // if (params && params.shareUserId) {
            //     let propList = params.propList
            //     params.propList = propList.split(",")
            //     console.error("params2 = ", params)
            //     uiManager.instance.showDialog(Const.Dialogs.GodWealthOther, { params: params });
            // }
            uiManager.instance.showDialog(Const.Dialogs.SignDialog)
            //   uiManager.instance.showDialog(Const.Dialogs.GodWealthLayer);
            //   uiManager.instance.showDialog(Const.Dialogs.GodWealthOther, { params: { shareUserId: "443344673366511616", shareName: "胖胖的", propList: [40028, 50017, 50012, 40027, 50013, 20022] } });
        })

        find("root/LayoutLeft/btnSign", this.node)!.active = SignUtil.getInstance().getCurSignDay() > 0

        this.bindButton(find("root/btnsRight/btnSeasonAward", this.node)!, () => {
            // uiManager.instance.showDialog(Const.Dialogs.SeasonAwardLayer);
            uiManager.instance.showDialog(Const.Dialogs.SeasonAwardAdLayer);
        });

        this.addPrefab(Const.Prefabs.Main_top, find("root", this.node)!, null!, { flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });
        //  uiManager.instance.showDialog(Const.Prefabs.Main_top,{ flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });
        uiManager.instance.showDialog(Const.Dialogs.fly_tip)

        UtilPub.breathScale(this.starNode, 1.1)
        aiRobot.initRobot();
    }

    onEnable() {
        this.chgGreenStar()
        console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);

        this.on(GD.event.refreshHandLayer, this.refreshHandLayerRet, this)
        this.on(GD.event.unlockSystem, this.unlockSystemRet, this);
        this.on(GD.event.updateTreasure, this.updateTreasure, this);


        this.refreshUnlockLayer();
        this.refreshHandLayer();
        this.initBtns()
        this.updateTreasure()

        userData._showPropTujianRed = userData.checkTujianRedPoint()
        userData._showSceneTujianRed = userData.checkTujianSceneRedPoint()

        redPointManager.setRedpoint(find("root/LayoutRight/btnEmail", this.node)!, RPointEvent.RPM_Email, false)
        redPointManager.setRedpoint(find("root/LayoutRight/btnTujian", this.node)!, RPointEvent.RPM_Tujian, false)
        tyqSDK.eventSendCustomEvent("进入主界面")

        this.scheduleOnce(() => {
            composeModel.btnComposePos = UtilPub.convertToWorldSpace(find("root/bottom/compose", this.node)!);
        });

    }

    updateTreasure() {
        let receicedNum = TreasureModel.receiveNum
        let numLabel = find("root/btnsRight/btnTreasure/numLabel", this.node)!.getComponent(Label)!
        if (receicedNum < 6) {
            numLabel.string = receicedNum + "/6"
            let cd = numLabel.node.getComponent(CdComponent)
            if (cd) {
                cd.destroy()
            }
        } else {
            let cd = numLabel.node.getComponent(CdComponent)
            if (cd == null) {
                cd = numLabel.node.addComponent(CdComponent)
            }
            cd.setIgnoreSec(true).setCD(CDType.CDIneterVal, TreasureModel.timeData.key, TreasureModel.timeData.cdTime)
        }
    }

    initBtns() {
        // if (w) {
        find("root/LayoutLeft/btnMonthCard", this.node)!.active = false
        find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = false
        find("root/LayoutLeft/btnSale", this.node)!.active = false
        //   }
    }

    unlockSystemRet() {
        this.refreshUnlockLayer();
    }

    refreshUnlockLayer() {
        let btnSeasonAward = find("root/btnsRight/btnSeasonAward", this.node)!;
        // btnSeasonAward.active = false;
        // return;

        if (playerModel.seasonOpen) {
            btnSeasonAward.active = true;
        } else {
            btnSeasonAward.active = false;
        }
    }

    refreshHandLayer() {
        let handIndex = composeModel.getHandIndex();
        if (handIndex >= handIndexs.firstCompose && handIndex <= handIndexs.goBuildScene) {
            handIndex = handIndexs.goCompose;
        } else if (handIndex == handIndexs.composeCardLayer) {
            handIndex = handIndexs.backComposeLayer;
        }
        if (handIndex == handIndexs.goCompose || handIndex == handIndexs.backComposeLayer) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = this.menuBtnForCompose;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
    }

    refreshHandLayerRet() {
        this.refreshHandLayer();
    }

    onDisable() {
        console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        this.off(GD.event.refreshHandLayer, this.refreshHandLayerRet)
        this.off(GD.event.updateTreasure, this.updateTreasure);

    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.FirstCharge)
        if (data) {
            if (parseInt(data.val + "") == 2) {
                find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = false
            } else {
                find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = true
                if (parseInt(data.val + "") == 1) {
                    // --- 添加红点
                }
            }
        }
    }

    chgGreenStar() {
        this.buildListStarLabel.string = userData.greenStar + ""
    }

    SceneNodeScale() {

    }

    start() {
        this.chgGreenStar()
    }

    show() {

    }

    onClickBtnCompose() {
        if (composeModel.getHandIndex() == handIndexs.goCompose
            || composeModel.getHandIndex() == handIndexs.backComposeLayer
        ) {
            composeModel.addHandIndex();
            composeModel.closeHandLayer();
        }
        UtilPub.log("------------handIndex Main0", composeModel.getHandIndex())
        audioManager.instance.playSound(Const.Audio.sceneChange);
        uiManager.instance.showDialog(Const.Dialogs.ComposeLayer);
    }


}

