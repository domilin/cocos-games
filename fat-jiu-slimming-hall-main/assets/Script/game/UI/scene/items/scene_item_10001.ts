import { _decorator, Component, Node, Vec2, v2 } from 'cc';
import { GFace, GCurFace } from '../../../../config/global';
import { scene_item_parent } from '../scene_item_parent';
const { ccclass, property } = _decorator;

/**
 * 蓝色跑步机
 */
@ccclass('scene_item_10001')
export class scene_item_10001 extends scene_item_parent {
    // face:GFace= GFace.face1
    // curFace:GCurFace = GCurFace.face1
    // itemSize:Vec2=v2(5,3)  //y是左边, x是右边

    start(){
        super.start()
    }

}


