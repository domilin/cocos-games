import { find, Label, ProgressBar, sp, Sprite, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GISceneItemParent, GLockState, GSceneRoomState, GSceneSkinState } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { PropItem, PropItemFlag } from '../Dialog/PropItem';
import { flash_star } from './flash_star';
const { ccclass, property } = _decorator;

@ccclass('build_prompt')
export class build_prompt extends BaseView {
    //星星
    get starNode() { return find("root/LayoutLeft/buildList/star", this.node)! }
    get spineAni() { return find("root/spineAni", this.node)!.getComponent(sp.Skeleton)! }
    get btnClose() { return find("root/btnClose", this.node)! }

    //顶部的星星数
    get starLabel() { return find("root/LayoutLeft/buildList/starLabel", this.node)!.getComponent(Label)! }
    //顶部道具标题
    get titleLabel() { return find("root/titleLabel", this.node)!.getComponent(Label)! }

    //礼物按钮，建造进度
    get gift() { return find("root/topBg/gift", this.node)! }
    get roomBar() { return find("root/topBg/roomBar", this.node)!.getComponent(ProgressBar)! }
    get roomBarLabel() { return find("root/topBg/roomBar/roomBarLabel", this.node)!.getComponent(Label)! }

    //右边奖励和建造按钮
    get rewards() { return find("root/bgIcon/rewards", this.node)! }
    get btnBuild() { return find("root/bgIcon/btnBuild", this.node)! }
    get goToCompose() { return find("root/bgIcon/goToCompose", this.node)! }
    get pop() { return find("root/bgIcon/goToCompose/pop", this.node)! }

    get btnBuildLabel() { return find("root/bgIcon/btnBuild/btnBuildLabel", this.node)!.getComponent(Label)! }

    //左边图标
    get icon() { return find("root/bgIcon/leftIcon/icon", this.node)!.getComponent(Sprite)! }
    get dressLabel() { return find("root/bgIcon/leftIcon/dressLabel", this.node)!.getComponent(Label)! }
    get sceneItemNameLabel() { return find("root/bgIcon/leftIcon/sceneItemNameLabel", this.node)!.getComponent(Label)! }

    id: number = 0
    type: GBuildType = null!
    sceneItemData: any = null!
    isBtnActive: boolean = false

    start() {
        UtilPub.breathScale(this.starNode, 1.1)
        UtilPub.breathScale(this.pop)
        this.bindButton(this.btnClose, () => {
            this.close()
        })

        this.bindButton(this.gift, () => {
            //弹出奖励提示框
            let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.sceneItemData.room)
            let pos = UtilPub.convertToWorldSpace(this.gift)
            uiManager.instance.showDialog(Const.Dialogs.pop_reward_item, { rewardData: roomData.resAll, pos: pos })
        })

        this.bindButton(this.btnBuild, this.onClickBtnBuild);

        this.bindButton(this.goToCompose, () => {
            this.close()
            uiManager.instance.showDialog(Const.Dialogs.ComposeLayer)
        })

