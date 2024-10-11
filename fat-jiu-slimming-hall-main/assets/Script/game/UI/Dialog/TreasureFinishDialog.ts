import { _decorator, Node, Label, ScrollView, find, Sprite, instantiate, Vec3, ProgressBar, Button, } from 'cc';
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



@ccclass('TreasureFinishDialog')
export class TreasureFinishDialog extends BaseView {

    @property({ type: Node }) timeLabel: Node = null!;


    start() {
        this.bindButton(find("root/node/btnClose", this.node)!, this.close)
        this.bindButton(find("root/node/btnSure", this.node)!, this.close)

    }

    show(args: any) {
        super.show(args)
        this.timeLabel.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, TreasureModel.timeData.key, TreasureModel.timeData.cdTime)
    }



}

