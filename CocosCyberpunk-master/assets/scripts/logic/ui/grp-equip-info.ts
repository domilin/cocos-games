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
import { UICom } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { Msg } from "../../core/msg/msg";
import { Level } from "../level/level";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_equip_info', (node: Node) => new GrpEquipInfo(node));

export class GrpEquipInfo extends UICom {

    txt_equip_info: Label | undefined | null;

    constructor (node: Node) {
        super(node);
        this.txt_equip_info = UtilNode.getChildComponent(this._node, 'txt_equip_info', Label);
        Msg.on('msg_update_equip_info', () => {
            const _player = Level.Instance._player;
            if (!_player) return;
            const items = _player._data.items;
            const equipment_name_list = _player._data.equipment_name_list;
            const current_equipment_index = _player._data.current_equipment_index;
            const hasHighLight = current_equipment_index !== -1;
            if (hasHighLight) {
                // Get current data.
                const itemName = equipment_name_list[current_equipment_index];
                const itemData = items[itemName];
                if (itemName !== '') {
                    const isShow = itemData.data.bullet_count > 1;
                    Msg.emit('msg_grp_equip_info', isShow ? 255 : 0);
                    if (isShow) {
                        let showNum = itemData.bulletCount;
                        if (showNum < 0) showNum = 0;
                        this.txt_equip_info!.string = `${showNum}/${_player.bulletBox}`;
                    }
                }
            }
        })
    }
}
