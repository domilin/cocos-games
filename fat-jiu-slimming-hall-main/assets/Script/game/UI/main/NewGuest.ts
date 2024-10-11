import { find, Label, Node, Prefab, sp, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import tables from '../../../easyFramework/other/tables';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
const { ccclass, property } = _decorator;

@ccclass('NewGuest')
export class NewGuest extends BaseView {
    @property({ type: Label }) titlelabel: Label = null!
    @property({ type: Label }) infoLabel: Label = null!

    @property({ type: sp.Skeleton }) guestSpine: sp.Skeleton = null!

    onLoad() {
        this.bindButton(find("btnSure", this.node)!, () => {
            this.close()
        })
    }


    show(args: any) {
        super.show(args)
        this.initInfo(this._layerData.id)

    }

    initInfo(id: number) {
        let guestData = tables.ins().getTableValueByID(Const.Tables.scene_guest, id)
        this.titlelabel.string = guestData.name
        this.infoLabel.string = guestData.desc

        tyqSDK.eventSendCustomEvent("解锁新肥鹅-" + guestData.name)

        resourceUtil.loadResWithBundle( guestData.sp, sp.SkeletonData, (err, skedata) => {
            this.guestSpine.skeletonData = skedata;
            this.guestSpine.setSkin("skin1")
            this.guestSpine.setAnimation(0, "idle1", true);
        })
    }



}


