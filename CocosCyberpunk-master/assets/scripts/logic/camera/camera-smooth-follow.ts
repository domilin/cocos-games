import { _decorator, Component, Node, Quat, quat, v3, Vec3 } from 'cc';
import { GMath, GVec3 } from '../../core/util/g-math';
import { Util, UtilNode } from '../../core/util/util';
import { Msg } from '../../core/msg/msg';
const { ccclass, property } = _decorator;

@ccclass('CameraSmoothFollow')
export class CameraSmoothFollow extends Component {

    @property(Node)
    targetLocalNode: Node;

    @property(Node)
    localNode: Node;

    @property(Node)
    targetNode: Node;

    pos = v3(0, 0, 0);
    rotation = quat(0, 0, 0, 0);

    localPos = v3(0, 0, 0);

    @property
    smoothVelocity = v3(1, 1, 1);
    targetLocalPos = v3(0, 0, 0);

    disPos = v3(0, 0, 0);

    start () {
        Msg.on('msg_set_camera_node', this.setTarget.bind(this));
        //this.localNode.active = false;
    }

    protected onDestroy (): void {
        Msg.off('msg_set_camera_node', this.setTarget.bind(this));
    }

    setTarget (node: Node) {

        this.targetNode = node;
        this.targetLocalNode = UtilNode.find(node, 'camera_player');
        this.pos.set(this.targetNode.worldPosition);
        this.rotation.set(this.targetNode.worldRotation);
        this.localNode.active = true;

    }

    update (deltaTime: number) {

        if (!this.targetNode) return;
        if (!this.targetLocalNode) return;
        if (this.targetLocalNode.worldPosition == null) return;
        if (this.targetLocalNode.worldPosition == null) return;

        Vec3.lerp(this.pos, this.pos, this.targetNode.worldPosition, deltaTime * 15);
        this.node.setWorldPosition(this.targetNode.worldPosition);
        this.disPos.set(this.targetNode.worldPosition).subtract(this.pos);
        this.localPos.set(this.targetLocalNode.worldPosition);
        this.localPos.subtract(this.disPos);
        this.localNode.setWorldPosition(this.localPos);
        this.localNode.setWorldRotation(this.targetLocalNode.worldRotation);

    }
}

