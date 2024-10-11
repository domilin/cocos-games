import { _decorator, Color, Component, Node, v3 } from 'cc';
import { Gizmo } from './util';
import { EDITOR } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('BoneRender')
@executeInEditMode
export class BoneRender extends Component {

    @property
    showDebug = true;

    @property
    showRunTime = false;

    @property(Node)
    boneRoot:Node | undefined;

    @property
    boneSize = 0.01;

    @property(Color)
    boneColor:Color = new Color(255, 0, 0, 255);

    size = v3(0.1, 0.1, 0.1);

    start() {
        
    }

    protected onEnable(): void {
        if(this.boneRoot == undefined) {
            this.boneRoot = this.node.children[0];
        }
    }

    renderBone(node:Node) {
        Gizmo.drawBox(node.worldPosition, this.size, this.boneColor);
        const childrenNode = node.children;
        if(childrenNode.length <= 0) return;
        for(let i = 0; i < childrenNode.length; i++) {
            const child = childrenNode[i];
            const center = child.worldPosition;
            Gizmo.drawLine(node.worldPosition, center, this.boneColor);
            this.renderBone(child);
        }
    }

    lateUpdate(deltaTime: number) {

        if(!EDITOR && !this.showRunTime) return;
        
        if(!this.showDebug) return;

        if(!this.boneRoot) return;

        this.size.x = this.boneSize;
        this.size.y = this.boneSize;
        this.size.z = this.boneSize;

        this.renderBone(this.boneRoot);

    }
}