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

import { Label, Sprite, Node } from "cc";
import { Msg } from "../../core/msg/msg";
import { UICom } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { DataGameInst } from "../data/data-core";
import { Level } from "../level/level";
import { BagItem } from "../actor/actor-bag";
import { ResCache } from "../../core/res/res-cache";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_bag', (node: Node) => new GrpBag(node));

export class GrpBag extends UICom {
    list: Array<GrpBagItem>;
    img_highlight: Node;
    constructor (node: Node) {
        super(node);
        this.img_highlight = UtilNode.getChildByName(this._node, 'img_highlight');
        if (this.img_highlight == undefined && this.img_highlight === null) throw new Error(`${this._node.name}`)
        const count = DataGameInst._data.count_bag_count;
        this.list = new Array<GrpBagItem>(count);
        const itemRoot = UtilNode.getChildByName(this._node, 'items_root');
        this.img_highlight.active = false;
        for (let i = 0; i < itemRoot.children.length; i++) {
            this.list[i] = new GrpBagItem(itemRoot.children[i], i + 1);
        }
        Msg.on('msg_update_bag', () => {
            const _player = Level.Instance._player;
            if (!_player) return;
            // set equip info.
            const data = _player._data.items;
            const itemsName = _player._data.equipment_name_list;
            for (let i = 0; i < this.list.length; i++) {
                const itemName = itemsName[i];
                const itemObj = this.list[i];
                const hasItem = itemName.length > 0;
                itemObj.setDisplay(hasItem);
                if (hasItem) {
                    const item = data[itemName];
                    itemObj.setInfo(item);
                }
            }
            Msg.emit('msg_grp_bag', 255);
        })

        Msg.on('msg_change_equip', () => {
            const _player = Level.Instance._player;
            if (!_player) return;
            const current_equipment_index = _player._data.current_equipment_index;
            const hasHighLight = current_equipment_index !== -1;
            this.img_highlight.active = hasHighLight;
            if (hasHighLight) {
                const highPos = this.list[current_equipment_index]._node.position
                this.img_highlight.setPosition(highPos.x, highPos.y, highPos.z);
            }
            Msg.emit('msg_grp_bag', 255);
        })

    }

    public on (): void {
        const _player = Level.Instance._player;
        if (!_player) return;
        // set equip info.
        const data = _player._data.items;
        const itemsName = _player._data.equipment_name_list;
        for (let i = 0; i < this.list.length; i++) {
            const itemName = itemsName[i];
            const itemObj = this.list[i];
            const hasItem = itemName.length > 0;
            itemObj.setDisplay(hasItem);
            if (hasItem) {
                const item = data[itemName];
                itemObj.setInfo(item);
            }
        }
    }
}

class GrpBagItem {
    txt_nun: Label;
    img_icon: Sprite;
    _node: Node;
    index: number;
    constructor (node: Node, index: number) {
        this._node = node;
        this.index = index;
        this.txt_nun = UtilNode.getChildComponent(this._node, 'txt_num', Label);
        this.txt_nun.string = `${this.index}`;
        this.img_icon = UtilNode.getChildComponent(this._node, 'img_icon', Sprite);
        this.setDisplay(false);
    }

    setDisplay (isShow: boolean) {
        this.img_icon.node.active = isShow;
    }

    setInfo (item: BagItem) {
        this.img_icon.spriteFrame = ResCache.Instance.getSprite(`img_icon_${item.name}`);
    }
}