import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find, size } from 'cc';
import { Const } from '../../../config/Const';
import { GoodsType, TujianState } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;



@ccclass('PropReceive')
export class PropReceive extends BaseView {
    @property({ type: Node }) icon: Node = null!;

    _propdata: any = null
    _propReward: any = null
    start() {
        this.initData()
    }

    initData() {
        if (this._layerData.key == Const.DataKeys.tujianProp) {
            let propdata = tables.ins().getTableValueByID(Const.Tables.prop, this._layerData.propId)
            let prop = propdata.reward.split(",")
            this._propdata = propdata
            this._propReward = prop
        } else {
            let skindata = tables.ins().getTableValueByID(Const.Tables.scene_skin, this._layerData.propId)
            let prop = skindata.reward.split(",")
            this.node.scale = v3(0.8, 0.8, 1)
            find("root", this.node)!.getComponent(UITransform)!.contentSize = size(200, 200 / 160 * 180)
            this._propdata = skindata
            this._propReward = prop
        }

        if (this._propReward[0] == GoodsType.Coin) {
            this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_coin", undefined, 120)
        } else if (this._propReward[0] == GoodsType.Diamonds) {
            this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_diamond", undefined, 120)
        } else if (this._propReward[0] == GoodsType.Power) {
            this.setSpriteFrame(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_power", undefined, 120)
        }
    }

    show(args: any) {
        super.show(args)
        //    this._propdata = this._layerData.propdata
    }

    onClickReceive(event: any) {
        audioManager.instance.playSound(Const.Audio.btn)

        let target = event.target!
        let pos = target.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        userData.setGetPropTujian(this._layerData.propId, TujianState.received, this._layerData.key);
        userData.getProp(this._propReward, pos, v3(0, 0, 0))
        if (this._propReward[0] == GoodsType.Coin) {
            tyqSDK.eventSendCustomEvent("图鉴-获得金币")
        } else if (this._propReward[0] == GoodsType.Diamonds) {
            tyqSDK.eventSendCustomEvent("图鉴-获得钻石")
        } else if (this._propReward[0] == GoodsType.Power) {
            tyqSDK.eventSendCustomEvent("图鉴-获得体力")
        }

        this.node.removeFromParent()

    }
}