        //完成监听
        this.spineAni.setCompleteListener((trackEntry: any) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name == "animation") {// 动画结束后执行自己的逻辑

                let handIndex = composeModel.getHandIndex();
                if (handIndex == handIndexs.buildCashDesk) {
                    composeModel.addHandIndex();
                    composeModel.addHandIndex();
                    composeModel.closeHandLayer();
                }

                this.emit(GD.event.chgGreenStar)

                audioManager.instance.playSound(Const.Audio.flash_show)
                let script = UtilScene.getSceneItemNodeById(this.sceneItemData.id)!

                //如果道具是地毯，家具，挂机，那么调用一次性动画
                if (this.type != GBuildType.room) {
                    this.emit(GD.event.popOpsWindow, UtilScene.getSceneItemNodeById(this.sceneItemData.id)!.node)
                    //在目标节点上展示星星动画
                    this.addPrefab(Const.Prefabs.flash_star, script.node, (itemNode: any) => {
                        itemNode.getComponent(flash_star).init()
                    })

                }

                if (composeModel.isHandDone()) {
                    this.scheduleOnce(() => {
                        UtilScene.setSceneItemAni(script.node, () => {

                        })
                    }, 0.2)
                }
                this.close()

            }
        });
    }

    setScript(script: GISceneItemParent, skin: number) {
        script.lockState = GLockState.unlock
        script.skin = skin
        SceneData.ins.setSceneItem(UtilScene.getSceneData(script))
        script.switchIcon(skin)
        this.emit(GD.event.chgGreenStar)
    }

    show(args: any) {
        this.spineAni.node.active = false
        this.isBtnActive = false
        this.id = args.id
        this.type = args.type

        this.sceneItemData = tables.ins().getTableValueByID(Const.Tables.scene_item, this.id)
        let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.sceneItemData.room)

        let itemSkinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.sceneItemData.skin)

        this.titleLabel.string = roomData.name
        this.starLabel.string = userData.greenStar + ""
        this.btnBuildLabel.string = "建造"

        this.sceneItemNameLabel.string = "搭建" + itemSkinData.name

        let val = 0
        if (this.type != GBuildType.room) {
            val = UtilScene.getRoomBuildProgress(this.sceneItemData.room)
        }
        this.roomBar.progress = val
        this.roomBarLabel.string = Math.round(val * 100) + "%"

        if (this.sceneItemData.reward.length > 0) {
            this.rewards.removeAllChildren()
            // this.sceneItemData.reward.forEach((element: any) => {
            //     this.addPrefab(Const.Prefabs.PropItem, this.rewards, (propItem: any) => {
            //         propItem.getComponent(PropItem).setData(element[0], PropItemFlag.ShowNum, element[1]).setSize(100)
            //     })
            // });
            this.addPrefab(Const.Prefabs.PropItem, this.rewards, (propItem: any) => {
                propItem.getComponent(PropItem).setData(this.sceneItemData.reward[0], PropItemFlag.TouchInfo, this.sceneItemData.reward[1]).setSize(100)
            })
            this.addPrefab(Const.Prefabs.PropItem, this.rewards, (propItem: any) => {
                propItem.getComponent(PropItem).setData(104, PropItemFlag.HideName | PropItemFlag.ShowNum, parseInt(this.sceneItemData.stars.split(",")[1]) * 5).setSize(100)
            })
        }

        //判断房间是否解锁
        // if(SceneData.ins.getRoomLockInfoById(sceneItemData.room)==GSceneRoomState.locked){
        // }else{
        // }
        let isShowBuild = false
        if (this.type == GBuildType.room) {
            //解锁房间，奖励取房间表拿
            let star = roomData.stars.split(",")[1]
            isShowBuild = (userData.greenStar >= star)
        } else {
            //设置场景道具，奖励取场景道具表拿
            //如果星星不足
            let star = this.sceneItemData.stars.split(",")[1]
            isShowBuild = (userData.greenStar >= star)
        }

        //如果星星不足
        // let star = this.sceneItemData.stars.split(",")[1]
        // let isShowBuild = (userData.greenStar >= star)
        this.btnBuild.active = isShowBuild
        this.goToCompose.active = !isShowBuild

        let handIndex = composeModel.getHandIndex();
        if (handIndex == handIndexs.buildCashDesk) {
            let obj: any = {};
            obj.id = composeModel.getHandIndex() + 1;
            obj.node = this.btnBuild;
            obj.delayTime = 0.5;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }

        //设置道具图标
        // this.icon = 
        let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, this.sceneItemData.unlockSkin)
        UtilScene.setSkinIcon(this.icon, skinData)
    }

    close() {
        uiManager.instance.hideDialog(this.dialogPath)
    }

    onClickBtnBuild() {
        if (this.isBtnActive) return

        let star = this.sceneItemData.stars.split(",")[1]
        star = parseInt(star);

        if (this.type == GBuildType.room) {
            //解锁房间，奖励取房间表拿
            let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.sceneItemData.room)
            star = roomData.stars.split(",")[1]
        }

        if (userData.checkAndUseGreenStar(star)) {
            this.isBtnActive = true
            audioManager.instance.playSound(Const.Audio.star_touch)
            composeModel.addManagerVal(Const.ManagerTypes.buildCount);

            this.spineAni.node.active = true
            this.spineAni.setAnimation(0, "animation", false)

            //解锁房间
            if (this.type == GBuildType.room) {
                //初始化这个房间的东西，然后再继续
                SceneData.ins.setRoomLockInfoById(this.sceneItemData.room, GSceneRoomState.unlock)
                UtilScene.initRoomById(this.sceneItemData.room).then(() => {
                    // this.emit(GD.event.chgGreenStar)
                })

            } else {
                //解锁场景的道具
                let script = UtilScene.getSceneItemNodeById(this.sceneItemData.id)!
                SceneData.ins.setSceneSkinById(this.sceneItemData.unlockSkin, GSceneSkinState.gotted)
                this.setScript(script, this.sceneItemData.unlockSkin)
            }
            this.emit(GD.event.goToBuildScene, this.id, this.type)

            //增加经验
            userData.roleExp += star * UtilScene.ExpTimes
            this.emit(GD.event.updateMoney);

            //赋予奖励
            composeModel.addPropNum(this.sceneItemData.reward[0], this.sceneItemData.reward[1], v3(), v3(), true)

            //进度条动画
            if (this.type != GBuildType.room) {
                let val = UtilScene.getRoomBuildProgress(this.sceneItemData.room)
                tween(this.roomBar).to(0.3, { progress: val }).start()
                this.roomBarLabel.string = Math.round(val * 100) + "%"
            }

            //监听spine完成的事件进行结束
        }
    }

}


