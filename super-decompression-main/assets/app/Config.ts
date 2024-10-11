import { IConfigBase, IConfigCountryItem, IConfigItemBase, IConfigLanguage, IConfigPlatform, IConfigProp, IConfigProvinceItem } from "../main/script/Main"


export const ConfigFileName = {
    main: <any>"value",
    platform: <IConfigPlatform>null!,
    language: <IConfigLanguage>null!,
    prop: <IConfigProp>null!,
    province_item: <IConfigProvinceItem>null!,
    level_item: <IConfigLevelItem>null!,
    today_item: <IConfigToDayItem>null!,
    constom_item: <IConfigLevelItem>null!,
    card_item: <IConfigCardItem>null!,
}

export type TConfigFileName = typeof ConfigFileName

export interface IConfigCardItem extends IConfigItemBase {
    /**字体颜色 */
    font_color: string
    /**关卡模式小标 */
    level_icon_color: string
}

export interface IConfigToDayItem extends IConfigLevelItem {
    /**单个时间（累加总时间（分）） */
    time: number
}

export interface IConfigLevelItem extends IConfigBase {
    /**大小(x;y) */
    size: number[]
    /**1播放难度飙升动画 */
    anim: 0 | 1
    /**1播放新手引导手指提示 */
    tip: 0 | 1
    /**随机种子（默认使用关卡id随机， 大于0，当前数字随机，等于0关卡id随机，小于0纯随机） */
    seed_id: number,
    /**视频个数 */
    video_count: number
    /**指定颜色id顺序 */
    crad_id: number[]
    /**指定颜色id对应的个数 */
    crad_count: number[]
    /**1随机排列颜色id，反之顺序排列 */
    card_random: 1 | 0
}