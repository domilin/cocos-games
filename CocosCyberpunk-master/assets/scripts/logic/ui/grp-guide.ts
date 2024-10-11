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

import { Node } from "cc";
import { Msg } from "../../core/msg/msg";
import { Guide } from "../../core/guide/guide";
import { Sound } from "../../core/audio/sound";
import { GrpBase } from "../../core/ui/ui-com";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_guide', (node: Node) => new GrpGuide(node));

export class GrpGuide extends GrpBase {

    constructor (node: Node) {
        super(node);
        Msg.on('guide_refresh', this.guide_refresh.bind(this));
    }

    public on (): void {
        this.guide_refresh();
    }

    guide_refresh () {

        // close all
        for (var i = 0; i < this._node.children.length; i++)
            this._node.children[i].active = false;

        var n = this._node.getChildByName(Guide.Instance._cur_name);
        if (n == undefined) {
            console.error('error guide name:', Guide.Instance._cur_name);
        } else {
            n.active = true;
            Sound.on('sfx_notify_tip');
        }
    }

}