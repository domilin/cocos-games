import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { PriceType, GoodsType } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../../Util/RechargeManager';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;



@ccclass('ShopSynthesisItem')
export class ShopSynthesisItem extends BaseView {
    @property({ type: Node, tooltip: "背景" }) bg: Node = null!;
    @property({ type: Node, tooltip: "道具背景" }) itembg: Node = null!;

    @property({ type: Node, tooltip: "icon" }) icon: Node = null!;
    @property({ type: Label, tooltip: "数量" }) numLab: Label = null!;
    @property({ type: Label, tooltip: "价格" }) priceLab: Label = null!;


    @property({ type: Node }) tesubg: Node = null!;


    _priceType = 0
    _priceNum = 0
    _limitTime: any = null


    start() {
        this.setData(this._layerData.data, this._layerData.item)
    }

    show(args: any) {
        super.show(args)
    }

    setData(data: any, itemData: any) {

        this.icon.removeAllChildren()
        this.bg.getComponent(UITransform)!.width = itemData.length * 200
        if (itemData.length > 1) {
            this.bg.getComponent(Sprite)!.spriteFrame = null
            this.itembg.getComponent(Sprite)!.spriteFrame = null
        }
        this.tesubg.active = false
        for (let index = 0; index < itemData.length; index++) {
            const element = itemData[index];
            let itembg = null
            if (data.type == 5) {
                itembg = instantiate(this.tesubg)
                itembg.active = true
                this.icon.addChild(itembg)
                itembg.position = v3(0, 20, 0)
            }
            this.addPrefab(Const.Prefabs.PropItem, itembg || this.icon, (item: any) => {
                let flag = PropItemFlag.TouchInfo | PropItemFlag.HideName | PropItemFlag.HideBg
                if (element[1] > 1) {
                    flag |= PropItemFlag.ShowNum
                }
                item.getComponent(PropItem).setData(element[0], flag, element[1])
                item.getComponent(PropItem).setSize(150).setIconScale(1)
            })
        }

        let buyTime = 0
        if (data.cdKey > 0) {
            let privilegeData = tables.ins().getTableValueByKey(Const.Tables.privilege, "key", data.cdKey)
            if (data.type == 6) {
                buyTime = userData.getReceiveTime(privilegeData.dataKey + itemData[0][0], privilegeData.cdTime)
            } else {
                buyTime = userData.getReceiveTime(privilegeData.dataKey + data.id, privilegeData.cdTime)
            }
            this._limitTime = privilegeData
        } else {
            buyTime = userData.propBuyTime(data.id)
            this._limitTime = null
        }

        if (data.totalLimit > 0 && data.type != 5) {
            find("limitLabel", this.node)!.getComponent(Label)!.string = "剩余" + Math.max(0, data.totalLimit - buyTime) + "次"
            find("btnbg", this.node)!.active = buyTime < data.totalLimit
        } else {
            find("limitLabel", this.node)!.getComponent(Label)!.string = ""
            this.icon.position = this.itembg.position
        }


        let priceIcon = find("btnbg/Layout/prop_diamond1", this.node)!

        if (data.recharge && data.recharge > 0) {
            let rechargeData = tables.ins().getTableValueByID(Const.Tables.recharge, data.recharge)
            this.priceLab.string = "￥" + rechargeData.cash
            priceIcon.active = false

            if (data.typeson == 1) {
                if (data.totalLimit > 0 && buyTime >= data.totalLimit) {
                    find("btnbg", this.node)!.active = false
                }
            }
        } else {
            // let icon = find("btnbg/Layout/prop_diamond1", this.node)!
            let price2 = data.price2

            if (data.typeson == 4) {
                priceIcon.active = true
                let price = price2[0]
                this._priceType = PriceType.Coin
                this._priceNum = (price[1] + userData.propBuyTime(data.id) * price[2])
                this.priceLab.string = "X" + this._priceNum
            }

            if (data.typeson == 2 || data.typeson == 3) {
                if (buyTime >= data.totalLimit || price2[buyTime] == null) {
                    find("btnbg", this.node)!.active = false
                } else {
                    this._priceType = price2[buyTime][0]
                    this._priceNum = price2[buyTime][1]
                }
            }

            if (this._priceType == PriceType.Diamonds) {
                priceIcon.active = true
                this.setSpriteFrame(priceIcon.getComponent(Sprite)!, Const.resPath.icon_diamons, () => { }, 45)
                this.priceLab.string = "X" + this._priceNum
            } else if (this._priceType == PriceType.Coin) {
                priceIcon.active = true
                this.setSpriteFrame(priceIcon.getComponent(Sprite)!, Const.resPath.icon_coin, () => { }, 45)
                this.priceLab.string = "X" + this._priceNum
            } else if (this._priceType == PriceType.Free) {
                priceIcon.active = false
                this.priceLab.string = "免费"
            } else if (this._priceType == PriceType.Video) {
                priceIcon.active = true
                this.setSpriteFrame(priceIcon.getComponent(Sprite)!, Const.resPath.icon_video, () => { }, 45)
                this.priceLab.string = "免费"
            }

        }

        if (data.id == 18) {

            let hadnIdnex = composeModel.getHandIndex();
            if (hadnIdnex == handIndexs.shopbuy) {
                composeModel.closeHandLayer()
                let obj: any = {};
                obj.id = hadnIdnex;
                obj.node = this.node;
                obj.delayTime = 0.5;
                uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
            }
        }
    }

