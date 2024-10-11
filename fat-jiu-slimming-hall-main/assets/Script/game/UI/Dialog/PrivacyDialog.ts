import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';

import BaseView from '../../../easyFramework/mgr/BaseView';


const { ccclass, property } = _decorator;



@ccclass('PrivacyDialog')
export class PrivacyDialog extends BaseView {


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

    }

    show(args: any) {
        super.show(args)
    }

}

