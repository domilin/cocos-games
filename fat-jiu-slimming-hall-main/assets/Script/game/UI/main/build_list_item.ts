import { find, Label, ProgressBar, Sprite, UITransform, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GSceneRoomReceiveState, GSceneRoomState } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { composeModel } from '../../comm/composeModel';
import { SceneData } from '../../comm/SceneData';
import { userData } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';

const { ccclass, property } = _decorator;

@ccclass('build_list_item')
export class build_list_item extends comm {
    get roomNameLabel() { return find("root/top/roomNameLabel", this.node)!.getComponent(Label)! }

    get roomIntroLabel() { return find("root/roomIntroLabel", this.node)!.getComponent(Label)! }

    get bar() { return find("root/bar", this.node)! }
    get roomBar() { return find("root/bar/roomBar", this.node)!.getComponent(ProgressBar)! }
    get roomBarLabel() { return find("root/bar/roomBar/roomBarLabel", this.node)!.getComponent(Label)! }
    get gift() { return find("root/bar/gift", this.node)! }
    get giftReward() { return find("root/bar/giftReward", this.node)! }

    get giftReceive() { return find("root/giftReceive", this.node)! }

    get mid() { return find("root/mid", this.node)! }
    get icon() { return find("root/mid/iconbg/icon", this.node)!.getComponent(Sprite)! }
    get expLabel() { return find("root/mid/iconbg/expLabel", this.node)!.getComponent(Label)! }
    get tipLabel() { return find("root/mid/tipLabel", this.node)!.getComponent(Label)! }
    get starNumLabel() { return find("root/mid/starNum/starNumLabel", this.node)!.getComponent(Label)! }
    get goBtn() { return find("root/mid/goBtn", this.node)! }
    get goBtnLabel() { return find("root/mid/goBtn/goBtnLabel", this.node)!.getComponent(Label)! }

    get bottom() { return find("root/bottom", this.node)! }
    get lockLabel() { return find("root/bottomLock/lockLabel", this.node)!.getComponent(Label)! }

    get picture() { return find("root/top/mask/picture", this.node)!.getComponent(Sprite)! }


    roomId: number = 0
    buildId: number = 0
    buildType: GBuildType = GBuildType.room

    onLoad() {
        this.bindButton(this.gift, () => {
            //弹出奖励提示框
            if (this.roomId > 0) {
                let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.roomId)
                let pos = UtilPub.convertToWorldSpace(this.gift)
                uiManager.instance.showDialog(Const.Dialogs.pop_reward_item, { rewardData: roomData.resAll, pos: pos })
            }
        })

        this.bindButton(this.goBtn, this.onClickBtnGo);

        this.bindButton(this.giftReceive, () => {
            if (this.roomId > 0) {
                let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, this.roomId)
                uiManager.instance.showDialog(Const.Dialogs.RewardDialog, { reward: roomData.resAll })
                SceneData.ins.setRoomReceiveInfoById(this.roomId, GSceneRoomReceiveState.received)
                this.node.removeFromParent()
            }
        })
    }

    init(roomId: number) {
        this.roomId = roomId
        let roomData = tables.ins().getTableValueByID(Const.Tables.scene_room, roomId)
        this.roomNameLabel.string = roomData.name
        this.roomIntroLabel.string = roomData.desc
        this.giftReceive.active = false
        this.setSpriteFrame(this.picture, Const.resPath.buildpicture + roomData.picture)

        this.bindButton(find("root/top", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.build_info, { id: roomId })
        })
        //判断角色等级是否达到房间等级
        // UtilPub.log("-----------房间ID1----", roomId, userData.roleLv >= roomData.lv)
        if (userData.roleLv >= roomData.lv) {
            this.bottom.active = false
            this.mid.active = true

            //判断房间是否解锁
            if (SceneData.ins.getRoomLockInfoById(roomId) == GSceneRoomState.unlock) {
                this.bar.active = true

                //对应满足条件的场景道具，需要显示房间解锁进度，对应道具的解锁
                let roomItems = tables.ins().getTableValuesByType2(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
                roomItems.sort((a, b) => {
                    return a.stars.split(",")[1] - b.stars.split(",")[1]
                })

                //获得未解锁的场景道具
                let items = UtilScene.getNeedShowStarSceneItems(roomId)
                if (items.length > 0) {
                    let item = items[0]
                    // UtilPub.log("-----------房间ID2----", roomItems, item)
                    //显示这个道具信息
                    let skinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, item.skin)
                    let unlockSkin = tables.ins().getTableValueByID(Const.Tables.scene_skin, item.unlockSkin)
                    UtilScene.setSkinIcon(this.icon, unlockSkin)
                    // 

                    this.expLabel.string = "+" + item.stars.split(",")[1] * UtilScene.ExpTimes
                    this.starNumLabel.string = "x" + item.stars.split(",")[1]

                    this.tipLabel.string = "搭建 " + skinData.desc
                    this.buildType = GBuildType.item
                    this.buildId = item.id
                }

                //设置进度条信息
                let val = UtilScene.getRoomBuildProgress(roomId)
                this.roomBar.progress = val
                this.roomBarLabel.string = Math.round(val * 100) + "%"
                if (val >= 1) {
                    //如果满足了那么直接领取奖励
                    this.mid.active = false
                    this.giftReceive.active = true
                }

            } else {//如果未解锁，显示房间解锁需要的星星数
                //隐藏进度条
                this.buildType = GBuildType.room
                this.buildId = this.roomId
                this.bar.active = false
                let skinData = tables.ins().getTableValuesByType(Const.Tables.scene_item, "room", roomData.id)[0]
                UtilPub.log("-----skin---", roomData.id, skinData)
                let unlockSkinData = tables.ins().getTableValueByID(Const.Tables.scene_skin, skinData.unlockSkin)
                UtilScene.setSkinIcon(this.icon, unlockSkinData)
                // this.setSpriteFrame(this.icon, UtilScene.getResSceneIcon(skinData.icon0) Const.resPath.sceneIcons + )
                // UtilScene.setSkinIcon(this.icon, Const.resPath.defaultSceneIcons + roomData.icon0)
                this.expLabel.string = "+" + roomData.stars.split(",")[1] * UtilScene.ExpTimes
                this.starNumLabel.string = "x" + roomData.stars.split(",")[1]
                this.tipLabel.string = "扩建 " + roomData.name
            }

        } else {
            this.bottom.active = true
            this.mid.active = false
            //判断需要的解锁的等级
            this.lockLabel.string = '等级达到' + roomData.lv
        }

        console.log("builditem height = ", this.node.getComponent(UITransform)!.height)
    }

    onClickBtnGo(){
        //关闭窗口
        composeModel.closeHandLayer();
        uiManager.instance.hideDialog(Const.Dialogs.build_list)
        this.emit(GD.event.goToBuildScene, this.buildId, this.buildType)
    }

}


