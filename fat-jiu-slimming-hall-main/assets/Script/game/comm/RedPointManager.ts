

import { Node, Prefab, UITransform, v3 } from "cc";
import { Const } from "../../config/Const";
import { comm } from "../../easyFramework/mgr/comm";
import { poolManager } from "../../easyFramework/mgr/poolManager";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { EmailManager } from "./EmailManager";

import { RedPointComm } from "./RedPointComm";
import { userData } from "./UserData";
import { UtilScene } from "./UtilScene";

export enum RPointEvent {
    /**客户端红点起始*/
    RPM_Null = "RPM_Null",
    RPM_Email = "RPM_Email",
    RPM_Tujian = "RPM_Tujian",
    RPM_TujianProp = "RPM_TujianProp",
    RPM_TujianScene = "RPM_TujianScene",


    // 合成界面，可建造红点提示
    composeBuild = "composeBuild",

}

class RedPointManager {
    private static _instance: RedPointManager = null!
    private eventManger = { RPM_Email: false }

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new RedPointManager()

        }
        return this._instance
    }

    public setRedpoint(parent: Node, event: RPointEvent, forece: boolean, scale: number = 1, offsetX: number = 0, offsetY: number = 0) {
        let redPointComm = parent.getComponent(RedPointComm) || parent.addComponent(RedPointComm)
        redPointComm.setRedPointFlag(event, forece)
        let redPointNode = parent.getChildByName("RedPoint")
        if (redPointNode == null) {
            UtilPub.getPrefab(Const.Prefabs.RedPoint, (p: Prefab) => {
                let node = poolManager.instance.getNode(p, parent!)!
                node.name = "RedPoint"
                let uiTransform = node.getComponent(UITransform) || node.addComponent(UITransform)
                node.position = v3(uiTransform.width * (1 - uiTransform.anchorX) - 30 + offsetX, uiTransform.height * (1 - uiTransform.anchorY) - 20 + offsetY, 1);
                node.scale = v3(scale, scale, scale)
                let script = node.getComponent(node.name) as comm
                if (script && event) {
                    script!._layerData.event = event
                }
                redPointComm.setRedPointNode(node)
            })
        } else {
            redPointComm.setRedPointNode(redPointNode)
        }
    }

    public setRedpointFix(parent: Node, event: RPointEvent, forece: boolean) {

        let redPointNode = parent.getChildByName("RedPoint")
        if (redPointNode == null) {
            if (!forece) {
                return
            }
            UtilPub.getPrefab(Const.Prefabs.RedPoint, (p: Prefab) => {
                let node = poolManager.instance.getNode(p, parent!)!
                node.name = "RedPoint"
                let uiTransform = node.getComponent(UITransform) || node.addComponent(UITransform)
                node.position = v3(uiTransform.width * (1 - uiTransform.anchorX) - 30, uiTransform.height * (1 - uiTransform.anchorY) - 20, 1);
                let script = node.getComponent(node.name) as comm
                if (script && event) {
                    script!._layerData.event = event
                }
                node.active = forece
            })
        } else {
            redPointNode.active = forece
        }
    }

    public checkIsShowRedPoint(flag: RPointEvent) {
        let value = false
        switch (flag) {
            case RPointEvent.RPM_Email:
                value = EmailManager.getInstance().isShowNewEmailRedPoint()
                break;
            case RPointEvent.RPM_Tujian:
                value = userData._showPropTujianRed || userData._showSceneTujianRed
                break;

            case RPointEvent.RPM_TujianProp:
                value = userData._showPropTujianRed
                break;
            case RPointEvent.RPM_TujianScene:
                value = userData._showSceneTujianRed
                break;
            case RPointEvent.composeBuild:
                value = UtilScene.isSceneItemCouldBeBuild();
                break;
            default:
                break;
        }
        return value;
    }

}

export const redPointManager = RedPointManager.getInstance()
