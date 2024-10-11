// console.log("main run " + Date.now())


import "./apeng.js"

import { Asset } from "cc"
import { EDITOR } from "cc/env"
import { TConfigFileName, ConfigFileName } from "../../app/Config"
import { initData } from "../../app/GameDefine"

import { LogicModule } from "./module/LogicModule"
import { GameTypeModule } from "./module/GameTypeModule.js"
import { LogicLevelModule } from "./module/LogicLevelModule.js"
import { LogicGuideModule } from "./module/LogicGuideModule.js"


/**配置 */
export let _config_: apeng.ConfigHelper<TConfigFileName> = null!

export let _scene: apeng.SceneModule = null!
export let _ui: apeng.UIModule = null!
export let _audio: apeng.AudioModule = null!
export let _gm: apeng.GmModule = null!
export let _guide: apeng.GuideModule = null!
export let _language: apeng.LanguageModule = null!
export let _login: apeng.LoginModule = null!
export let _main: apeng.MainModule = null!
export let _platform: apeng.PlatformModule = null!
export let _privacy: apeng.PrivacyModule = null!
export let _resouces: apeng.ResoucesModule = null!
export let _timer: apeng.TimerModule = null!
export let _prop: apeng.PropModule = null!
export let _rank: apeng.RankModule = null!

export let _gameType: GameTypeModule = null!
export let _logic: LogicModule = null!
export let _logicLevel: LogicLevelModule = null!
export let _logicGuide: LogicGuideModule = null!

if (!EDITOR) {
    // 等待其他模块装载器加入
    setTimeout(() => {
        const { initCore, EInitCoreState } = apeng
        // 初始化框架
        initCore(initData, (state) => {
            switch (state) {
                case EInitCoreState.init:
                    _scene = apeng._scene
                    _ui = apeng._ui
                    _audio = apeng._audio
                    _gm = apeng._gm
                    _guide = apeng._guide
                    _language = apeng._language
                    _login = apeng._login
                    _main = apeng._main
                    _platform = apeng._platform
                    _privacy = apeng._privacy
                    _resouces = apeng._resouces
                    _timer = apeng._timer
                    _prop = apeng._prop
                    _rank = apeng._rank

                    _logic = moduleMgr.get(EModuleType.logic)
                    _gameType = moduleMgr.get(EModuleType.gameType)
                    _logicGuide = moduleMgr.get(EModuleType.logicGuide)
                    _logicLevel = moduleMgr.get(EModuleType.logicLevel)
                    break
                case EInitCoreState.config:
                    _config_ = apeng._config_ as any
                    break
            }
        })
    })
}

/**业务模块 暂内置40个系统模块*/
export enum EModuleType {
    gameType = 40,
    logic,
    logicLevel,
    logicGuide,
}