    onClickBuy(event: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        let targetPos: any = null
        if (event.target && event.target.parent) {
            targetPos = event.target.parent.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        }

        if (this._priceType == PriceType.Free) {
            tyqSDK.eventSendCustomEvent("免费领取肥啾存钱罐")
            this.onBuySuccessCB(targetPos)
        } else if (this._priceType == PriceType.Video) {
            //等待广告接入
            RechargeManager.showVideo("免费获得" + this._layerData.data.typename, () => {
                this.onBuySuccessCB(targetPos)
            })

        } else if (this._priceType == PriceType.Coin) {
            if (userData.checkAndUseCoin(this._priceNum)) {

                this.onBuySuccessCB(targetPos)
                this.emit(GD.event.updateMoney)
            } else {
                this.toast("金币不足")
            }
        } else if (this._priceType == PriceType.Diamonds) {
            if (userData.checkAndUseDiamonds(this._priceNum)) {
                this.onBuySuccessCB(targetPos)
                this.emit(GD.event.updateMoney)
            } else {
                this.toast("钻石不足")
            }
        } else if (this._priceType == PriceType.Dollar) {
            console.log("----等待支付接入")
            this.onBuySuccessCB(targetPos)
        }

    }


    onBuySuccessCB(targetPos: any) {

        let hadnIdnex = composeModel.getHandIndex();
        if (hadnIdnex == handIndexs.shopbuy) {
            composeModel.closeHandLayer()
            composeModel.addHandIndex()
        }
        let shopData = this._layerData.data
        let itemData = this._layerData.item

        for (let index = 0; index < itemData.length; index++) {
            let item = itemData[index];
            if (this._limitTime) {
                if (this._layerData.data.type == 6) {
                    userData.setReceiveTime(this._limitTime.dataKey + itemData[0][0], this._limitTime.cdTime)
                } else {
                    userData.setReceiveTime(this._limitTime.dataKey + shopData.id, this._limitTime.cdTime)
                }
            } else {
                userData.addPropBuyTime(shopData.id)
            }
            composeModel.addPropNum(item[0], item[1], targetPos)

            let propRow = tables.ins().getTableValueByID(Const.Tables.prop, item[0]);
            if (propRow) {
                if (this._priceType == PriceType.Coin) {
                    tyqSDK.eventSendCustomEvent("金币-购买" + propRow.name)
                } else if (this._priceType == PriceType.Diamonds) {
                    tyqSDK.eventSendCustomEvent("钻石-购买" + propRow.name)
                } else if (this._priceType == PriceType.Free) {
                    tyqSDK.eventSendCustomEvent("免费领取" + propRow.name)
                }
            }

        }

        this.setData(this._layerData.data, this._layerData.item)
    }
}

