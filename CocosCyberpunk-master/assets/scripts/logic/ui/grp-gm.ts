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

import { Button, EditBox, Node } from "cc";
import { GrpBase } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { GM } from "../../gm/gm";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_gm', (node: Node) => new GrpGM(node));

export class GrpGM extends GrpBase {
    btn_gm: Node;
    inp_gm: EditBox;
    constructor (node: Node) {
        super(node);
        this.btn_gm = UtilNode.getChildByName(this._node, 'btn_gm');
        this.inp_gm = UtilNode.getChildComponent(this._node, 'inp_gm', EditBox);
        this.btn_gm!.on(Button.EventType.CLICK, () => {
            GM.run(this.inp_gm!.string);
        })
    }
}