export type IVector2 = apeng.IVector2
export type TVectorSet = apeng.TVectorSet
export type RandomSeed = apeng.RandomSeed
export type PropHelper = apeng.PropHelper
export type LevelHelper<T, S> = apeng.LevelHelper<T, S>
export type TResoucesUrl<T extends Asset> = apeng.TResoucesUrl<T>
export type IntervalTimeHelper = apeng.IntervalTimeHelper
export type DataLogicHelper<T> = apeng.DataLogicHelper<T>
export type SwitchSpriteCC = apeng.SwitchSpriteCC
export type SpriteLoaderCC = apeng.SpriteLoaderCC
export type ButtonCC = apeng.ButtonCC
export type SwitchChildrenCC = apeng.SwitchChildrenCC
export type ListCCByBaseItemCC = apeng.ListCCByBaseItemCC
export type Vector2 = apeng.Vector2
export type Vector3 = apeng.Vector3
export type Rectangle = apeng.Rectangle
export type IConfigBase = apeng.IConfigBase
export type IConfigItemBase = apeng.IConfigItemBase
export type CreatePrefabToEditorCC = apeng.CreatePrefabToEditorCC
export type CreatePrefabToEditorOnceCC = apeng.CreatePrefabToEditorOnceCC
export type AnimtorByTweenCC = apeng.AnimtorByTweenCC
export type IGMData = apeng.IGMData
export type BaseHollow = apeng.BaseHollow
export type IGuideClickUI = apeng.IGuideClickUI
export type IGuideMaskUI = apeng.IGuideMaskUI
export type IGuideMaskUIDrag = apeng.IGuideMaskUIDrag
export type IGuideFingerUI = apeng.IGuideFingerUI
export type IGuideClickUIFinger = apeng.IGuideClickUIFinger
export type IGuideDialogueUI = apeng.IGuideDialogueUI
export type IGuideMaskUIText = apeng.IGuideMaskUIText
export type NodeHollow = apeng.NodeHollow
export type RectHollow = apeng.RectHollow
export type CircleHollow = apeng.CircleHollow
export type PolygonHollow = apeng.PolygonHollow
export type ScaleAnim = apeng.ScaleAnim
export type IConfigPlatform = apeng.IConfigPlatform
export type IConfigLanguage = apeng.IConfigLanguage
export type IConfigProp = apeng.IConfigProp
export type IConfigProvinceItem = apeng.IConfigProvinceItem
export type IConfigCountryItem = apeng.IConfigCountryItem
export type AnimtorCC = apeng.AnimtorCC
export type PoolOnce<V> = apeng.PoolOnce<V>
export type ColliderGroup = apeng.ColliderGroup
export type LayoutCC = apeng.LayoutCC
export type LayoutCircleCC = apeng.LayoutCircleCC
export type BaseComponent = apeng.BaseComponent
export type EditorParseDataCC<T> = apeng.EditorParseDataCC<T>
export type Circle = apeng.Circle
export type SpriteFrameAnimCC = apeng.SpriteFrameAnimCC
export type P2World<T extends number> = apeng.P2World<T>
export type P2Group<T extends number> = apeng.P2Group<T>
export type P2ShapeEditorCC = apeng.P2ShapeEditorCC
export type P2ConstraintEditorCC = apeng.P2ConstraintEditorCC
export type P2Body = apeng.P2Body
export type Collider2DEditorCC = apeng.Collider2DEditorCC
export type Collider2DPoint = apeng.Collider2DPoint
export type Collider2DBox = apeng.Collider2DBox
export type Collider2DCircle = apeng.Collider2DCircle
export type Collider2DPolygon = apeng.Collider2DPolygon
export type Collider2DRoot = apeng.Collider2DRoot
export type StateMackine<T> = apeng.StateMackine<T>
export type Rotate360Anim = apeng.Rotate360Anim
export type IntervalAnim = apeng.IntervalAnim
export type Move = apeng.Move
export type ModuleMgr<T> = apeng.ModuleMgr<T>
export type IBaseModule = apeng.IBaseModule
export type BaseModule = apeng.BaseModule
export type BaseInstanceStorage = apeng.BaseInstanceStorage
export type EUILayer = apeng.EUILayer
export type IUIModule = apeng.IUIModule

export const {
    IntervalAnim,
    ModuleMgr,
    Rotate360Anim,
    Collider2DPoint,
    Collider2DBox,
    Collider2DCircle,
    Collider2DPolygon,
    Collider2DRoot,
    Collider2DEditorCC,
    P2ShapeEditorCC,
    P2ConstraintEditorCC,
    P2Group,
    P2World,
    SpriteFrameAnimCC,
    requireComponent,
    Circle,
    EditorParseDataCC,
    executeInEditMode,
    LayoutCircleCC,
    LayoutCC,
    JS,
    ColliderGroup,
    ScaleAnim,
    PoolOnce,
    NodeHollow,
    RectHollow,
    CircleHollow,
    PolygonHollow,
    EventHandlerCC,
    ccclass,
    property,
    BaseUI,
    MoveCC,
    LoadDir,
    EUILayer,
    moduleMgr,
    BaseModule,
    BaseModuleEvent,
    EBlockOnceAdType,
    EPlatformType,
    EBottomAdType,
    BaseScene,
    Vector2,
    Vector3,
    Rectangle,
    Polygon,
    BaseEntityMgr,
    EEntityState,
    Move,
    Maths,
    NodeHelper,
    PropHelper,
    PropsHelper,
    RandomSeed,
    StateMackine,
    CompleteCallBack,
    IntervalTimeHelper,
    LevelHelper,
    EUIState,
    Times,
    DataLogicHelper,
    BaseEntity,
    SwitchSpriteCC,
    SpriteLoaderCC,
    BaseComponent,
    ButtonCC,
    ELanguageType,
    SwitchChildrenCC,
    ListCCByBaseItemCC,
    winSize,
    winCenterPostion,
    Sets,
    Maps,
    EEaseType,
    TweenHelper,
    ETweenType,
    CreatePrefabToEditorCC,
    CreatePrefabToEditorOnceCC,
    AnimtorByTweenCC,
    MaxBoxCC,
    menu,
    BaseHollow,
    CGuideDefine,
} = apeng

