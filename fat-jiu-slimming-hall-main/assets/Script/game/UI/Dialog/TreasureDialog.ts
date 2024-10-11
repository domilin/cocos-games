import { _decorator, Node, Label, ScrollView, find, Sprite, instantiate, Vec3, ProgressBar, Button, LabelOutline, color, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../../Util/RechargeManager';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { PropItem, PropItemFlag } from './PropItem';
import { TreasureModel } from './TreasureModel';

const { ccclass, property } = _decorator;



@ccclass('TreasureDialog')
export class TreasureDialog extends BaseView {
    @property({ type: Node }) giftScroll: Node = null!;
    @property({ type: Node }) giftScrollView: Node = null!;

    @property({ type: Node }) item: Node = null!;
    @property({ type: Node }) timeLabel: Node = null!;


    start() {
        this.bindButton(find("root/node/btnClose", this.node)!, this.close)
        this.bindButton(find("root/node/Node/btnReflesh", this.node)!, this.onClickBtnReflesh)
    }

    show(args: any) {
        super.show(args)
        tyqSDK.eventSendCustomEvent("查看阿宝的货车")
        this.timeLabel.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, TreasureModel.timeData.key, TreasureModel.timeData.cdTime)
        TreasureModel.initLimitData(false)

        this.initProgress()
        this.giftScroll.removeAllChildren()
        for (let index = 0; index < 6; index++) {
            let itemNode = instantiate(this.item)
            itemNode.parent = this.giftScroll
            itemNode.position = Vec3.ZERO
            this.initItem(itemNode, index)
        }

        this.giftScrollView.getComponent(ScrollView)!.scrollToTop(0)
    }

    initProgress() {
        let receicedNum = TreasureModel.receiveNum

        let labelPro = find("root/node/Node/labelPro", this.node)!.getComponent(Label)!
        let progressBar = find("root/node/Node/progressBar", this.node)!.getComponent(ProgressBar)!
        let btnReceive = find("root/node/Node/btnReceive", this.node)!

        let btnReflesh = find("root/node/Node/btnReflesh", this.node)!

        find("Layout/icon_video", btnReflesh)!.active = TreasureModel.treasureData.freeReflesh >= 1

        labelPro.string = receicedNum + "/6"
        progressBar.progress = receicedNum / 6

        if (receicedNum >= 6) {
            btnReflesh.getComponent(Sprite)!.grayscale = true
            this.bindButton(btnReflesh, () => { })
            find("Layout/Label", btnReflesh)!.getComponent(LabelOutline)!.color = color(97, 100, 68, 255)
        } else {
            btnReflesh.getComponent(Sprite)!.grayscale = false
            find("Layout/Label", btnReflesh)!.getComponent(LabelOutline)!.color = color(68, 86, 9, 255)
        }

        if (receicedNum >= 6 && !TreasureModel.isReceiveGift) {
            btnReceive.getComponent(Sprite)!.grayscale = false
            btnReceive.getComponent(Button)!.interactable = true
            find("Label", btnReceive)!.getComponent(LabelOutline)!.color = color(68, 86, 9, 255)
        } else {
            btnReceive.getComponent(Sprite)!.grayscale = true
            btnReceive.getComponent(Button)!.interactable = false
            find("Label", btnReceive)!.getComponent(LabelOutline)!.color = color(80, 80, 80, 180)
        }
    }

    initItem(itemUI: Node, index: number) {
        let prop1 = find("PropItem1", itemUI)!.getComponent(PropItem)!
        prop1.setData(TreasureModel.treasureData.bao1[index].id, PropItemFlag.ShowNum | PropItemFlag.HideName | PropItemFlag.TouchInfo, 1)
        let prop2 = find("PropItem2", itemUI)!.getComponent(PropItem)!
        prop2.setData(TreasureModel.treasureData.bao2[index].id, PropItemFlag.ShowNum | PropItemFlag.HideName | PropItemFlag.TouchInfo, 1)

        let btnReceive = find("btnbg", itemUI)!
        let labelReceive = find("labelReceive", itemUI)!
        if (TreasureModel.treasureData.receive[index] == 1) {
            labelReceive.active = true
            btnReceive.active = false
            find("root/glan", prop1.node)!.active = false
        } else {
            labelReceive.active = false
            btnReceive.active = true
            let hasInfo = composeModel.getRoomDataHasInfoById(TreasureModel.treasureData.bao1[index].id);
            let showNum = hasInfo.num;
            if (showNum > 0) {
                btnReceive.getComponent(Sprite)!.grayscale = false
                this.addButtonHander(btnReceive, this.node, "TreasureDialog", "onClickGet", index)
                find("root/glan", prop1.node)!.active = true
                find("Label", btnReceive)!.getComponent(LabelOutline)!.color = color(68, 86, 9, 255)
            } else {
                btnReceive.getComponent(Sprite)!.grayscale = true
                find("root/glan", prop1.node)!.active = false
                find("Label", btnReceive)!.getComponent(LabelOutline)!.color = color(80, 80, 80, 180)

            }
        }


    }

    onClickGet(event: any, index: any) {
        composeModel.consumeProp(TreasureModel.treasureData.bao1[index].id, 1)
        composeModel.addPropNum(TreasureModel.treasureData.bao2[index].id, 1)
        TreasureModel.treasureData.receive[index] = 1
        TreasureModel.saveTreasureData()
        this.initItem(event.target.parent, index)
        this.initProgress()
        this.emit(GD.event.updateTreasure)
    }

    onClickBtnReflesh() {
        let reflesh = () => {
            TreasureModel.initLimitData(true)
            this.giftScroll.removeAllChildren()
            for (let index = 0; index < 6; index++) {
                let itemNode = instantiate(this.item)
                itemNode.parent = this.giftScroll
                itemNode.position = Vec3.ZERO
                this.initItem(itemNode, index)
            }
        }
        if (TreasureModel.treasureData.freeReflesh < 1) {
            reflesh()
            TreasureModel.treasureData.freeReflesh++
            TreasureModel.saveTreasureData()
        } else {
            RechargeManager.showVideo("刷新阿宝的货车", reflesh)
        }

    }

    onClickBtnAllReceive() {
        TreasureModel.receiveGift = 1
        composeModel.addPropNum(901, 1)
        this.initProgress()
    }

    dealClickItem() {

    }

    onVideoBack(item: any) {

    }


}

