import { Asset } from "cc";
import { Maths, RandomSeed, TResoucesUrl, _gameType, _logic, _ui } from "../../Main";
import { EGameType, IGameTypeLogic, gameTypeModule } from "../define/GameTypeDefine";
import { initData } from "../../../../app/GameDefine";



@gameTypeModule.add(EGameType.index)
export class IndexGameType implements IGameTypeLogic {

    public preLoadRes(res: TResoucesUrl<Asset>[]) {
    }

    public run(...param: any[]) {
        _gameType.logicRun(
            Maths.minToMax(0, 100000),
            () => {
                _logic.create(
                    [0, 0],
                )
            },
            (isWin) => {

            }
        )
        _gameType.isRun = false
        _ui.open(initData.uiUrl.index)
    }

}