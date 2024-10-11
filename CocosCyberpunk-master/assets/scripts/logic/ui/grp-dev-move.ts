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

import { EditBox, Node } from "cc";
import { UICom } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { GameSet } from "../data/game-set";
import { Msg } from "../../core/msg/msg";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_dev_move', (node: Node) => new GrpDevMove(node));

export class GrpDevMove extends UICom {

    inp_move_value_list: EditBox | undefined;

    inp_move_accelerate_list: EditBox | undefined;

    inp_screen_to_angle: EditBox | undefined;

    inp_accelerate_point: EditBox | undefined;

    constructor (node: Node) {
        super(node);
        this.inp_move_value_list = UtilNode.getChildComponent(this._node, 'inp_move_value_list', EditBox);
        this.inp_move_accelerate_list = UtilNode.getChildComponent(this._node, 'inp_move_accelerate_list', EditBox);
        this.inp_screen_to_angle = UtilNode.getChildComponent(this._node, 'inp_screen_to_angle', EditBox);
        this.inp_accelerate_point = UtilNode.getChildComponent(this._node, 'inp_accelerate_point', EditBox);
    }

    public on (): void {

        this.inp_move_value_list!.string = GameSet.Instance.move_value_list.toString();

        this.inp_move_accelerate_list!.string = GameSet.Instance.move_accelerate_list.toString();

        this.inp_screen_to_angle!.string = GameSet.Instance.screen_to_angle.toString();

        this.inp_accelerate_point!.string = GameSet.Instance.accelerate_point.toString();

    }

    public off (): void {
        Msg.emit('inp_move_value_list', this.inp_move_value_list?.string);
        Msg.emit('inp_move_accelerate_list', this.inp_move_accelerate_list?.string);
        Msg.emit('inp_screen_to_angle', this.inp_screen_to_angle?.string);
        Msg.emit('inp_accelerate_point', this.inp_accelerate_point?.string);
    }

}