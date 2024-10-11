import { Color, geometry, Material, MeshRenderer, Node, Quat, Size, Sprite, SpriteFrame, Texture2D, Vec2, Vec3 } from "cc";
import { Vector2, ccclass, Move, Maths, StateMackine, NodeHelper, TweenHelper, ETweenType, _logic, _resouces, _config_, _logicLevel, _gameType } from "../../../main/script/Main";
import { CCubesCount, ECubesType, EEntityType, ILogicData } from "../../../main/script/module/define/LogicDefine";
import { Entity } from "./Entity";
import { EGameType } from "../../../main/script/module/define/GameTypeDefine";

const v2T = new Vector2()
const v3T = new Vec3()


@ccclass("CubesEntity")
export class CubesEntity extends Entity {

    public entityType = EEntityType.Cubes
    public isPut = true
    public isUpdateStateMackine = true
    public isDestroy = false
    public isMoving() {
        return false
    }

    private cSprite_icon: Sprite = null!

    public data: ILogicData = null!


    protected onStateEnterLoad(): void {
        super.onStateEnterLoad()
        this.updateType()

        if (_gameType.type == EGameType.endless)
            this.cSprite_icon.node.active = false
        else {
            if (this.data.configId && this.data.configId > 0) {
                this.cSprite_icon.node.active = true
                let id = _logic.converNumById(this.data.configId)
                this.cSprite_icon.color = _logic.cardColors[id].icon
            }
            else
                this.cSprite_icon.node.active = false
        }

        // 取消限制
        NodeHelper.setOpacity(this.cSprite_icon.node, 0)
    }

    protected onStateEnterReset(): void {
        super.onStateEnterReset()
        this.setPositionXY(this.data.pos, false)
        this.setScaleNum(_logic.scaleRatio, false)
        this.updateLevel()
    }

    protected onStateUpdateRun(): void {
        super.onStateUpdateRun()
    }

    public updateLevel() {
        if (_gameType.type == EGameType.endless) {
            this.cSprite_icon.node.active = false
            this.data.borderBottom.cALevelComplete.active = false
        }
        else {
            let isComplete = _logicLevel.dataComplete(this.data)

            if (isComplete) {
                this.cSprite_icon.node.active = false
                this.data.borderBottom.cALevelComplete.active = true
            }
            else {
                if (this.data.configId && this.data.configId > 0)
                    this.cSprite_icon.node.active = true
                else
                    this.cSprite_icon.node.active = false
                this.data.borderBottom.cALevelComplete.active = false
            }
        }


    }

    public updateType(lastType?: ECubesType) {
        let fn = () => {
            this.SwitchChildrenCC.index = this.data.type
            this.Mask.enabled = false
            this.AnimtorCC.play("cubes")
        }
        if (lastType !== undefined) {
            this.Mask.enabled = true

            switch (lastType) {
                case ECubesType.unlock:
                    this.AnimtorCC.play("cubesUp", 0, fn)
                    break
                case ECubesType.tempVideo:
                    this.AnimtorCC.play("cubesUp", 0, fn)
                    break
                case ECubesType.data:
                    this.SwitchChildrenCC.index = this.data.type
                    this.AnimtorCC.play("cubesDown", 0, fn)
                    break
                default:
                    fn()
                    break
            }
        }
        else
            fn()
    }


}