import { EditBox, Label, Node, _decorator } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorageJSF } from '../../../easyFramework/mgr/gameStorage';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { aiRobot } from '../../comm/AIRobot';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('GMInputLayer')
export class GMInputLayer extends BaseView {

    @property(EditBox)
    editBox: EditBox = null!;
    @property({ type: Node })
    btnSure: Node = null!;
    @property({ type: Label })
    hintLabel: Label = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
        this.bindButton(this.btnSure, this.onClickBtnSure);
    }

    show(args: any) {
        super.show(args);

        this.initUI();

    }

    initUI() {
        if (aiRobot.isRobot()) {
            this.hintLabel.string = "当前是机器人";
        } else {
            this.hintLabel.string = "";
        }
    }

    onClickBtnClose() {
        this.close();
    }

    onClickBtnSure() {
        let str = this.editBox.string;
        UtilPub.log(str);
        switch (str) {
            case "tyq666":
                // 开启机器人
                GameStorageJSF.ins.setRobot(true);
                UtilScene.restartGame();
                break;
            case "666":
                // 关闭机器人
                GameStorageJSF.ins.setRobot(false);
                UtilScene.restartGame();
                break;
            default:
                break;
        }
        this.close();
    }


}

