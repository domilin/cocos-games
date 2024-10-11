import { _decorator } from "cc";
import { Const } from "../../config/Const";
import tables from "../../easyFramework/other/tables";

const { ccclass, property } = _decorator;

@ccclass('UtilRecharge')
export class UtilRecharge {

    public static doShopPay(shopid: number) {
        let curRecharge = tables.ins().getTableValueByID(Const.Tables.recharge, shopid)
        
    }
}