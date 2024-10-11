import { Vector2, ccclass, Move, Maths, _resouces, _config_, _logic, NodeHelper, EEaseType } from "../../../main/script/Main";
import { CCubeOffsetY, CCubesCount, CCubeYSpace, EEntityType, ILogicData } from "../../../main/script/module/define/LogicDefine";
import { Entity } from "./Entity";

const v2T = new Vector2()

@ccclass("BorderTopEntity")
export class BorderTopEntity extends Entity {

    public entityType = EEntityType.BorderTop
    public isPut = true
    public isUpdateStateMackine = true
    public isDestroy = false
    public isMoving() {
        return false
    }

    public data: ILogicData = null!
    public index = -1

    protected onStateEnterReset(): void {
        super.onStateEnterReset()
        this.setPositionXY(this.data.pos, false)
        this.setSelect(_logic.hasMerge(this.data))
        this.setScaleNum(_logic.scaleRatio, false)
    }

    public setSelect(value: boolean) {
        this.Sprite.enabled = value
    }

}