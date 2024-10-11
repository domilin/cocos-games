import { Node, _decorator } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
const { ccclass, property } = _decorator;

@ccclass('SeasonHelpLayer')
export class SeasonHelpLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    onLoad() {

        this.bindButton(this.btnClose, this.onClickBtnClose);

    }

    show(args: any) {
        super.show(args);
        this.initUI();
    }

    initUI() {

    }

    onClickBtnClose() {
        this.close();
    }

}

