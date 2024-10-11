import { Vector2, ccclass, Move, Maths, _resouces, _config_, _logic, NodeHelper, EEaseType } from "../../../main/script/Main";
import { CCubeOffsetY, CCubesCount, CCubeYSpace, EEntityType, ILogicData } from "../../../main/script/module/define/LogicDefine";
import { Entity } from "./Entity";

const v2T = new Vector2()

@ccclass("CubesUpEntity")
export class CubesUpEntity extends Entity {

    public entityType = EEntityType.CubesUp
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
    }


}