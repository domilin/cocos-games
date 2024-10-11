import { Node } from "cc";
import { Vector2, ccclass, Move, Maths, _resouces, _config_, _logic, NodeHelper, EEaseType, LoadDir } from "../../../main/script/Main";
import { CCubeOffsetY, CCubesCount, CCubeYSpace, EEntityType, ILogicData } from "../../../main/script/module/define/LogicDefine";
import { Entity } from "./Entity";

const v2T = new Vector2()

@ccclass("BorderBottomEntity")
export class BorderBottomEntity extends Entity {

    public entityType = EEntityType.BorderBottom
    public isPut = true
    public isUpdateStateMackine = true
    public isDestroy = false
    public isMoving() {
        return false
    }

    public cALevelComplete: Node = null!

    public data: ILogicData = null!
    public index = -1


    protected onStateEnterReset(): void {
        super.onStateEnterReset()
        this.setPositionXY(this.data.pos, false)
        this.setSelect(_logic.hasMerge(this.data))
        NodeHelper.setOpacity(this.cALevelComplete, 1)
        this.setScaleNum(_logic.scaleRatio, false)

    }

    protected onStateEnterRun(): void {
        super.onStateEnterRun()
    }


    public setSelect(value: boolean) {
        // this.cASelect.active = value
    }

    public setSelect2(value: boolean) {
        NodeHelper.setOpacity(this.cALevelComplete, value ? 0 : 1)
    }


}