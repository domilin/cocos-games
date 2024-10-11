import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, TiledUserNodeData, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { RechargeManager } from '../../../Util/RechargeManager';
import { userData } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('RefleshDialog')
export class RefleshDialog extends BaseView {

    @property({ type: Node }) timeLabel: Node = null!;

    _isCanFlesh = false
    _cdData: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        let itemData = this._layerData.itemData
        let cdData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", itemData.cdKey)
        this._cdData = cdData
        let time = userData.getReceiveTime(cdData.dataKey + "auto", 1440)
        this.timeLabel.getComponent(Label)!.string = (itemData.autoReflesh - time) + "/" + itemData.autoReflesh
        this._isCanFlesh = time < itemData.autoReflesh
    }


    onClickBtnVideoReflesh() {
        audioManager.instance.playSound(Const.Audio.btn)
        if (this._isCanFlesh) {
            RechargeManager.showVideo("刷新商店限时商品", () => {
                userData.setReceiveTime(this._cdData.dataKey + "auto", 1440)
                this.emit(GD.event.updateShopItem)
                this.close()
            })
        } else {
            this.toast("今日刷新次数已用完")
        }
    }

    onClickDiamonsReflesh() {
        audioManager.instance.playSound(Const.Audio.btn)
        if (userData.checkAndUseDiamonds(Const.LimitShopRefleshPrice)) {
            this.emit(GD.event.updateShopItem)
            this.emit(GD.event.updateMoney)
            this.close()
        } else {
            this.toast("钻石不足")
        }
    }

}

