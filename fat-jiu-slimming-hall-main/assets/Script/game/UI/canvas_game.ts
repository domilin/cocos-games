import { game, Node, v3, Vec2, Vec3, _decorator, director, Game, find, EventTouch } from 'cc';
import { Const } from '../../config/Const';
import GD from '../../config/GD';
import { comm } from '../../easyFramework/mgr/comm';
import { resourceUtil } from '../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../easyFramework/mgr/uiManager';
import TimeCtrJSF from '../../easyFramework/network/TimeCtrJSF';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { playerModel } from '../comm/playerModel';
import { GNetCmd } from '../../easyFramework/network/conf';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
import { audioManager } from '../../easyFramework/mgr/audioManager';
import { composeModel } from '../comm/composeModel';
import { UtilScene } from '../comm/UtilScene';
import { tyqSDK } from '../../tyqSDK/SDK/tyqSDK';
import { tyqAdManager } from '../../tyqSDK/SDK/tyqAdManager';
import { userData } from '../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('canvas_game')
export class canvas_game extends comm {

    private clickPos: Vec2 = new Vec2();    //触摸的点
    private starPos: Vec2 = new Vec2();  //初始触摸点

    buildingNode: Node = null!
    player: Node = null!
    dir: Vec3 = null!
    dirOps: Vec3 = null!

    oriPos: Vec3 = v3(0, 0, 0)
    startPos1: Vec2 = null!
    startPos2: Vec2 = null!
    pointsDis: number = 0
    rate: number = 1

    isDownloading: boolean = false //是否下载
    curDownLoadIdx: number = 0 //当前下载索引
    isLoadingPrefab: boolean = false //是否正在加载预制体
    curPrefabIdx: number = 0 //当前预制体索引
    prefabsArr: string[] = []
    calGameTime: number = 0 //计算时间

    onLoad() {
        director.off(GNetCmd.GetRegionData.toString(), this.onMessageEvent, this);
        director.off(GNetCmd.UniqueLogin.toString(), this.onMessageEvent, this);
        director.off(GNetCmd.ReqWxSession.toString(), this.onMessageEvent, this);

        director.on(GNetCmd.GetRegionData.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.UniqueLogin.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.ReqWxSession.toString(), this.onMessageEvent, this);
        Const.UICanvas = this.node
        this.prefabsArr = Object.keys(Const.Prefabs)
    }

    onMessageEvent(value: any) {
        ServerCtrJSF.GetInstance().loginHandler(value)
    }

    start() {
        Const.isLow = UtilPub.checkIsLowPhone()
        if (Const.isLow) {
            game.frameRate = 30;
        } else {
            game.frameRate = 60;
        }

        UtilPub.log("---------展示主页-0-----")
        playerModel.initData();
        uiManager.instance.showDialog(Const.Dialogs.main)

        audioManager.instance.initMusic()
        audioManager.instance.playMusic(true, Const.Audio.bgm);

        game.on(Game.EVENT_HIDE, () => {
            // @ts-ignore

        });

        userData.showGodWealthOther()
        game.on(Game.EVENT_SHOW, () => {
            UtilPub.log("---------展示主页-1-----")
            userData.showGodWealthOther()
        });

      
    }

    onEnable() {
        UtilPub.log("---------展示主页-onEnable-----")

        this.on(GD.event.showToast, this.showToastRet, this);

    }

    onDisable() {
        this.off(GD.event.showToast, this.showToastRet);
    }

    showToastRet(info: string) {
        this.toast(info);
    }

    update(dt: number) {
        TimeCtrJSF.GetInstance().serverTime += (dt * 1000);

        this.calGameTime += dt
        if (this.calGameTime > 1) {
            this.calGameTime -= 1
            ServerCtrJSF.GetInstance().addGameTime(1)
        }

        //进入游戏后统一进行异步加载
        this.calTime += dt
        if (this.calTime > 0.1 && ServerCtrJSF.GetInstance().isOkToDownload() == true) {
            this.calTime = 0
            if (this.isDownloading == false) {
                if (this.curDownLoadIdx >= Const.bundles.length) {

                } else {
                    this.isDownloading = true
                    UtilPub.loadBundle(Const.bundles[this.curDownLoadIdx]).then(() => {
                        this.curDownLoadIdx++
                        this.isDownloading = false
                        UtilPub.warn("------------下载完毕", Const.bundles[this.curDownLoadIdx], this.curDownLoadIdx)
                    })
                }
            }

            //下载完毕后，加载所有预制体
            // Public.warn("------------预制体加载1", this.curDownLoadIdx>=Const.bundles.length, this.curDownLoadIdx, Const.bundles.length)
            if (this.curDownLoadIdx >= Const.bundles.length) {
                if (this.isLoadingPrefab == false) {
                    if (this.curPrefabIdx >= this.prefabsArr.length) {
                        return
                    }

                    this.isLoadingPrefab = true
                    let prefabName = this.prefabsArr[this.curPrefabIdx]

                    //@ts-ignore
                    let prefab = Const.Prefabs[prefabName]
                    resourceUtil.preloadPrefab(prefab).then(() => {
                        this.curPrefabIdx++
                        this.isLoadingPrefab = false
                        UtilPub.warn("------------预制体加载完毕", this.prefabsArr[this.curPrefabIdx], this.curPrefabIdx)
                    })
                }
            }
        }

    }

}
