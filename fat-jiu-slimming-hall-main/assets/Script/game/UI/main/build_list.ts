import { find, Label, Node, Prefab, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { poolManager } from '../../../easyFramework/mgr/poolManager';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { build_list_item } from './build_list_item';
const { ccclass, property } = _decorator;

@ccclass('build_list')
export class build_list extends BaseView {
    get titleLabel() { return find("root/window/titleLabel", this.node)!.getComponent(Label)! }
    get topLabel() { return find("root/window/top/star/topLabel", this.node)!.getComponent(Label)! }
    get closeBtn() { return find("root/window/btnClose", this.node)! }
    get starLabel() { return find("root/window/top/star/btnBg/starLayout/starLabel", this.node)!.getComponent(Label)! }
    get buildListLayout() { return find("root/window/sview/mask/build_list", this.node)! }

    items: Node[] = []

    onLoad() {
        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.bindButton(this.closeBtn, () => {
            this.close()
        })
    }

    chgGreenStar() {
        this.starLabel.string = userData.greenStar + ""
    }

    show(args: any) {
        super.show(args)
        this.reload()
        tyqSDK.eventSendCustomEvent("查看建造清单")
    }

    reload() {
        this.chgGreenStar()
        poolManager.instance.putNodeArr(this.items)
        let needShowRooms = UtilScene.getNeedShowStarRooms()
        //生成对应的对象
        UtilPub.getPrefab(Const.Prefabs.build_list_item, (p: Prefab) => {
            needShowRooms.forEach((row: any) => {
                let item = poolManager.instance.getNode(p, this.buildListLayout)!
                item.getComponent(build_list_item)!.init(row.id)
                this.items.push(item)
            })

            let handIndex = composeModel.getHandIndex();
            if (handIndex == handIndexs.btnBuild) {
                composeModel.addHandIndex();
                let obj: any = {};
                obj.id = composeModel.getHandIndex();
                let btnGo = find("root/mid/goBtn", this.buildListLayout.children[0]);
                obj.node = btnGo;
                obj.delayTime = 0.5;
                uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
                composeModel.addHandIndex();
            }
        })
    }




}


