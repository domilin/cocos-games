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

import { v2, Node, math, v3, Vec2, Label, Sprite } from "cc";
import { UICom } from "../../core/ui/ui-com";
import { UtilNode } from "../../core/util/util";
import { DataGameInst } from "../data/data-core";
import { Res } from "../../core/res/res";
import { Msg } from "../../core/msg/msg";
import { Level } from "../level/level";
import { BagItem } from "../actor/actor-bag";
import { ResCache } from "../../core/res/res-cache";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_select_equips', (node: Node) => new GrpSelectEquips(node));

export class GrpSelectEquips extends UICom {

    list: Array<GrpSelectItem>;
    img_select_highlight: Node;
    _curIndex = -1;

    constructor (node: Node) {
        super(node);
        //Init circle items.
        const count = DataGameInst._data.count_bag_count;
        this.list = new Array<GrpSelectItem>(count);
        const angle = 360 / count;
        this.img_select_highlight = UtilNode.getChildByName(this._node, 'img_select_highlight');
        this.img_select_highlight.setPosition(100000, 0, 0);
        const item = UtilNode.getChildByName(this._node, 'img_items');
        const radius = item.position.x;
        const offset = angle / 2;
        const V2FORWARD = v2(1, 0);

        const getPosFromAngle = (angle: number) => {
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return { x: x, y: y };
        }

        for (let i = 0; i < count; i++) {
            const currentAngle = angle * i + offset;
            const iAngle = math.toRadian(currentAngle);
            const pos = getPosFromAngle(iAngle);
            const newItem = Res.instNode(item, this._node, v3(pos.x, pos.y, 0));
            this.list[i] = new GrpSelectItem(newItem, currentAngle - 90);
        }

        item.active = false;

        Msg.on('msg_select_equip', (dir: Vec2) => {

            //if (dir.length() <= DataGameInst._data.sensitivity_select_weapon) return;

            let curAngle = math.toDegree(Vec2.angle(dir, V2FORWARD));
            const projOrigin = v2(0, 1);
            const dot = Vec2.dot(projOrigin, dir);

            if (dot < 0) curAngle = 360 - curAngle;
            this._curIndex = Math.round(curAngle / angle);

            if (this._curIndex >= DataGameInst._data.count_bag_count) {
                //console.error(` Calculate equip error current index: ${this._curIndex}, current Angle: ${curAngle}, dir: ${dir}`);
                this._curIndex = DataGameInst._data.count_bag_count - 1;
            }

            const selectAngle = math.toRadian(this._curIndex * angle + offset)
            const pos = getPosFromAngle(selectAngle);
            this.img_select_highlight!.setPosition(pos.x, pos.y, 0);
            this.img_select_highlight.setRotationFromEuler(0, 0, this.list[this._curIndex]._angle);

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

    public off (): void {
        // off ui panel then.
        if (Level.Instance._player)
            Level.Instance._player.onEquip(this._curIndex);
    }

}

class GrpSelectItem {
    txt_nun: Label;
    img_icon: Sprite;
    _node: Node;
    _angle: number;
    constructor (node: Node, angle: number) {
        this._angle = angle;
        this._node = node;
        const img_bg = UtilNode.getChildByName(this._node, 'img_bg');
        img_bg.setRotationFromEuler(0, 0, angle);
        this.txt_nun = UtilNode.getChildComponent(this._node, 'txt_num', Label);
        this.img_icon = UtilNode.getChildComponent(this._node, 'img_icon', Sprite);
    }

    setDisplay (isShow: boolean) {
        this.txt_nun!.node.active = isShow;
        this.img_icon!.node.active = isShow;
    }

    setInfo (item: BagItem) {
        this.txt_nun!.string = item.count.toString();
        this.img_icon!.spriteFrame = ResCache.Instance.getSprite(`img_icon_${item.name}`);
    }
}