import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, VideoPlayer, Root, ProgressBar, instantiate, Vec3, Layout, Color, UIOpacity, Prefab, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState, TujianState } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { redPointManager, RPointEvent } from '../../comm/RedPointManager';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { PropItem, PropItemFlag } from './PropItem';
import { ScrollViewUtil } from "../../comm/ScrollViewUtil";
import { PropReceive } from './PropReceive';

const { ccclass, property } = _decorator;



@ccclass('TujianDialog')
export class TujianDialog extends BaseView {
    @property({ type: Node, tooltip: "图鉴列表" }) tujianScroll: Node = null!;
    @property({ type: Node, tooltip: "图鉴列表详情" }) tujianInfoScroll: Node = null!;
    @property({ type: Node, tooltip: "icon" }) layerPool: Node = null!;
    @property({ type: Node, tooltip: "skinItem" }) skinItem: Node = null!;


    @property({ type: Node }) btnItem: Node = null!;
    @property({ type: Node }) btndress: Node = null!;

    @property({ type: Prefab }) propItem: Prefab = null!;



    _propdata: any = null

    _curListType: any = null

    start() {


    }

    show(args: any) {
        super.show(args)
        this.layerPool.position = v3(285, 0, 0)
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.initElementArr()
        tyqSDK.eventSendCustomEvent("查看道具图鉴")
        redPointManager.setRedpoint(this.btnItem, RPointEvent.RPM_TujianProp, false)
        redPointManager.setRedpoint(this.btndress, RPointEvent.RPM_TujianScene, false)
        //userData.setGetPropTujian(10005, TujianState.geted)

    }

    initElementArr() {
        this.tujianScroll.getChildByName("view")!.active = true
        let tujiandata = userData.TujianArr
        this.scrollViewSetData(this.tujianScroll, tujiandata, this.initItem, this)
    }

    initDressArr() {
        this.tujianScroll.getChildByName("view")!.active = true

        let tujiandata = userData.TujianSceneArr
        this.scrollViewSetData(this.tujianScroll, tujiandata, this.initDressItem, this)
    }

    initItem(itemUI: Node, item: any, index: number, self: any) {
        itemUI.getChildByName("title")!.getComponent(Label)!.string = "" + item.typename
        itemUI.getChildByName("info")!.getComponent(Label)!.string = "" + item.mask1
        self.addButtonHander(itemUI, self.node, "TujianDialog", "openTujianArr", item)
        UtilPub.getPic(Const.resPath.icon + item.icon, (sf: SpriteFrame) => {
            itemUI.getChildByName("icon")!.getComponent(Sprite)!.spriteFrame = sf
            UtilPub.setCustomSize(itemUI.getChildByName("icon")!, 110)
        })
        let propData = tables.ins().getTableValuesByType(Const.Tables.prop, "type", item.type)
        let totalNum = 0
        let getNum = 0

        propData.forEach(element => {
            totalNum++
            if (userData.isGetPropTujian(element.id) != TujianState.unGet) {
                getNum++
            }
        });

        let progressBar = find("ProgressBar", itemUI)!.getComponent(ProgressBar)
        progressBar!.progress = getNum / totalNum

        find("getLabel", itemUI)!.getComponent(Label)!.string = getNum + "/" + totalNum

        redPointManager.setRedpointFix(itemUI, RPointEvent.RPM_Null, userData.checkTujianRedPoint(item.type))
    }

    openTujianArr(event: any, data: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        this._curListType = data.type
        //  let content = find("view/content", this.tujianInfoScroll)!
        this.tujianInfoScroll.getChildByName("view")!.active = true
        this.initList()
        tween(this.layerPool).to(0.2, { position: v3(-285, 0, 0) }).call(() => {
            this.tujianScroll.getChildByName("view")!.active = false
        }).start()
    }

    initList() {
        let propData = tables.ins().getTableValuesByType(Const.Tables.prop, "type", this._curListType)
        let dataArr: any = []
        propData.forEach(element => {
            if (!dataArr[element.typeson - 1]) {
                dataArr[element.typeson - 1] = []
            }
            dataArr[element.typeson - 1].push(element)
        });

        let newArr = []
        for (let i = 0; i < dataArr.length; i++) {
            newArr.push(dataArr[i][0].sonname + "")
            let arr: any = []
            let num = 0

            for (let index = 0; index < dataArr[i].length; index++) {
                const element = dataArr[i][index];
                arr.push(element)
                num++
                if (num >= 4 || index == dataArr[i].length - 1) {
                    newArr.push(arr)
                    arr = []
                    num = 0
                }
            }

        }
        let content = find("view/content", this.tujianInfoScroll)!
        content.getComponent(Layout)!.spacingY = 10

        this.scrollViewSetData(this.tujianInfoScroll, newArr, this.initItemInfo2, this)
        //  let content = find("view/content", this.tujianInfoScroll)!
        // content!.destroyAllChildren()
        //  content!.active = false
        // this.setScrollViewData(content!, dataArr, find("root/Layout", this.node)!, this.initItemInfo, this)
        //   content!.active = true
    }

