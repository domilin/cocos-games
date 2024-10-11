import { Asset } from "cc";
import { CGameData, initData } from "../../../../app/GameDefine";
import { ILevelSelectUIData } from "../../../../scene/script/ui/LevelSelectUI";
import { LevelHelper, Maths, RandomSeed, TResoucesUrl, _config_, _gameType, _logic, _prop, _timer, _ui, winCenterPostion } from "../../Main";
import { EGameType, IGameTypeLogic, gameTypeModule } from "../define/GameTypeDefine";


@gameTypeModule.add(EGameType.endless)
export class EndlessGameType implements IGameTypeLogic {
    public preLoadRes(res: TResoucesUrl<Asset>[]) {
        res.push(..._logic.preLoadRes)
    }

    public run() {

        _ui.close(CGameData.LevelSelectUrl)
        _ui.close(initData.uiUrl.index)


        _gameType.logicRun(
            -1,
            () => {
                _logic.create([4, 3])
            },
            (isWin) => {

            }
        )

        _ui.open(CGameData.RunUIUrl)
    }

    public reset() {
        _logic.storage.delete(_logic.getCacheKey())
        _gameType.run(_gameType.type)
    }

}