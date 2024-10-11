import { Node, Vec2, Vec3 } from "cc";
import { CBorderBottomEntityUrl, CBorderTopEntityUrl, CCubeEntityUrl, CCubesEntityUrl, CCubesUpEntity, CResoucesLoadPriority, ECubeCreateAnim, ILogicData } from "../../main/script/module/define/LogicDefine";
import { BaseEntityMgr, EEntityState, NodeHelper, _logic } from "../../main/script/Main";
import { Scene } from "./Scene";
import { Entity } from "./entity/Entity";
import { CubesEntity } from "./entity/CubesEntity";
import { CubeEntity } from "./entity/CubeEntity";
import { BorderTopEntity } from "./entity/BorderTopEntity";
import { BorderBottomEntity } from "./entity/BorderBottomEntity";
import { CubesUpEntity } from "./entity/CubesUpEntity";


const v2T = new Vec2()
const v3T = new Vec3()

export class EntityMgr extends BaseEntityMgr<Scene, Entity> {

    protected getQueueResoucesPriority(): number[] { return CResoucesLoadPriority }


    public createCubes(data: ILogicData) {
        let entity = this.create<CubesEntity>(CCubesEntityUrl)
        entity.data = data
        entity.entityStateMackine.change(EEntityState.Load)
        this.scene.cCubesParent.addChild(entity.node)
        return entity
    }

    public createBorderTop(data: ILogicData) {
        let entity = this.create<BorderTopEntity>(CBorderTopEntityUrl)
        entity.data = data
        entity.entityStateMackine.change(EEntityState.Load)
        this.scene.cBorderTopParent.addChild(entity.node)
        return entity
    }

    public createBorderBottom(data: ILogicData) {
        let entity = this.create<BorderBottomEntity>(CBorderBottomEntityUrl)
        entity.data = data
        entity.entityStateMackine.change(EEntityState.Load)
        this.scene.cBorderBottomParent.addChild(entity.node)
        return entity
    }

    public createCubesUp(data: ILogicData) {
        let entity = this.create<CubesUpEntity>(CCubesUpEntity)
        entity.data = data
        entity.entityStateMackine.change(EEntityState.Load)
        this.scene.cCubesUpParent.addChild(entity.node)
        return entity
    }

    public createCube(
        data: ILogicData,
        index: number,
        createAnim: ECubeCreateAnim,
        animMoveIndex: number,
        animMoveAll: number,
    ) {
        let entity = this.create<CubeEntity>(CCubeEntityUrl)
        entity.setData(data, index, createAnim, animMoveIndex, animMoveAll)
        entity.entityStateMackine.change(EEntityState.Load)
        this.scene.cCubeParent.addChild(entity.node)
        entity.entityStateMackine.change(EEntityState.Reset)
        entity.entityStateMackine.change(EEntityState.Run)
        return entity
    }

}