    initItemInfo2(itemUI: Node, itemData: any, index: number, self: TujianDialog) {
        //  console.log("itemData = ", itemData)
        let title = itemUI.getChildByName("titl2")!
        let layer = itemUI.getChildByName("Layout")!

        if (typeof (itemData) == "string") {
            title.active = true
            title.getChildByName("title")!.getComponent(Label)!.string = itemData + ""
            title.getChildByName("title")!.position = v3(0, 0, 0)
            title.getChildByName("titl2")!.position = v3(0, 0, 0)
            layer.active = false
        } else {
            title.active = false
            layer.active = true

            if (itemData.length > 0) {
                // itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].sonname + ""
                let layer = itemUI.getChildByName("Layout")!
                for (let index = 0; index < 4; index++) {
                    let item = layer.getChildByName("propItem" + index)!
                    if (item)
                        item.active = false

                    item = layer.getChildByName("skinNode" + index)!
                    if (item)
                        item.active = false
                }
                // layer!.removeAllChildren()
                layer.getComponent(Layout)!.spacingX = 40
                // layer.getComponent(Layout)!.constraintNum = 4
                // layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
                for (let index = 0; index < itemData.length; index++) {
                    const element = itemData[index];
                    let item = layer.getChildByName("propItem" + index)!
                    if (item == null) {
                        item = instantiate(self.propItem)!
                        item!.parent = layer
                        item!.name = "propItem" + index
                    }
                    let propReceive = find("root/PropReceive", item)!
                    if (propReceive) {
                        propReceive.active = false
                    }
                    item.active = true
                    if (userData.isGetPropTujian(element.id) == TujianState.received) {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                    } else if (userData.isGetPropTujian(element.id) == TujianState.geted) {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                        if (propReceive == null) {
                            self.addPrefab(Const.Prefabs.PropReceive, item.getChildByName("root")!, undefined, { propId: element.id, key: Const.DataKeys.tujianProp })
                        } else {
                            propReceive.getComponent(PropReceive)!._layerData = { propId: element.id, key: Const.DataKeys.tujianProp }
                            propReceive.getComponent(PropReceive)!.initData()
                            propReceive.active = true
                        }
                    } else {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideInfo)
                    }
                    item!.getComponent(PropItem)!.setSize(100).setItemBg(2)
                    if (index != itemData.length - 1 && (index + 1) % 4 != 0) {
                        let jiantou = item.getChildByName("jiantou")!
                        if (jiantou == null) {
                            jiantou = self.createSprite(Const.resPath.Tujian + "an1")
                            jiantou.name = "jiantou"
                            jiantou.scale = v3(1.2, 1.2, 1)
                            jiantou.position = v3(70, 0, 1)
                            item.addChild(jiantou)
                        }
                    }
                }
            }
        }

    }

    initItemInfo(itemUI: Node, itemData: any, index: number, self: any) {
        //  console.log("itemData = ", itemData)
        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].sonname + ""
            let layer = itemUI.getChildByName("Layout")!
            layer!.removeAllChildren()
            layer.getComponent(Layout)!.spacingX = 40
            layer.getComponent(Layout)!.constraintNum = 4
            layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                self.addPrefab(Const.Prefabs.PropItem, layer!, (item: any) => {
                    if (userData.isGetPropTujian(element.id) == TujianState.received) {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                    } else if (userData.isGetPropTujian(element.id) == TujianState.geted) {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                        self.addPrefab(Const.Prefabs.PropReceive, item.getChildByName("root"), null, { propId: element.id, key: Const.DataKeys.tujianProp })
                    } else {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideInfo)
                    }
                    item.getComponent(PropItem).setSize(100).setItemBg(2)
                    if (index != itemData.length - 1 && (index + 1) % 4 != 0) {
                        let jiantou = self.createSprite(Const.resPath.Tujian + "an1")
                        jiantou.scale = v3(1.2, 1.2, 1)
                        jiantou.position = v3(70, 0, 1)
                        item.addChild(jiantou)
                    }
                })
            }
        }
    }


    initDressItem(itemUI: Node, item: any, index: number, self: TujianDialog) {
        itemUI.getChildByName("title")!.getComponent(Label)!.string = "" + item.name
        itemUI.getChildByName("info")!.getComponent(Label)!.string = "" + item.desc


        let icon = item.tujianIcon
        if (icon == "") {
            icon = "icon_" + item.id
        }
        self.setSpriteFrame(find("icon", itemUI)!.getComponent(Sprite)!, UtilScene.getResSceneIcon(icon), undefined, 120)
        //   TujianDialog.setSkinIcon(find("icon", itemUI)!.getComponent(Sprite)!, item)
        // self.setSpriteFrame(find("icon", itemUI)!.getComponent(Sprite), "", 110)
        self.addButtonHander(itemUI, self.node, "TujianDialog", "openSceneTujianArr", item)

        let totalNum = 0
        let getNum = 0
        let isCanReceive = false
        let propData = tables.ins().getTableValuesByType(Const.Tables.scene_item, "room", item.id)

        propData.forEach(element => {
            let skinData = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", element.id)
            skinData.forEach(skin => {
                let index = skin.id % element.id
                if (index > 0) {
                    totalNum++

                    if (userData.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) != TujianState.unGet) {
                        getNum++
                        if (userData.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                            isCanReceive = true
                        }
                    }
                }
            })
        });

        let progressBar = find("ProgressBar", itemUI)!.getComponent(ProgressBar)
        progressBar!.progress = getNum / totalNum

        find("getLabel", itemUI)!.getComponent(Label)!.string = getNum + "/" + totalNum
        redPointManager.setRedpointFix(itemUI, RPointEvent.RPM_Null, isCanReceive)
    }

    openSceneTujianArr(event: any, data: any) {
        audioManager.instance.playSound(Const.Audio.btn)
        this._curListType = data
        // let content = find("view/content", this.tujianInfoScroll)!
        // content!.active = false
        this.tujianScroll.getChildByName("view")!.active = false
        this.initSceneList()

        tween(this.layerPool).to(0.2, { position: v3(-285, 0, 0) }).call(() => {
            this.tujianInfoScroll.getChildByName("view")!.active = true
        }).start()
    }

    initSceneList() {
        let propData = tables.ins().getTableValuesByType(Const.Tables.scene_item, "room", this._curListType.id)
        let dataArr: any = []
        // for (let i = 1; i <= 3; i++) {
        //     if (!dataArr[i]) {
        //         dataArr[i] = []
        //     }
        // }
        propData.forEach(element => {
            let skinData = tables.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", element.id)
            skinData.forEach(skin => {
                let index = skin.tujianId
                if (index > 0) {
                    if (!dataArr[index]) {
                        dataArr[index] = []
                    }
                    dataArr[index].push(skin)
                }
            })
        });

        let newArr = []
        for (let i = 1; i < dataArr.length; i++) {
            newArr.push(this._curListType.tujianName[i - 1])

            let arr: any = []
            let num = 0
            if (dataArr[i]) {
                for (let index = 0; index < dataArr[i].length; index++) {
                    const element = dataArr[i][index];
                    arr.push(element)
                    num++
                    if (num >= 3 || index == dataArr[i].length - 1) {
                        newArr.push(arr)
                        arr = []
                        num = 0
                        newArr.push([])
                    }
                }
            }
        }
        let content = find("view/content", this.tujianInfoScroll)!
        content.getComponent(Layout)!.spacingY = 0
        this.scrollViewSetData(this.tujianInfoScroll, newArr, this.initSkinInfo2, this)
        // content!.destroyAllChildren()
        // //  content!.active = false
        // this.setScrollViewData(content!, dataArr, find("root/Layout", this.node)!, this.initSkinInfo, this)
        // content!.active = true
    }

    initSkinInfo2(itemUI: Node, itemData: any, index: number, self: any) {
        // console.log("itemData = ", itemData)
        let title = itemUI.getChildByName("titl2")!
        let layer = itemUI.getChildByName("Layout")!

        if (typeof (itemData) == "string") {
            title.active = true
            title.getChildByName("title")!.getComponent(Label)!.string = itemData + ""
            title.getChildByName("title")!.position = v3(0, 44, 0)
            title.getChildByName("titl2")!.position = v3(0, 40, 0)
            layer.active = false
        } else {
            title.active = false
            layer.active = true

            // layer!.removeAllChildren()
            // layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            layer.getComponent(Layout)!.spacingX = 20
            // layer.getComponent(Layout)!.constraintNum = 3
            for (let index = 0; index < 4; index++) {
                let item = layer.getChildByName("propItem" + index)!
                if (item)
                    item.active = false

                item = layer.getChildByName("skinNode" + index)!
                if (item)
                    item.active = false
            }

            if (itemData.length > 0) {
                itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = self._curListType.tujianName[index - 1] + ""

                for (let index = 0; index < itemData.length; index++) {
                    const element = itemData[index];
                    let skinNode = layer.getChildByName("skinNode" + index)!
                    if (skinNode == null) {
                        skinNode = instantiate(self.skinItem)
                        skinNode.name = "skinNode" + index
                        skinNode.position = Vec3.ZERO;
                        layer!.addChild(skinNode)
                    }
                    skinNode.active = true
                    find("name", skinNode)!.getComponent(Label)!.string = element.name
                    let iconSprite = find("icon", skinNode)!.getComponent(Sprite)!
                    UtilScene.setSkinIcon(iconSprite, element)

                    let propReceive = find("PropReceive", skinNode)!
                    if (propReceive) {
                        propReceive.active = false
                    }

                    if (userData.isGetPropTujian(element.id, Const.DataKeys.tujianScene) == TujianState.received) {
                        iconSprite.color = Color.WHITE
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                    } else if (userData.isGetPropTujian(element.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                        iconSprite.color = Color.WHITE
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 255

                        if (propReceive == null) {
                            self.addPrefab(Const.Prefabs.PropReceive, skinNode, null, { propId: element.id, key: Const.DataKeys.tujianScene })
                        } else {
                            propReceive.getComponent(PropReceive)!._layerData = { propId: element.id, key: Const.DataKeys.tujianScene }
                            propReceive.getComponent(PropReceive)!.initData()
                            propReceive.active = true
                        }

                    } else {
                        iconSprite.color = Color.BLACK
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 120
                    }

                    self.bindButton(skinNode, () => {
                        uiManager.instance.showDialog(Const.Dialogs.scene_ui_skin_detailList, { skinId: element.id })
                    })
                }
            }
        }
    }


    initSkinInfo(itemUI: Node, itemData: any, index: number, self: any) {
        //  console.log("itemData = ", itemData)
        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = self._curListType.tujianName[index - 1] + ""
            let layer = itemUI.getChildByName("Layout")!
            layer!.removeAllChildren()
            layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            layer.getComponent(Layout)!.spacingX = 20
            layer.getComponent(Layout)!.constraintNum = 3

            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                let skinNode = instantiate(self.skinItem)
                skinNode.active = true
                skinNode.position = Vec3.ZERO;
                layer!.addChild(skinNode)
                find("name", skinNode)!.getComponent(Label)!.string = element.name
                let iconSprite = find("icon", skinNode)!.getComponent(Sprite)!
                UtilScene.setSkinIcon(iconSprite, element)

                if (userData.isGetPropTujian(element.id, Const.DataKeys.tujianScene) == TujianState.received) {
                    iconSprite.color = Color.WHITE
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                } else if (userData.isGetPropTujian(element.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                    iconSprite.color = Color.WHITE
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                    self.addPrefab(Const.Prefabs.PropReceive, skinNode, null, { propId: element.id, key: Const.DataKeys.tujianScene })
                } else {
                    iconSprite.color = Color.BLACK
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 120
                }

                self.bindButton(skinNode, () => {
                    uiManager.instance.showDialog(Const.Dialogs.scene_ui_skin_detailList, { skinId: element.id })
                })
            }
        }
    }

    closeTujianArr() {
        this.tujianScroll.getChildByName("view")!.active = true
        tween(this.layerPool).to(0.2, { position: v3(285, 0, 0) }).call(() => {
            this.tujianInfoScroll.getChildByName("view")!.active = true
        }).start()
        this.tujianScroll.getComponent(ScrollViewUtil)!.refreshList()

    }

    public static setSkinIcon(node: Sprite, skinData: any) {
        let icon = skinData.tujianIcon
        if (icon == "") {
            icon = "icon_" + skinData.id
        }
        UtilPub.getPic(UtilScene.getResSceneIcon(icon), (sf: SpriteFrame) => {
            if (sf != null) {
                node.spriteFrame = sf
            } else {
                UtilPub.getPic(Const.resPath.defaultSceneIcons + "icon_default", (sf: SpriteFrame) => {
                    node.spriteFrame = sf
                })
            }
        })
    }
}


