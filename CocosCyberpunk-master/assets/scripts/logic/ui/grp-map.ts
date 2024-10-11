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

import { v3, Node } from "cc";
import { UICom } from "../../core/ui/ui-com";
import { UtilNode, UtilVec3 } from "../../core/util/util";
import { Res } from "../../core/res/res";
import { Msg } from "../../core/msg/msg";
import { Level } from "../level/level";
import { UIBind } from "../../core/ui/ui-bind";

UIBind.on('grp_map', (node: Node) => new GrpMap(node));

export class GrpMap extends UICom {

    list: Array<Node>;

    map: Node;

    constructor (node: Node) {
        super(node);

        this.map = UtilNode.find(this._node, 'map');
        const img_enemy_point = UtilNode.find(this._node, 'img_enemy_point');
        const count = 20;
        this.list = new Array(count);
        this.list[0] = img_enemy_point;

        for (let i = 1; i < count; i++) {
            let newPoint = Res.instNode(img_enemy_point, img_enemy_point.parent!, v3(10000, 0, 0));
            this.list[i] = newPoint;
        }

        let position = v3(0, 0, 0);

        const map_width = 1158 * 0.2;
        const map_height = 1172 * 0.2;

        const world_map_width = 110;
        const world_map_height = 110;

        const offset_x = 61.846;
        const offset_y = 95.363;

        const scale_x = map_width / world_map_width;
        const scale_y = map_height / world_map_height;

        Msg.on('msg_update_map', () => {

            const player = Level.Instance._player;
            if (player !== undefined && player.node) {
                UtilVec3.copy(position, player.node.position);
                const y = position.x * scale_x;
                const x = position.z * scale_y;
                position.z = 0;
                position.x = -x;
                position.y = -y;
                this.map.setPosition(position);
            }

            const enemies = Level.Instance._enemies;
            const enemyCount = enemies.length;
            for (let i = 0; i < count; i++) {
                const hasEnemy = i < enemyCount
                const currentNode = this.list[i];
                if (!hasEnemy) {
                    currentNode.setPosition(10000, 0, 0);
                    continue;
                }
                UtilVec3.copy(position, enemies[i].position);
                const y = position.x * scale_x;
                const x = position.z * scale_y;
                position.z = 0;
                position.x = x;
                position.y = y;
                this.list[i].setPosition(position.x, position.y, position.z);
            }

        });
    }

}