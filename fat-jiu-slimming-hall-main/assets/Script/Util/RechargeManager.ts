import { native, _decorator } from "cc";
import { NATIVE, WECHAT } from "cc/env";
import GD from "../config/GD";
import { Notifications } from "../easyFramework/mgr/notifications";
import ServerCtrJSF from "../easyFramework/network/ServerCtrJSF";
import { H5AdSdk4399 } from "../tyqSDK/SDK/H5AdSdk4399";
import { tyqAdManager } from "../tyqSDK/SDK/tyqAdManager";
import { tyqSDK } from "../tyqSDK/SDK/tyqSDK";

const { ccclass, property } = _decorator;


@ccclass('RechargeManager')
export class RechargeManager {

    private static videoCallBack: any;
    private static failCallBack: any;

    public static initManager() {
        if (NATIVE) {
            //@ts-ignore
            window.videoRewardCallBack = (str: string) => {
                if (this.videoCallBack) {
                    this.videoCallBack()
                    this.videoCallBack = null
                    this.failCallBack = null
                }
            }
            //@ts-ignore
            window.videoFailCallBack = (str: string) => {
                if (this.failCallBack) {
                    this.failCallBack()
                    this.videoCallBack = null
                    this.failCallBack = null
                }
                Notifications.emit(GD.event.showToast, "看完广告才能获得奖励");
            }
        }
    }


    public static LoginGoole() {
        if (NATIVE) {
            if (!native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickGoogleSignIn", "(Ljava/lang/String;)V", "---google登录")) {
            }
        }
    }


    public static LoginFacebook() {
        if (NATIVE) {
            if (!native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickFacebookSignIn", "(Ljava/lang/String;)V", "---Facebook登录")) {
            }
        }
    }

    public static RechargeTest() {
        if (NATIVE) {
            if (!native.reflection.callStaticMethod("com/cocos/game/BillingClientClass", "onClickGooglePlay", "(Ljava/lang/String;)V", "---充值")) {

            }
        }
    }

    public static showVideo(event: string, callBack: Function, failCb: Function | any = null) {
        this.videoCallBack = callBack;
        this.failCallBack = failCb;

        if (WECHAT) {
            tyqSDK.showRewardedAd(event, (st: number) => {
                if (st == 1) {
                    callBack && callBack()
                } else if (st == 2) {
                    Notifications.emit(GD.event.showToast, "观看完广告才能获得奖励！");
                    failCb && failCb()
                } else {
                    Notifications.emit(GD.event.showToast, "暂无广告，请稍后再试！");
                    failCb && failCb()
                }
            })
            return
        }
        H5AdSdk4399.instance.showRewardedAd(callBack)
        // callBack && callBack()
        return
        if (NATIVE) {
            this.videoCallBack = callBack
            this.failCallBack = failCb
            console.log(" NATIVE android 平台 com/cocos/game/SdkUtil4399")

            if (!native.reflection.callStaticMethod("com/cocos/game/AppActivity", "RewardVideoShow", "(Ljava/lang/String;)Z", "展示广告")) {
                failCb && failCb();
            }
            // 233
            // if (!native.reflection.callStaticMethod("com/cocos/game/MetaAdApiUtil", "RewardVideoShow", "(Ljava/lang/String;)Z", "展示广告")) {
            //     failCb && failCb();
            // }
        } else {
            this.videoCallBack()
            this.videoCallBack = null
            this.failCallBack = null
        }
    }

}

