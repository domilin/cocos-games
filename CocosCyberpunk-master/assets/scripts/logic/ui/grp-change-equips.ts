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

import { Sprite, Node } from "cc";
import { UICom } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { Msg } from "../../core/msg/msg";
import { Level } from "../level/level";
import { ResCache } from "../../core/res/res-cache";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_change_equips', (node: Node) => new GrpChangeEquips(node));

export class GrpChangeEquips extends UICom {

    heighLights: Node[] | undefined;
    icons: Sprite[] = [];

    constructor (node: Node) {
        super(node);
        this.heighLights = UtilNode.getChildByName(this._node, 'heigh_lights').children;
        const iconsChildren = UtilNode.getChildByName(this._node, 'icons').children;
        for (let i = 0; i < iconsChildren.length; i++) {
            const spriteIcon = iconsChildren[i].getComponent(Sprite)!;
            this.icons?.push(spriteIcon);
        }

        Msg.on('msg_refresh_change_equip', this.refreshChangeEquip.bind(this));
    }

    public on (): void {
        this.refreshChangeEquip();
    }

    refreshChangeEquip () {
        const _player = Level.Instance._player;
        if (!_player) return;

        // set equip info.
        const data = _player._data.items;
        const itemsName = _player._data.equipment_name_list;
        const currentIndex = _player._data.current_equipment_index
        for (let i = 0; i < 4; i++) {
            const itemName = itemsName[i];
            const heighLight = this.heighLights![i];
            heighLight.active = currentIndex == i;
            const icon = this.icons![i];
            if (itemName.length > 0) {
                const item = data[itemName];
                icon.spriteFrame = ResCache.Instance.getSprite(`img_icon_${item.name}`);
            } else {
                icon.spriteFrame = null;
            }
        }
    }

}