import { _decorator, Component, Node, CharacterController, CapsuleCharacterController } from 'cc';
import { Gizmo } from './util';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('CharacterRender')
@executeInEditMode
export class CharacterRender extends Component {

    charactor: CapsuleCharacterController;

    onEnable () {
        this.charactor = this.getComponent(CapsuleCharacterController);
    }

    update (deltaTime: number) {
        Gizmo.drawCapsule(this.node.worldPosition, this.charactor.center, this.charactor.radius, this.charactor.height);
    }
}

