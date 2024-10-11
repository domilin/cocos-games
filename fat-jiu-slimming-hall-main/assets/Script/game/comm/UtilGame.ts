import { _decorator, Node, v3, v2, Vec2, Vec3, UITransform, Prefab } from 'cc';
import { Const } from '../../config/Const';
import { GCurFace, GTypeStrNode } from '../../config/global';
import { comm } from '../../easyFramework/mgr/comm';
import tables from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { uiManager } from '../../easyFramework/mgr/uiManager';
const { ccclass, property } = _decorator;

/**
 * 本游戏中特有的工具类
 */
@ccclass('UtilGame')
export class UtilGame extends comm {

    //获得常量表数据
    public static const(code: string) {
        return tables.ins().getTableValueByKey(Const.Tables.const, "code", code).val
    }

    //获得ui信息
    public static ui(code: string): string {
        return tables.ins().getTableValueByKey(Const.Tables.ui, "code", code).name
    }

    //获得ui信息
    public static language(code: string): string {
        return tables.ins().getTableValueByKey(Const.Tables.language, "key", code).chinese
    }

    //获得最近的节点
    public static getNearestNode(centerNode: Node, nodes: GTypeStrNode): Node {
        let min = 10000
        let minNode: Node = null!

        for (let strkey in nodes) {
            if (nodes.hasOwnProperty(strkey)) {
                let n = nodes[strkey]
                let dis = UtilPub.getDis(centerNode.worldPosition, n.worldPosition)
                if (dis < min) {
                    min = dis
                    minNode = n
                }
            }
        }
        return minNode
    }

    //关闭场景
    public static sceneClose() {
        uiManager.instance.hideDialog(Const.Dialogs.main)
        Const.SceneNode.active = false
    }
    //开启场景
    public static sceneOpen() {
        uiManager.instance.showDialog(Const.Dialogs.main)
        Const.SceneNode.active = true
    }

}

