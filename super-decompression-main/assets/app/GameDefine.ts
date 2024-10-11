
import { ConfigFileName, TConfigFileName } from "./Config";
import { LanguageDefineConfig } from "./LanguageDefineConfig";
import "./CCImport"
import { sys } from "cc";
import { HTML5, OPPO, VIVO } from "cc/env";

type TPlatformType = keyof typeof apeng.EPlatformType

/**平台 */
let platformType: TPlatformType = "web"

if (!HTML5) {
    // 自动判断平台
    if (window["wx"])
        platformType = "wx"
    if (window["qq"])
        platformType = "qq"
    if (window["tt"])
        platformType = "tt"
}
if (OPPO)
    platformType = "oppo"
if (VIVO)
    platformType = "vivo"

/**默认语言 */
const defaultType: keyof typeof apeng.ELanguageType = "chinese"

const chinaLanguage = (defaultType as any) == "chinese"

let _type = platformType as any
const IsNativeAd = _type == "oppo" || _type == "vivo"
/**内部自定义常量逻辑 */
export const CGameData = {
    /**固定种子随机数递增 */
    seedRandomIndex: 0,
    /**时间道具id */
    propTimeId: 4,
    /**时间道具减少的时间 */
    timeSub: 5 * 60,
    SettingUrl: "setting/prefab/SettingUI",
    PropGetUrl: "scene/prefab/ui/PropGetUI",
    FailUrl: "scene/prefab/ui/FailUI",
    LevelSelectUrl: "scene/prefab/ui/LevelSelectUI",
    SuccessUrl: "scene/prefab/ui/" + (IsNativeAd ? "SuccessNativeUI" : "SuccessUI"),
    ToDayPropUrl: "scene/prefab/ui/ToDayPropUI",
    RunUIUrl: "scene/prefab/ui/RunUI",
}

export const initData: apeng.IInitData = {
    gameName: "超级解压管",
    server: {
        gameId: "",
        requestIp: "",
    },
    rewardVideoUseShare: false,
    useModuleStorageType: true,
    configPlatform: "platform",
    isTest: true,
    isLog: true,
    isWaitScene: true,
    platformType,
    openWebSimulationUI: true,
    useWebSimulationUI: false,
    openPrivacy: (<TPlatformType[]>[
        // "web",
        "qq",
        "vivo",
        "oppo",
    ]).indexOf(platformType) !== -1 && chinaLanguage,
    showLoadingText: (<TPlatformType[]>[
        "web",
        "wx",
        "tt",
        "oppo",
        "vivo",
        "ks",
        "xiaomi",
        "hbs",
        "qq",
    ]).indexOf(platformType) !== -1 && chinaLanguage,
    versionId: (_type == "wx" || _type == "web") ? "" : "2023SA0060416",
    openGm: false,
    loadingCompleteColorAnim: "#EEF2FE",
    initSceneUrl: "scene/scene/Scene",
    audioClickUrl: "main/audio/click_sound",
    configUrl: _type == "overseas_kwai" && (defaultType as any) == "english" ? "config/configs2" : "config/configs",
    touchMovePrefabUrl: "main/particle/touchMove/prefab",
    touchClickPrefabUrl: "",
    sceneChangeWaitUrl: "",
    uiUrl: {
        index: "main/prefab/index/Index" + (chinaLanguage ? "" : "2") + "UI",
        indexBg: "main/prefab/index/IndexBgUI",
        prop: "",
        sidebar: "",
    },
    startBlockAd: 0,
    share: {
        callTime: 0,
        list: {
            title: [
                "一口气玩了20关，根本停不下来。",
                "@你，这是一款超难消除游戏",
                "超还上头的消除游戏，来冲吧",
                "不通关谁都别睡觉！",
            ],
            imgUrl: [],
        },
        templateId: [],
    },
    newUseEnterGame: true,
    loadingDuration: 0,
    configDefine: ConfigFileName,
    languageDefine: LanguageDefineConfig,
    getLanguageType: () => {
        let value = sys.localStorage.getItem("language")
        if (value === null || value === "null" || value === undefined || value === "")
            return defaultType
        let type = Number(value)
        if (isNaN(type))
            return defaultType
        return defaultType
    },
}
