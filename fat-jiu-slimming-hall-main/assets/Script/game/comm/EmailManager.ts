
import { director } from "cc";
import { Const } from "../../config/Const";
import { Email, EmailRewardState, EmailState, EmailType } from "../../config/global";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { GNetCmd } from "../../easyFramework/network/conf";
import ServerCtrJSF from "../../easyFramework/network/ServerCtrJSF";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";


export class EmailManager {
    private static _instance: EmailManager = null!

    private _newEmailIDs: number[] = []

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new EmailManager()
            this._instance._newEmailIDs = []
            this._instance.checkTimeOutEmail()
            director.off(GNetCmd.ToClientNewMail.toString(), this._instance.onNewMailEvent, this);
            director.off(GNetCmd.GetUserDataByKey.toString(), this._instance.onMessageEvent, this);
            director.on(GNetCmd.ToClientNewMail.toString(), this._instance.onNewMailEvent, this);
            director.on(GNetCmd.GetUserDataByKey.toString(), this._instance.onMessageEvent, this);
        }
        return this._instance
    }


    public get EmailList() {
        this.checkNumOutEmail()
        return GameStorage.getObjectArrayByKey(Const.DataKeys.emailList).values
    }

    public checkTimeOutEmail() {
        for (let index = 0; index < this.EmailList.length; index++) {
            const email: Email = this.EmailList[index];
            if (TimeCtrJSF.GetInstance().ServerTime - email.time > 50 * 24 * 60 * 60000) {
                this.removeEmail(email.id)
            }
        }
    }

    public checkNumOutEmail() {
        let arr = GameStorage.getObjectArrayByKey(Const.DataKeys.emailList).values
        if (arr.length > 50) {
            let fun = (a: Email, b: Email) => {
                return b.time - a.time
            }
            arr.sort(fun)
            for (let index = 50; index < arr.length; index++) {
                if (arr[index]) {
                    this.removeEmail(arr[index].id)
                }
            }
        }
    }

    onNewMailEvent(value: any) {
       // console.log("onNewMailEvent:", value);
       EmailManager.getInstance().pushNewEmailIDs(parseInt(value.id + ""))
    }

    public pushNewEmailIDs(id: number) {
        if (!this._newEmailIDs) {
            this._newEmailIDs = []
        }
        this._newEmailIDs.push(id)
    }

    public popNewEmails() {
        if (this._newEmailIDs.length <= 0) {
            return true
        }
        for (let index = 0; index < this._newEmailIDs.length; index++) {
            const element = this._newEmailIDs[index];
            this.reqServerEmailById(element)
        }
        this._newEmailIDs = []
        return false
    }

    public isShowNewEmailRedPoint() {
        if (this._newEmailIDs.length > 0) {
            return true
        }
        let emailList = this.EmailList
        for (let index = 0; index < emailList.length; index++) {
            const email = emailList[index];
            if (email.readState == EmailState.unRead || (email.reward && email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive)) {
                return true
            }
        }
        return false
    }

    public reqServerEmailById(id: number) {
        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.DataKeys.emailList + "_" + id))
    }

    onMessageEvent(value: any) {
        if (value == null) {
            return
        }
        if (value.key.indexOf(GameStorage.Key(Const.DataKeys.emailList)) >= 0) {
            EmailManager.getInstance().saveEmail(value.val)
        }
    }

    public addEmail() {
        let email: Email = {
            id: 10003,
            type: EmailType.type_sys,
            content: "胖胖的曹间捡到了一个礼盒",
            readState: EmailState.unRead,
            receicedState: EmailRewardState.unReceive,
            reward: [{ propId: 101, cnt: 100 }],
            time: TimeCtrJSF.GetInstance().ServerTime,
            title: "运营补偿",
        }
        this.saveEmail(email)

        let email1: Email = {
            id: 10015,
            type: EmailType.type_sys,
            content: "胖胖的曹间说了一大堆废话aaaaa。。。。。。。",
            readState: EmailState.unRead,
            receicedState: EmailRewardState.unReceive,
            reward: [],
            time: TimeCtrJSF.GetInstance().ServerTime,
            title: "系统公告2",
        }
        this.saveEmail(email1)
    }

    public saveEmail(email: Email) {
        GameStorage.setObject(Const.DataKeys.emailList + "_" + email.id, email)
    }

    public getEmailById(id: number) {
        return GameStorage.getObject(Const.DataKeys.emailList + "_" + id, null)
    }

    public removeEmail(id: number) {
        GameStorage.removeItem(Const.DataKeys.emailList + "_" + id)
    }

    public removeAllEmail() {
        GameStorage.removeMulti(GameStorage.getObjectArrayByKey(Const.DataKeys.emailList).keys)
    }

}
