import { _decorator, Node, Label, find, Sprite, instantiate, v3, SpriteFrame, LabelOutline, color, Button, } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { RechargeManager } from '../../../Util/RechargeManager';
import { SignState, SignUtil } from '../../comm/SignUtil';

const { ccclass, property } = _decorator;


@ccclass('SignDialog')
export class SignDialog extends BaseView {
    @property({ type: Node }) dayRoot: Node = null!;
    @property({ type: Node }) dayItem: Node = null!;

    @property({ type: SpriteFrame }) bqFrame: SpriteFrame = null!;
    @property({ type: SpriteFrame }) yqdFrame: SpriteFrame = null!;

    @property({ type: Node }) btnReceive: Node = null!;


    _curSignDay = 0
    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
       // this.btnReceive.active = false
        this._curSignDay = SignUtil.getInstance().getCurSignDay()
        for (let i = 1; i <= 7; i++) {
            this.initDayItem(find("day" + i, this.dayRoot)!, i)
        }
    }

    initDayItem(dayParent: Node, day: number) {
        let data = tables.ins().getTableValueByID(Const.Tables.sign, day)
        let dayNode = dayParent.getChildByName("dayItem")
        if (dayNode == null) {
            dayNode = instantiate(this.dayItem)
            dayNode.position = v3(0, 0, 0)
            dayParent.addChild(dayNode)
        }

        let daytitle = dayNode.getChildByName("dayLabel")!.getComponent(Label)
        let numLabel = dayNode.getChildByName("numLabel")!.getComponent(Label)

        daytitle!.string = data.desc

        let icon = dayNode.getChildByName("icon")!
        let propId = data.reward[0]
        let num = data.reward[1]

        let propData = data.type == 1 ? tables.ins().getTableValueByID(Const.Tables.prop, propId) : tables.ins().getTableValueByID(Const.Tables.scene_skin, propId)

        if (data.type == 1) {
            numLabel!.string = "x" + num
            this.setSpriteFrame(icon.getComponent(Sprite)!, Const.resPath.icon + propData.icon, () => { }, 60)
        } else {
            numLabel!.string = propData.name
            this.setSpriteFrame(icon.getComponent(Sprite)!, Const.resPath.icon + propData.icon0, () => { }, 100)
        }

    
        find("qdbk", dayNode)!.active = false
        let signState = SignUtil.getInstance().getSignDay(day)
        if (signState == SignState.receiced) {
            find("signed", dayNode)!.active = true
            find("signed/yqd", dayNode)!.getComponent(Sprite)!.spriteFrame = this.yqdFrame
        } else if (signState == SignState.paseReceive) {
            find("signed", dayNode)!.active = true
            find("signed/yqd", dayNode)!.getComponent(Sprite)!.spriteFrame = this.bqFrame
        } else {
            if (signState == SignState.canReceive) {
                find("qdbk", dayNode)!.active = true
            }
            find("signed", dayNode)!.active = false
        }
        if (this._curSignDay == day) {
            this.initBtn(null, { day: day, signState: signState })
        }
        this.addButtonHander(dayNode, this.node, "SignDialog", "initBtn", { day: day, signState: signState })
    }

    initBtn(event: any, data: any) {
        let iconVideo = find("Layout/icon_video", this.btnReceive)!
        let btnLabel = find("Layout/Label", this.btnReceive)!.getComponent(Label)!

        if (data.signState == SignState.canReceive) {
            this.btnReceive.active = true
            this.btnReceive.getComponent(Sprite)!.grayscale = false
            iconVideo.active = false
            btnLabel.string = "领取"
            this.btnReceive.getComponent(Button)!.interactable = true
            this.addButtonHander(this.btnReceive, this.node, "SignDialog", "onClickReceive", data)
            btnLabel.node.getComponent(LabelOutline)!.color = color(68, 86, 9);
        } else if (data.signState == SignState.paseReceive) {
        this.btnReceive.active = true
            this.btnReceive.getComponent(Sprite)!.grayscale = false
            iconVideo.active = true
            btnLabel.string = "补签"
            this.btnReceive.getComponent(Button)!.interactable = true
            this.addButtonHander(this.btnReceive, this.node, "SignDialog", "onClickResign", data)
            btnLabel.node.getComponent(LabelOutline)!.color = color(68, 86, 9);
        } else if (data.signState == SignState.receiced) {
            this.btnReceive.getComponent(Sprite)!.grayscale = true
            iconVideo.active = false
            btnLabel.string = "已领取"
            btnLabel.node.getComponent(LabelOutline)!.color = color(86, 90, 74);
            this.btnReceive.getComponent(Button)!.interactable = false
            this.clearButtonHander(this.btnReceive)
        } else {
            this.btnReceive.getComponent(Sprite)!.grayscale = true
            iconVideo.active = false
            btnLabel.string = "明日可领取"
            btnLabel.node.getComponent(LabelOutline)!.color = color(86, 90, 74);
            this.btnReceive.getComponent(Button)!.interactable = false
            this.clearButtonHander(this.btnReceive)
        }
    }


    onClickReceive(event: any, data: any) {
        SignUtil.getInstance().signDay(data.day)
        this.initDayItem(find("day" + data.day, this.dayRoot)!, data.day)
        let signState = SignUtil.getInstance().getSignDay(data.day)
        this.initBtn(event,  { day: data.day, signState: signState })

        let signdata = tables.ins().getTableValueByID(Const.Tables.sign, data.day)
        signdata.reward[2] = signdata.type
        uiManager.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: [signdata.reward] })

    }

    onClickResign(event: any, data: any) {
        RechargeManager.showVideo("七日签到-补签", () => {
            this.onClickReceive(event, data)
        })
    }
}

