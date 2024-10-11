import { Asset, Color, EventTouch, Prefab, Size, SpriteFrame, Vec2, Vec3 } from "cc";
import { CGameData, initData } from "../../../app/GameDefine";
import { EModuleType, BaseModuleEvent, _scene, DataLogicHelper, TResoucesUrl, _ui, _timer, _config_, Vector2, winSize, Rectangle, Sets, Maths, NodeHelper, _platform, MaxBoxCC, _main, _logic, _login, BaseHollow, EventHandlerCC, IVector2, RectHollow, _guide, _language, moduleMgr } from "../Main";
import { CBorderBottomEntityUrl, CBorderTopEntityUrl, CCubeEntityUrl, CCubeOffsetY, CCubeYSpace, CCubesCount, CCubesEntityUrl, CCubesPadding, CCubesSize, ECubeCreateAnim, ECubesType, ELogicCahce, ILogicCache, ILogicData, ILogicReset } from "./define/LogicDefine";
import { Scene } from "../../../scene/script/Scene";
import { IConfigCardItem } from "../../../app/Config";
import { CubeEntity } from "../../../scene/script/entity/CubeEntity";
import { RunUI } from "../../../scene/script/ui/RunUI";

const v2T = new Vector2()

@moduleMgr.add(EModuleType.logicGuide)
export class LogicGuideModule extends BaseModuleEvent {

    private get scene() { return _scene.getCurrent<Scene>() }

    onLogic(): void {

        let clickComplete = (e: EventTouch, data: ILogicData) => {
            this.scene._touchEndData(data)
            _guide.complete()
        }

        let delay = .2
        _guide.addOnce({
            sceneUrl: initData.initSceneUrl,
            enter: (complete) => {
                complete()
            },
            completeIndex: -1,
            datas: [
                () => this._guideUI(0, _language.get(40026), 0, clickComplete),
                () => this._guideUI(2, _language.get(40027), delay, clickComplete),
                () => _ui.onceOpen<RunUI>(CGameData.RunUIUrl, ui => this._guideUIMerge(
                    2,
                    ui,
                    _language.get(40028),
                    (e) => {
                        EventHandlerCC.runClick(ui.cMerge, e)
                        _guide.complete()
                    })
                ),
                () => _ui.onceOpen<RunUI>(CGameData.RunUIUrl, ui => this._guideUIAdds(
                    2,
                    ui,
                    _language.get(40029),
                    (e) => {
                        EventHandlerCC.runClick(ui.cAdds, e)
                        _guide.complete()
                    })
                ),
                () => this._guideUI(0, _language.get(40030), delay, clickComplete),
                () => this._guideUI(1, "", delay, clickComplete),
                () => this._guideUI(2, "", delay, clickComplete),
                () => this._guideUI(1, "", delay, clickComplete),
                () => _ui.onceOpen<RunUI>(CGameData.RunUIUrl, ui => this._guideUIMerge(
                    1,
                    ui,
                    "",
                    (e) => {
                        EventHandlerCC.runClick(ui.cMerge, e)
                        _guide.complete()
                    })
                ),
                () => _ui.onceOpen<RunUI>(CGameData.RunUIUrl, ui => {

                    let rect = new Rectangle()
                    rect.width = 200
                    rect.height = 250

                    let layoutCC = ui.cCreatePrefabToEditorCC_ratio.LayoutCC
                    rect.center = layoutCC.getItemPosition(layoutCC.numItems - 1, true)

                    // 自动关闭
                    let isClose = false
                    let closeFn = () => {
                        if (!isClose)
                            // 完成引导
                            _guide.complete()
                        isClose = true
                    }
                    this._guideUI(
                        -1,
                        _language.get(40031),
                        delay,
                        closeFn,
                        new RectHollow(rect, 10),
                        new Vec2(rect.x + rect.width / 2, rect.y - 50)
                    )

                    _timer.once(this, closeFn, 2)
                }),
                () => _ui.onceOpen<RunUI>(CGameData.RunUIUrl, ui => this._guideUIAdds(
                    -1,
                    ui,
                    "",
                    (e) => {
                        EventHandlerCC.runClick(ui.cAdds, e)
                        _guide.complete()
                    }
                )),
            ]
        })
    }

    private _guideUIMerge(dataIndex: number, ui: RunUI, text: string, click: (e: EventTouch, data: ILogicData) => void) {
        let rect = NodeHelper.getRectangle(new Rectangle(), ui.cMerge, true)
        rect.mulSelf(1.1)

        this._guideUI(
            dataIndex,
            text,
            .5,
            (e, data) => {
                EventHandlerCC.runClick(ui.cMerge, e)
                click(e, data)
            },
            new RectHollow(rect, 10),
            new Vec2(rect.x + rect.width / 2, rect.y + rect.height + 30)
        )
    }

    private _guideUIAdds(dataIndex: number, ui: RunUI, text: string, click: (e: EventTouch, data: ILogicData) => void) {
        let rect = NodeHelper.getRectangle(new Rectangle(), ui.cAdds, true)
        rect.mulSelf(1.1)

        this._guideUI(
            dataIndex,
            text,
            .5,
            (e, data) => {
                EventHandlerCC.runClick(ui.cAdds, e)
                click(e, data)
            },
            new RectHollow(rect, 10),
            new Vec2(rect.x + rect.width / 2, rect.y + rect.height + 30)
        )
    }

    private _guideUI(
        dataIndex: number,
        text: string,
        uiDelay: number,
        click: (e: EventTouch, data: ILogicData) => void,
        hollow2?: BaseHollow,
        textPos?: IVector2,
    ) {

        let hollows: BaseHollow[] = []
        let hollow: RectHollow = null!

        let data: ILogicData = null!

        if (dataIndex != -1) {
            let mul = 1.2
            let rect = new Rectangle()
            rect.width = CCubesSize.x * mul
            rect.height = CCubesSize.y * mul
            data = _logic.data.datas[dataIndex]
            let pos = data.entity.node.worldPosition
            rect.center = pos

            rect.y += 10
            hollow = new RectHollow(rect, 10)
            hollows.push(hollow)

            if (!textPos)
                textPos = new Vec2(pos.x, rect.y + rect.height + 30)
        }

        let eventHollow: BaseHollow = hollow
        if (hollow2) {
            eventHollow = hollow2
            hollows.push(hollow2)
        }
        eventHollow.setAnim(.3)
        eventHollow.isFingerAnim = true
        eventHollow.fingerOffsetPoint = new Vector2(30, -30)
        eventHollow.setClick((e) => {
            _guide.closeMask()
            click(e, data)
        })


        _timer.once(this, () => {
            _guide.mask({
                text: {
                    str: text,
                    worldPos: textPos,
                    delay: .4,
                },
                hollows,
            })
        }, uiDelay)
    }
}