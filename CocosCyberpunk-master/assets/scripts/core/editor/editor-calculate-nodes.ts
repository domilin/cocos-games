import { _decorator, Component, Node } from 'cc';
import { EDITOR } from 'cc/env';
import { UtilNode } from '../util/util';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('EditorCalculateNodes')
@executeInEditMode
export class EditorCalculateNodes extends Component {

    protected onEnable (): void {
        if (EDITOR) {
            const ls = UtilNode.getChildren(this.node);
            console.log('collider count:', ls.length);
        }
    }

}

