import { Material, MeshRenderer, Node } from "cc";
import { BaseEntity, EEaseType, IVector2, Move, Vector2, _scene, ccclass } from "../../../main/script/Main";
import { CCubeSelectOffsetY, EEntityType } from "../../../main/script/module/define/LogicDefine";
import { Scene } from "../Scene";


const v2T = new Vector2()

@ccclass("Entity")
export abstract class Entity extends BaseEntity {

    public abstract entityType: EEntityType
    public abstract isPut: boolean
    public abstract isUpdateStateMackine: boolean | (() => boolean)
    public abstract isDestroy: boolean
    public abstract isMoving(): boolean

    public get scene() { return _scene.getCurrent<Scene>() }
    protected _move = new Move()
    protected isShake = false

    protected onStateEnterLoad(): void {
        super.onStateEnterLoad()
        this._move.init(this.node, false, 800)
    }

    protected onStateUpdateRun(): void {
        super.onStateUpdateRun()
        this._move.onUpdate()
    }

    public shake() {
        this.isShake = true
        let pos = this.node.position
        this._move.setRunData(5, (data, index) => {
            data.target.y = pos.y
            data.speedMul = .3
            switch (index) {
                case 0:
                    data.target.x = 5
                    break
                case 1:
                    data.target.x = -10
                    break
                case 2:
                    data.target.x = 10
                    break
                case 3:
                    data.target.x = -5
                    break
                case 4:
                    data.target.x = 0
                    break
            }
            data.target.x += pos.x
        })
        this._move.run(() => {
            this.isShake = false
        })
    }

    public select(value: boolean, pos: IVector2, complete?: () => void) {
        let addY = 0
        if (value)
            addY = CCubeSelectOffsetY

        this._move.setRunData(1, data => {
            Vector2.set(data.target, pos)
            data.target.y += addY
            if (value) {
                data.speedMul = .7
                data.ease = EEaseType.quadOut
            }
        })
        this._move.run(complete)
    }

    protected onStateEnterExit(arg?: string) {
        this._move.clear()
        this.isShake = false
        super.onStateEnterExit()
    }

}