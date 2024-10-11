import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, ProgressBar, director, } from 'cc';
import { Const } from '../../../config/Const';
import { TujianState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { ScrollViewUtil } from '../../comm/ScrollViewUtil';
import { userData } from '../../comm/UserData';
import { PropItem, PropItemFlag } from './PropItem';

const { ccclass, property } = _decorator;



@ccclass('GrowUpDialog')
export class GrowUpDialog extends BaseView {
    @property({ type: Node, tooltip: "滚动列表" }) giftScroll: Node = null!;

    _giftData: any = []
    _isVip = false

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onEnable() {
        // console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        //  console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    show(args: any) {
        super.show(args)
        //   userData.setGetPropTujian(10005, Const.TujianState.geted)
        this.initData()
    }

    initData() {
        let giftData = tables.ins().getTable(Const.Tables.task_growUp)
        let arr2 = [...giftData]
        let arr = []
        while (arr2.length > 0) {
            arr.push(arr2.pop())
        }
        this._giftData = arr
        this.scrollViewSetData(this.giftScroll, arr, this.initItem, this)
        this.giftScroll.getComponent(ScrollViewUtil)!.scrollToEnd()

        this.scheduleOnce(() => {
            this.giftScroll.getComponent(ScrollViewUtil)?.updateItemZindex()
        }, 0.4)
        this.scheduleOnce(() => {
            this.giftScroll.getComponent(ScrollViewUtil)?.updateItemZindex()
        }, 0.7)

        if (GameStorage.getInt(Const.MoneyKeys.MoneyVip, 0) == 1) {
            find("root/btnBuyVip/Label", this.node)!.getComponent(Label)!.string = "尊贵Vip"
        } else {
            find("root/btnBuyVip/Label", this.node)!.getComponent(Label)!.string = "购买Vip"
        }

        ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MoneyVip))
    }

    onMessageEvent(value: any) {
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MoneyVip)
        if (data) {
            this._isVip = data.val == "1" || data.val == 1
            this.giftScroll.getComponent(ScrollViewUtil)?.refreshList()
            this.giftScroll.getComponent(ScrollViewUtil)?.updateItemZindex()
        }

    }

    initItem(itemUI: Node, item: any, index: number, self: any) {
        let lockLabel = itemUI.getChildByName("lockLabel")!.getComponent(Label)!
        itemUI.setSiblingIndex(1000 - index)
        console.log("self._isVip = ", self._isVip)
        if (userData.isGrowUpunLock(item.lv) == TujianState.unGet) {
            itemUI.getChildByName("btnReceive")!.active = false
            lockLabel.node.active = true
            lockLabel.string = "未解锁"
        } else if (self._isVip == false) {
            itemUI.getChildByName("btnReceive")!.active = false
            lockLabel.node.active = true
            lockLabel.string = "已解锁"
        } else if (self._isVip && userData.isGrowUpunLock(item.lv) == TujianState.geted) {
            itemUI.getChildByName("btnReceive")!.active = true
            lockLabel.node.active = false
        } else if (self._isVip && userData.isGrowUpunLock(item.lv) == TujianState.received) {
            itemUI.getChildByName("btnReceive")!.active = false
            lockLabel.node.active = true
            lockLabel.string = "已领取"
        }

        find("lvicon/Label", itemUI)!.getComponent(Label)!.string = item.lv
        let progress = find("ProgressBar", itemUI)!
        progress.active = index > 0

        if (userData.roleLv > item.lv) {
            if (index - 1 >= 0 && self._giftData[index - 1]) {
                let nextLevel = self._giftData[index - 1].lv
                if (userData.roleLv >= nextLevel) {
                    progress.getComponent(ProgressBar)!.progress = 1
                } else {
                    progress.getComponent(ProgressBar)!.progress = (userData.roleLv - item.lv) / (nextLevel - item.lv)
                }
            }
        } else {
            progress.getComponent(ProgressBar)!.progress = 0
        }

        self.addButtonHander(itemUI.getChildByName("btnReceive"), self.node, "GrowUpDialog", "onClickGet", item)
        find("Layout", itemUI)!.removeAllChildren()
        item.price.forEach((element: any, index: number) => {
            self.addPrefab(Const.Prefabs.PropItem, find("Layout", itemUI), (item: any) => {
                item.getComponent(PropItem).setData(element[0], PropItemFlag.TouchInfo | PropItemFlag.ShowNum, element[1])
                item.getComponent(PropItem).setSize(100)
            })
        });
    }

    onClickGet(event: any, item: any) {
        this.onVideoBack(item)
    }

    onVideoBack(item: any) {
        userData.setGrowUpState(item.lv, TujianState.received)
        userData.getProp(item.price, v3(0, 0, 0), v3(0, 0, 0))
        this.giftScroll.getComponent(ScrollViewUtil)?.refreshList()
        this.giftScroll.getComponent(ScrollViewUtil)?.updateItemZindex()
    }

    onClickBuyVip() {
        GameStorage.setInt(Const.MoneyKeys.MoneyVip, 1)
        this.initData()
    }
}

