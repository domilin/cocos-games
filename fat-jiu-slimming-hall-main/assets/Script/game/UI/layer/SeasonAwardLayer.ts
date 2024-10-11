import { Button, find, instantiate, Layout, Node, ProgressBar, ScrollView, Sprite, UITransform, v2, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
import { playerModel } from '../../comm/playerModel';
const { ccclass, property } = _decorator;

@ccclass('SeasonAwardLayer')
export class SeasonAwardLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;
    @property({ type: Node })
    btnHelp: Node = null!;
    @property({ type: Node })
    btnBuy: Node = null!;

    @property({ type: Node })
    nextProgress: Node = null!;
    @property({ type: Node })
    scoreNode: Node = null!;
    @property({ type: Node })
    lvNode: Node = null!;
    @property({ type: Node })
    timeNode: Node = null!;

    @property({ type: Node })
    listNode: Node = null!;
    @property({ type: Node })
    contentNode: Node = null!;

    @property({ type: Node })
    progressNode: Node = null!;

    @property({ type: Node })
    itemLayer: Node = null!;
    @property({ type: Node })
    awardItem: Node = null!;

    onLoad() {
        this.awardItem.parent = this.node;
        this.awardItem.active = false;

        this.bindButton(this.btnClose, this.onClickBtnClose);
        this.bindButton(this.btnHelp, this.onClickBtnHelp);
        this.bindButton(this.btnBuy, this.onClickBtnBuy);
    }

    onEnable() {
        this.on(GD.event.overMonth, this.overMonthRet);

        this.schedule(this.updateSecond, 1);
    }

    onDisable() {
        this.off(GD.event.overMonth, this.overMonthRet);

        this.unschedule(this.updateSecond);
    }

    show() {
        this.initUI();
    }

    initUI() {
        this.refreshTopLayer();
        this.refreshListLayer();
        this.refreshProgressBar();
        this.updateSecond();
    }

    refreshTopLayer() {
        let nextRow = tables.ins().getTableValueByID(Const.Tables.seasonAward, playerModel.seasonId + 1);
        if (nextRow) {
            this.setString(this.scoreNode, playerModel.seasonScore + "/" + nextRow.num);
            this.setProgressBar(this.nextProgress, playerModel.seasonScore / nextRow.num);
            this.setString(this.lvNode, nextRow.lv);
        } else {
            this.setString(this.lvNode, playerModel.seasonId - 1);
            this.setString(this.scoreNode, localText.lvMax);
            this.setProgressBar(this.nextProgress, 1);
        }
    }

    refreshListLayer() {
        this.itemLayer.removeAllChildren();
        let tb = tables.ins().getTable(Const.Tables.seasonAward);
        for (let i = tb.length - 1; i >= 0; i--) {
            let row = tb[i];
            let itemUI = instantiate(this.awardItem);
            itemUI.active = true;
            itemUI.parent = this.itemLayer;
            this.refreshAwardItem(itemUI, row);
        }

        let itemLayout = this.itemLayer.getComponent(Layout)!;
        itemLayout.updateLayout();
        this.contentNode.getComponent(UITransform)!.height = this.itemLayer.getComponent(UITransform)!.height + 100;

        let itemHeight = this.awardItem.getComponent(UITransform)!.height;

        let chs = this.itemLayer.children;

        let len = (chs.length - 1) * (itemHeight + itemLayout.spacingY);
        this.progressNode.getComponent(UITransform)!.height = len;
        this.progressNode.getComponent(ProgressBar)!.totalLength = len;

        let y = len + itemHeight * 0.5;
        this.progressNode.position = v3(0, -y);

        this.scheduleOnce(() => {
            // 自动滚动到进度条位置
            let dy = (chs.length - playerModel.seasonId - 5) * itemHeight;
            this.listNode.getComponent(ScrollView)!.scrollToOffset(v2(0, dy));
        });
    }

    refreshProgressBar() {
        let tb = tables.ins().getTable(Const.Tables.seasonAward);
        let nextRow = tables.ins().getTableValueByID(Const.Tables.seasonAward, playerModel.seasonId + 1);
        if (nextRow) {
            let oneP = 1 / (tb.length - 1);
            let p = oneP * (playerModel.seasonId - 1) + playerModel.seasonScore / nextRow.num * oneP;
            this.setProgressBar(this.progressNode, p);
        } else {
            this.setProgressBar(this.progressNode, 1);
        }
    }

    refreshAwardItem(itemUI: Node, row: any) {
        this.setString(find("rank/lv", itemUI), row.lv);

        let info = playerModel.getSeasonAwardInfoById(row.id);

        let award1 = row.award1;
        let propRow = tables.ins().getTableValueByID(Const.Tables.prop, award1[0]);
        let award1Node = find("award1", itemUI)!;
        // @ts-ignore
        award1Node.row = row;
        this.bindButton(award1Node, this.onClickAward1);

        this.setSpriteFrame2(find("icon", award1Node)!.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this.setString(find("num", award1Node)!, "x" + award1[1]);
        let get1Node = find("get", award1Node)!;
        if (info && !info.a1) {
            get1Node.active = true;
        } else {
            get1Node.active = false;
        }

        let award2 = row.award2;
        propRow = tables.ins().getTableValueByID(Const.Tables.prop, award2[0]);
        let award2Node = find("award2", itemUI)!;
        // @ts-ignore
        award2Node.row = row;
        this.bindButton(award2Node, this.onClickAward2);
        this.setSpriteFrame2(find("icon", award2Node)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this.setString(find("num", award2Node)!, "x" + award2[1]);
        let get2Node = find("get", award2Node)!;
        if (info && !info.a2) {
            get2Node.active = true;
        } else {
            get2Node.active = false;
        }

    }

    overMonthRet() {
        this.initUI();
    }

    updateSecond() {
        let nowTime = composeModel.getCurrentTimestamp();

        let tmpTime = new Date(nowTime);
        tmpTime.setMonth(tmpTime.getMonth() + 1);
        tmpTime.setDate(0);
        let monthDay = tmpTime.getDate();

        let monthStart = new Date(nowTime);
        monthStart.setDate(1);
        monthStart.setHours(0);
        monthStart.setMinutes(0);
        monthStart.setSeconds(0);
        monthStart.setMilliseconds(0);

        let addDayTime = monthDay * 24 * 60 * 60 * 1000;
        let monthEndTime = monthStart.getTime() + addDayTime;

        let dt = monthEndTime - nowTime;

        let timeStr = UtilPub.getDurationStr2(dt);
        this.setString(this.timeNode, timeStr);

    }

    onClickAward1(btn: Button) {
        // @ts-ignore
        let row = btn.node.row;
        let info = playerModel.getSeasonAwardInfoById(row.id);
        if (!info || info.a1) {
            return;
        }
        playerModel.seasonGetAward1(row.id);
        this.refreshAwardItem(btn.node.parent!, row);
    }

    onClickAward2(btn: Button) {
        // TODO 是否已解锁高级奖励

        // @ts-ignore
        let row = btn.node.row;
        let info = playerModel.getSeasonAwardInfoById(row.id);
        if (!info || info.a2) {
            return;
        }
        playerModel.seasonGetAward2(row.id);
        this.refreshAwardItem(btn.node.parent!, row);
    }

    onClickBtnClose() {
        this.close();

        // test
        // playerModel.saveDayTime = new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000);
        // playerModel.addSeasonScore(100);
        // this.refreshProgressBar();
    }

    onClickBtnHelp() {
        uiManager.instance.showDialog(Const.Dialogs.SeasonHelpLayer);
    }

    onClickBtnBuy() {
        uiManager.instance.showDialog(Const.Dialogs.SeasonBuyLayer);
    }

}

