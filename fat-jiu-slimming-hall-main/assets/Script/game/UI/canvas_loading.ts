import { assetManager, director, EditBox, find, game, Game, Label, ProgressBar, tween, Tween, _decorator } from 'cc';
import { HTML5, NATIVE, WECHAT } from 'cc/env';
import { Const } from "../../config/Const";
import { audioManager } from "../../easyFramework/mgr/audioManager";
import BaseView from "../../easyFramework/mgr/BaseView";
import { uiManager } from '../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../easyFramework/network/conf';
import CronCtrJSF from '../../easyFramework/network/CronCtrJSF';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
import tables from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { tyqSDK } from '../../tyqSDK/SDK/tyqSDK';
import { RechargeManager } from '../../Util/RechargeManager';
import { composeModel } from '../comm/composeModel';
import { userData } from '../comm/UserData';
import GD from '../../config/GD';
import { Wechat } from '../../tyqSDK/SDK/platform/wechat/wechat';
import { WmSocketJSF } from '../../easyFramework/network/WmSocketJSF';
import { H5AdSdk4399 } from '../../tyqSDK/SDK/H5AdSdk4399';
import { Notifications } from '../../easyFramework/mgr/notifications';
const { ccclass, property } = _decorator;

@ccclass('canvas_loading')
export class canvas_loading extends BaseView {
    get versionTxt() { return find("loading/page/version", this.node)!.getComponent(Label)! }
    get title() { return find("loading/page/title", this.node)! }

    get bar() { return find("loading/page/Body/progress", this.node)!.getComponent(ProgressBar)! }
    get txt() { return find("loading/page/Body/loadingTxt", this.node)!.getComponent(Label)! }

    get login() { return find("loading/page/login", this.node)! }
    get account() { return find("loading/page/login/account", this.node)!.getComponent(EditBox)! }
    get loginBtn() { return find("loading/page/login/loginBtn", this.node)! }

    get shiling() { return find("shiling", this.node) }
    get levebg() { return find("levebg", this.node) }


    curIdx: number = 0

    private isLoaded: boolean = false;
    aniTween: Tween<any> = new Tween()
    aniCartoon: Tween<any> = new Tween()
    private arr: string[] = []
    isShowLoginWin: boolean = false
    isEnterGame: boolean = false
    isStartLogin: boolean = false
    cnt: number = 0
    curProgress: number = 0
    lastProgress: number = 0
    timeProgress: number = 0

    onLoad() {
        console.log("-----------loading 场景--加载游戏--onLoad---------")
        this.on(GD.event.loadAll, this.loadAll, this)
        director.off(GNetCmd.GetRegionData.toString(), this.onMessageEvent);
        director.off(GNetCmd.UniqueLogin.toString(), this.onMessageEvent);
        director.off(GNetCmd.ReqWxSession.toString(), this.onMessageEvent);

        director.on(GNetCmd.GetRegionData.toString(), this.onMessageEvent);
        director.on(GNetCmd.UniqueLogin.toString(), this.onMessageEvent);
        director.on(GNetCmd.ReqWxSession.toString(), this.onMessageEvent);
        this.bindButton(this.loginBtn, this.loginBtnHandler)

        this.levebg!.active = false

        this.bindButton(this.shiling!, () => {
            this.levebg!.active = true
        })
        this.bindButton(find("btnClose", this.levebg!)!, () => {
            this.levebg!.active = false
        })

        this.bindButton(find("loading/page/login/loginGoogle", this.node)!, this.loginBtnGoogle)
        this.bindButton(find("loading/page/login/loginFaceBook", this.node)!, () => {
            RechargeManager.LoginFacebook()
        })

        this.bindButton(find("loading/privacyLabel", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PrivacyDialog)
        })

        game.on(Game.EVENT_HIDE, () => {
            console.log("-------------暂停游戏")
            game.pause();//暂停游戏
        });
        game.on(Game.EVENT_SHOW, () => {
            console.log("-------------恢复游戏")
            game.resume();//恢复游戏
        });

        //并发下载数量
        assetManager.downloader.maxConcurrency = 20

        //设置版本号
        this.versionTxt.string = "版本号：" + Const.version

        //初始化音乐配置
        audioManager.instance.initMusic()
        CronCtrJSF.GetInstance().init()

        //初始化账号
        if (HTML5) {
            this.account.string = ServerCtrJSF.GetInstance().Account
        }
        this.account.string = ServerCtrJSF.GetInstance().Account

        //开始加载
        // this.login.active = false
        this.isLoaded = false
        this.isEnterGame = false
        this.cnt = 0
        this.bar.progress = 0
        this.loadPkg();
        RechargeManager.initManager()
        if (WECHAT) {
            Wechat.checkUpdate()
        }
        if (NATIVE) {
            console.log(" Window.toastInfo")

            //@ts-ignore
            window.toastInfo = (str: string) => {
                console.log("AppActivity toastInfo= ", str)
                this.toast(str)
            }

            //@ts-ignore
            window.Login = (str: string) => {
                // this.toast(str)
                console.log("AppActivity = ", str)
                ServerCtrJSF.GetInstance().reqUniqueLoginByAccount(this.account.string.trim())
            }

        }

