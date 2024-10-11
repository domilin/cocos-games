/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Label, Node } from "cc";
import { Res } from "../../core/res/res";
import { UICom } from "../../core/ui/ui-com";
import { Queue } from "../../core/util/data-structure";
import { DataGameInst } from "../data/data-core";
import { UtilNode } from "../../core/util/util";
import { Msg } from "../../core/msg/msg";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_picked_tips', (node: Node) => new GrpPickedTips(node));

export class GrpPickedTips extends UICom {

    list: Array<GrpPickedTipsItem>;
    msgs: Queue<MsgPicked>;

    index = 0;

    constructor (node: Node) {
        super(node);
        // Init deep default 10.
        const count = DataGameInst._data.count_picked_info;
        this.list = new Array<GrpPickedTipsItem>(count);
        this.msgs = new Queue(count);
        const item = this._node.children[0];

        for (let i = 0; i < count; i++) {
            const newItem = Res.instNode(item, this._node);
            this.list[i] = new GrpPickedTipsItem(newItem);
        }

        item.active = false;
        Msg.on('msg_tips', (msg: string) => {
            this._node.children[0].setSiblingIndex(count);
            this.list[this.index].refresh(msg);
            this.index++;
            if (this.index >= count) this.index = 0;
        })
    }

}

class GrpPickedTipsItem {

    txt_info: Label;
    _node: Node;

    constructor (node: Node) {
        this._node = node;
        this.txt_info = UtilNode.getChildComponent(this._node, 'txt_info', Label);
        this.setDisplay(false);
    }

    refresh (msg: string) {
        this.txt_info.string = msg;
        this.setDisplay(true);
    }

    setDisplay (isShow: boolean) {
        this._node.active = isShow;
    }

}

interface MsgPicked {
    name: string,
    num: number,
    time: number,
}