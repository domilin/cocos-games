import { _decorator, Label, find, Node, System, game, EditBox } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import tables from '../../../easyFramework/other/tables';
import { composeModel } from '../../comm/composeModel';
import { UtilScene } from '../../comm/UtilScene';

const { ccclass, property } = _decorator;

@ccclass('DebugDialog')
export class DebugDialog extends BaseView {
    @property({ type: Node }) list: Node = null!


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.close)
        this.bindButton(find("root/layout/btnClear", this.node)!, this.onClickClearAll)
        this.bindButton(find("root/layout/btnExportScene", this.node)!, this.onClickExportScene)
    }

    show(args: any) {
        super.show(args)
        this.initData()
        //userData.diamonds += 10000
    }

    initData() {
        let setData = tables.ins().getTable(Const.Tables.setting)
        this.scrollViewSetData(this.list, setData, this.initItem, this)
    }

    initItem(itemUI: Node, item: any, index: number, self: any) {
        itemUI.getChildByName("name")!.getComponent(Label)!.string = item.ps
        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage.getInt(item.key, 0) + ""
        itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.placeholder = item.editValue
        itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string = item.editValue
        if (item.type == 1) {
            self.addButtonHander(itemUI.getChildByName("jianbtn")!, self.node, "DebugDialog", "jianshaoNum", [item, itemUI])
            self.addButtonHander(itemUI.getChildByName("addbtn")!, self.node, "DebugDialog", "addNum", [item, itemUI])
        } else {
            self.addButtonHander(itemUI.getChildByName("addbtn")!, self.node, "DebugDialog", "addProp", [item, itemUI])
        }
    }

    onClickClearAll() {
        ServerCtrJSF.GetInstance().reqUploadEmptyRecord()
        this.scheduleOnce(() => {
            game.end()
        }, 1.2)
    }

    onClickExportScene() {
        UtilScene.exportAllItems()
    }

    jianshaoNum(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]
        GameStorage.setInt(item.key, GameStorage.getInt(item.key) - parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string))
        this.emit(GD.event.updateMoney)
        //  this.initData()

        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage.getInt(item.key, 0) + ""


    }

    addNum(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]
        GameStorage.setInt(item.key, GameStorage.getInt(item.key) + parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string))
        this.emit(GD.event.updateMoney)
        // this.initData()
        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage.getInt(item.key, 0) + ""

    }

    addProp(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]

        let propId = parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string)
        let propData = tables.ins().getTableValueByID(Const.Tables.prop, propId)
        if (propData) {
            composeModel.addPropNum(propId, 1)
        } else {
            this.toast("道具ID 有误")
        }
    }
}