        H5AdSdk4399.instance.checkDownUrl()
    }

    start() {
        console.log("-----------loading 场景--加载游戏--start---------")
        //初始化态有趣SDK
        tyqSDK.initGame()
        tyqSDK.eventSendCustomEvent("进入登录")
    }

    onEnable() {
        console.log("-----------loading 场景--加载游戏--onEnable---------")
    }


    loginBtnGoogle() {
        console.log(" Window.loginBtnGoogle")
        RechargeManager.LoginGoole()
    }


    loginBtnHandler() {
        //  RechargeManager.RechargeTest()
        //  return
        // if (WECHAT) {
        //     ServerCtrJSF.GetInstance().wxLoginBegin()
        // } else {
        //网页调试模式可以输入账号ID
        //ServerCtrJSF.GetInstance().reqUniqueLoginByAccount(this.account.string.trim())
        if (ServerCtrJSF.GetInstance().isOkToDownload() == true) {
            Notifications.emit(GD.event.loadAll, () => {
                ServerCtrJSF.GetInstance().isLoadAll = true
            })
        } else {
            ServerCtrJSF.GetInstance().isLoadAll = true
        }
        ServerCtrJSF.GetInstance().isLogin = true;

    }

    onMessageEvent(value: any) {
        ServerCtrJSF.GetInstance().loginHandler(value)
    }

    loadBundles() {
        //并行加载安装包
        this.bar.progress = 0
        this.timeProgress = 1
        let per = 0.7 / this.arr.length
        for (let i = 0; i < this.arr.length; i++) {
            console.log("!!!!!!!!!!!!----loadPkg--", this.arr[i])
            this.txt.string = `加载资源包${i}...`
            UtilPub.loadBundle(this.arr[i]).then(() => {
                this.bar.progress += per
                this.curProgress = this.bar.progress + per
                this.cnt += 1
                if (this.arr[i] == "d1audio") {
                    UtilPub.loadAudio("d1audio").then(() => { this.cnt += 1 })
                } else if (this.arr[i] == "json") {
                    tables.ins().loadTable().then(() => { this.cnt += 1 })
                }
            })
        }
    }

    async loadPkg() {
        this.arr = [...Const.bundlesAhead1]
        // if (NATIVE || HTML5) {
        //     this.arr = [...Const.bundles]
        // }
        this.cnt = 0
        this.loadBundles()
    }

    loadAll(cb: Function) {
        this.arr = [...Const.bundlesAhead2, ...Const.bundlesGame]
        this.loadBundles()
        cb && cb()
    }


    preloadSence() {
        return new Promise<void>((resolve, reject) => {
            director.preloadScene('game', (err) => {
                if (!err) {
                    resolve()
                } else {
                    reject()
                }
            });
        })
    }

    private enterGame() {
        // TyqEventMgr.ins.sendEvent('进入游戏');
        director.off(GNetCmd.GetRegionData.toString());
        director.off(GNetCmd.UniqueLogin.toString());
        director.off(GNetCmd.ReqWxSession.toString());
        this.bar.progress = 0.8
        this.curProgress = 1
        this.timeProgress = 5
        this.txt.string = `正在为您设置场景...`
        this.preloadSence().then(() => {
            this.bar.progress = 1
            this.scheduleOnce(() => {
                director.loadScene("game");
            }, 0.1)
        })

    }

    update(deltaTime: number) {
        this.login.active = false
        if (this.cnt >= this.arr.length + 2) {
            this.cnt = -99999
            console.log("------全部资源加载完成------")
            this.isLoaded = false

            uiManager.instance.showDialog(Const.Dialogs.fly_tip)
            // if (WECHAT) {
            //     this.login.active = false
            // } else {
            //     this.login.active = true
            // }
        }

        if (ServerCtrJSF.GetInstance().isLogin && ServerCtrJSF.GetInstance().isLoadAll && this.isEnterGame == false) {
            console.log("------进入游戏------")
            this.isEnterGame = true
            this.enterGame()
        } else {

            this.calTime += deltaTime
            if (this.calTime > 2) {
                this.calTime = 0
                // if (WmSocketJSF.getInstance().isConnected() && this.isStartLogin == false) {
                //     this.isStartLogin = true
                    if (true|| WECHAT) {
                        this.loginBtnHandler();
                    }
                //}
            }
        }

        if (this.curProgress != this.lastProgress) {
            this.lastProgress = this.curProgress
            this.aniTween.stop()
            this.aniTween = tween(this.bar).to(2, { progress: this.curProgress }).start()
        }
    }
}
