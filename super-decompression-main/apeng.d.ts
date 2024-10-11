import * as _cc_ from 'cc';
declare global {
/**cc模块导入 */
 namespace apeng {
    const CCFloat: _cc_.__private._cocos_core_data_utils_attribute__PrimitiveType<number>, math: typeof _cc_.math, ViewGroup: typeof _cc_.ViewGroup, CCInteger: _cc_.__private._cocos_core_data_utils_attribute__PrimitiveType<number>, native: typeof _cc_.native, sys: {
        Feature: typeof _cc_.__private._pal_system_info_enum_type_feature__Feature;
        hasFeature(feature: _cc_.__private._types_globals__EnumAlias<typeof _cc_.__private._pal_system_info_enum_type_feature__Feature>): boolean;
        NetworkType: typeof _cc_.__private._pal_system_info_enum_type_network_type__NetworkType;
        Language: typeof _cc_.__private._pal_system_info_enum_type_language__Language;
        OS: typeof _cc_.__private._pal_system_info_enum_type_operating_system__OS;
        Platform: typeof _cc_.__private._pal_system_info_enum_type_platform__Platform;
        BrowserType: typeof _cc_.__private._pal_system_info_enum_type_browser_type__BrowserType;
        isNative: boolean;
        isBrowser: boolean;
        isMobile: boolean;
        isLittleEndian: boolean;
        platform: _cc_.__private._pal_system_info_enum_type_platform__Platform;
        language: _cc_.__private._pal_system_info_enum_type_language__Language;
        languageCode: string;
        os: _cc_.__private._pal_system_info_enum_type_operating_system__OS;
        osVersion: string;
        osMainVersion: number;
        browserType: _cc_.__private._pal_system_info_enum_type_browser_type__BrowserType;
        browserVersion: string;
        isXR: boolean;
        windowPixelResolution: _cc_.math.Size;
        capabilities: {
            canvas: boolean;
            opengl: boolean;
            webp: boolean;
            imageBitmap: boolean;
            touches: boolean;
            mouse: boolean;
            keyboard: boolean;
            accelerometer: boolean;
        };
        localStorage: Storage;
        getNetworkType(): _cc_.__private._pal_system_info_enum_type_network_type__NetworkType;
        getBatteryLevel(): number;
        garbageCollect(): void;
        isObjectValid(obj: any): boolean;
        dump(): void;
        openURL(url: any): void;
        init(): void;
        now(): number;
        restartVM(): void;
        getSafeAreaRect(): _cc_.math.Rect;
    }, input: _cc_.Input, assetManager: _cc_.AssetManager, AudioSource: typeof _cc_.AudioSource, director: _cc_.Director, Size: typeof _cc_.math.Size, view: _cc_.View, Vec2: typeof _cc_.math.Vec2, Director: typeof _cc_.Director, Canvas: typeof _cc_.Canvas, sp: typeof _cc_.sp, js: typeof _cc_.js, game: _cc_.Game, Game: typeof _cc_.Game, TextAsset: typeof _cc_.TextAsset, Color: typeof _cc_.math.Color, Vec3: typeof _cc_.math.Vec3, ccenum: typeof _cc_.ccenum, Graphics: typeof _cc_.Graphics, Animation: typeof _cc_.Animation, Node: typeof _cc_.Node, Widget: typeof _cc_.Widget, BlockInputEvents: typeof _cc_.BlockInputEvents, Camera: typeof _cc_.Camera, Collider2D: typeof _cc_.Collider2D, Component: typeof _cc_.Component, dragonBones: typeof _cc_.dragonBones, EditBox: typeof _cc_.EditBox, EventKeyboard: typeof _cc_.EventKeyboard, EventMouse: typeof _cc_.EventMouse, EventTouch: typeof _cc_.EventTouch, Input: typeof _cc_.Input, isValid: typeof _cc_.isValid, Label: typeof _cc_.Label, Layout: typeof _cc_.Layout, Mask: typeof _cc_.Mask, MeshRenderer: typeof _cc_.MeshRenderer, MotionStreak: typeof _cc_.MotionStreak, PageView: typeof _cc_.PageView, RigidBody2D: typeof _cc_.RigidBody2D, Scene: typeof _cc_.Scene, ScrollBar: typeof _cc_.ScrollBar, ScrollView: typeof _cc_.ScrollView, Sprite: typeof _cc_.Sprite, UIOpacity: typeof _cc_.UIOpacity, UIRenderer: typeof _cc_.UIRenderer, UITransform: typeof _cc_.UITransform, warn: typeof _cc_.warn, lerp: typeof _cc_.math.lerp, instantiate: typeof _cc_.instantiate, CCObject: typeof _cc_.CCObject, Asset: typeof _cc_.Asset, Prefab: typeof _cc_.Prefab, SpriteFrame: typeof _cc_.SpriteFrame, Material: typeof _cc_.Material, _decorator: typeof _cc_._decorator, EventHandler: typeof _cc_.EventHandler, Quat: typeof _cc_.math.Quat, Mat4: typeof _cc_.math.Mat4, RenderTexture: typeof _cc_.RenderTexture, Tween: typeof _cc_.Tween, TweenSystem: typeof _cc_.TweenSystem, AudioClip: typeof _cc_.AudioClip, Layers: typeof _cc_.Layers, macro: _cc_.Macro, SubContextView: typeof _cc_.SubContextView, ParticleSystem2D: typeof _cc_.ParticleSystem2D;
}
/**常量定义 */
 namespace apeng {
    /**初始化框架传入的数据 */
    interface IInitData {
        /**游戏名，分享模块，隐私协议模块会用 */
        gameName: string;
        server: {
            /**服务器请求ip地址 */
            requestIp: string;
            /**游戏id */
            gameId: string;
        };
        /**测试模式 通过此变量判断 正式版应为false 避免其他未修改出现bug */
        isTest: boolean;
        /**开启日志 */
        isLog: boolean;
        /**等待场景加载完毕后 关闭loading */
        isWaitScene: boolean;
        /**适应老版本缓存 使用type区分module.storage*/
        useModuleStorageType: boolean;
        /**运行的平台 */
        platformType: keyof typeof EPlatformType;
        /**platformType=web时，打开模拟的ui弹窗 */
        openWebSimulationUI: boolean;
        /**强制使用web模拟弹窗 */
        useWebSimulationUI: boolean;
        /**默认进入游戏的语言 */
        getLanguageType: (_enum: any) => keyof typeof ELanguageType;
        /**进入游戏时显示隐私协议弹窗 */
        openPrivacy: boolean;
        /**loading显示文字信息 */
        showLoadingText: boolean;
        /**展示在主页的软著id */
        versionId: string;
        /**打开gm窗口 */
        openGm: boolean;
        /**loading加载完成后，全屏颜色消失动画 */
        loadingCompleteColorAnim: string;
        /**首次进入场景路径 */
        initSceneUrl: string;
        /**调起视频时，使用分享弹窗 */
        rewardVideoUseShare: boolean;
        /**配置表路径 */
        configUrl: string;
        /**平台id使用的名字key 默认 platform*/
        configPlatform: string;
        /**所有使用的ui路径 */
        uiUrl: {
            index: string;
            indexBg: string;
            prop: string;
            sidebar: string;
        };
        /**开始多长时间屏蔽广告 */
        startBlockAd: number;
        /**点击音频路径 */
        audioClickUrl: string;
        /**手指在屏幕滑动时 显示的特效 */
        touchMovePrefabUrl: string;
        /**手指在屏幕上点击时 显示的动画， */
        touchClickPrefabUrl: string;
        /**场景切换时 调起的加载界面 */
        sceneChangeWaitUrl: string;
        /**分享数据 */
        share: {
            /**模拟成功回调 持续时间 */
            callTime: number;
            /**分享文案 */
            list: (TShare.Param[]) | {
                title: string[];
                imgUrl: string[];
            };
            /**后台审核过的ID */
            templateId: string[];
        };
        /**新用户 直接进入游戏场景 */
        newUseEnterGame: boolean;
        /**loading界面最小持续时间(秒)，平台审核人员要看加载界面的信息 太快看不到 */
        loadingDuration: number;
        /**配置表常量定义 */
        configDefine: IConfigDefineBase;
        /**写入的语言配置 */
        languageDefine: Object;
    }
    /**初始化框架状态 */
    enum EInitCoreState {
        /**初始化 */
        init = 0,
        /**隐私协议打开 */
        private = 1,
        /**配置表解析 */
        config = 2,
        /**首页打开 */
        openIndex = 3,
        /**场景打开 */
        openScene = 4
    }
    interface IBaseModule {
    }
    type TModuleType = {
        [type: number]: new () => IBaseModule;
    };
    /**
     * 模块类型 不可中途插入
     * 方便使用类型 缓存
     */
    enum EModuleType {
        /**都可以写入的 */
        none = 2,
        platform = 3,
        language = 4,
        timer = 5,
        resouces = 6,
        ui = 7,
        audio = 8,
        scene = 9,
        login = 10,
        main = 11,
        privacy = 12,
        gm = 13,
        guide = 14,
        prop = 15,
        rank = 16
    }
    /**平台逻辑模块 */
    enum EPlatformLogicType {
        banner = 100,
        blockOnce = 101,
        interstitial = 102,
        nativeTemp = 103,
        record = 104,
        rewardedVideo = 105,
        share = 106,
        vibrate = 107
    }
    /**底层平台 */
    enum EPlatformType {
        web = 99,
        wx = 1,
        qq = 2,
        tt = 3,
        vivo = 4,
        oppo = 5,
        /**华为 */
        hbs = 7,
        xiaomi = 8,
        /**海外xgame */
        overseas_android_xgame = 10,
        a360 = 11,
        /**快手海外 */
        overseas_kwai = 12,
        /**微游h5 */
        overseas_weiyou = 13,
        /**国内快手 */
        ks = 14,
        ios = 15
    }
    enum ELanguageType {
        /**中文 */
        chinese = 0,
        /**繁体 */
        traditional = 1,
        /**英语 */
        english = 2,
        /**西班牙 */
        spanish = 3,
        /**越南 */
        vietnamese = 4,
        /**巴西葡萄牙 */
        portuguese = 5,
        /**印尼 */
        indonesia = 6
    }
    /**切换语言ui里面 显示的文本 */
    const CLanguageName: {
        0: string;
        1: string;
        2: string;
    };
}
 namespace apeng {
    class Maths {
        static readonly PI: number;
        static readonly PI2: number;
        static readonly _d2r: number;
        static readonly _r2d: number;
        /**
         *
         * @param num
         * @param fixed 小数后几位
         * @returns
         */
        static valueByString(num: number, fixed?: number): string;
        /**
         * 两个数是否在范围内
         * @param value1
         * @param value2
         * @param range
         */
        static isRange(value1: number, value2: number, range: number): boolean;
        /**
         * 判断一个数是否为偶数
         * @param {number} value
         * @returns {boolean}
         */
        static isEven(value: number): boolean;
        /**
         * 把角度换算成弧度
         * @param a
         */
        static toRadian(a: number): number;
        /**
         * 取value的小数部分
         * @param value
         */
        static decimal(value: number): number;
        /**
         * 把弧度换算成角度。
         * @param a
         */
        static toDegree(a: number, is_ormalize?: boolean): number;
        /**归一化弧度 转换为 0~2PI*/
        static normalizeRadian(angle: number): number;
        /**归一化角度 转换为 0~360*/
        static normalizeAngle(angle: number): number;
        /**
         * 两个数字之间的线性插值，比率设置其偏向每一端的程度
         * a + (b - a) * r
         * @method lerp
         * @param {Number} a number A
         * @param {Number} b number B
         * @param {Number} r ratio between 0 and 1
         * @param {Number} fuzzyEquals 校验ab范围 如达到了 返回null
         * @return {Number}
         * @example
         * var a = Maths.lerp(0, 1, .2); // .2
         * var b = Maths.lerp(1, 2, .5); // 1.5
         * var b = Maths.lerp(1, 2, .2); // 1.2
         */
        static lerp(a: number, b: number, r: number): number;
        /**
         * 限定浮点数的取值范围为 0 ~ 1 之间
         * @method clamp01
         * @param {Number} value
         * @return {Number}
         * @example
         * var v1 = Maths.clamp01(20);  // 1;
         * var v2 = Maths.clamp01(-1);  // 0;
         * var v3 = Maths.clamp01(0.5); // 0.5;
         */
        static clamp01(value: number): number;
        /**
         * 限定浮点数的最大最小值
         * 数值大于 max 则返回 max
         * 数值小于 min 则返回 min
         * 否则返回自身
         * @method clampf
         * @param {Number} value
         * @param {Number} min
         * @param {Number} max
         * @return {Number}
         * @example
         * var v1 = Maths.clampf(20, 0, 20); // 20;
         * var v2 = Maths.clampf(-1, 0, 20); //  0;
         * var v3 = Maths.clampf(10, 0, 20); // 10;
         */
        static clampf(value: number, min: number, max: number): number;
        /**
         * true  在范围内
         * @param value
         * @param min
         * @param max
         */
        static isClampf(value: number, min: number, max: number): boolean;
        /**
         * 随机值与`value`比较
         * 数值 0 ～ value 返回true
         * 数值 1 ～ value 返回false
         * @param {number} value
         * @returns {boolean}
         * @example
         * var a = Maths.isRandom(0.5);
         */
        static isRandom(value: number, random?: number): boolean;
        /**
         * @param min
         * @param max
         * @param is_int 默认转换为整型
         * @returns 返回 min - max 的值， 包括 min max
         */
        static minToMax(min: number, max: number, isInt?: boolean, random?: number): number;
        /**
         * 返回 0 到 max
         * @param max
         * @returns {0 ~ max} 不包括 max
         * @example
         * var a = Maths.zeroToMax(10); // 3
         * var b = Maths.zeroToMax(1); // 0
         */
        static zeroToMax(max: number, random?: number): number;
        static toFixed(value: number, count: number): number;
        static arrAdd(value: number[]): number;
        /**
         * 找到num在arr所在的区间
         * @param arr
         * @param num
         * @param num
         * @param isContainNum 是否=
         */
        static findNumSection(arr: number[], num: number, out?: {
            i: number;
            count: number;
        }, isContainNum?: boolean): {
            i: number;
            count: number;
        };
        /**
         * 权重随机
         * @param arr
         * @returns 数组索引
         */
        static widgetRandom(arr: number[]): number;
        static keep2Decimal(val: number): number;
    }
}
 namespace apeng {
    /**
     * 数组的二次封装
     * 内置去重处理
     * @export
     * @class Sets
     * @template T
     */
    class Sets<T> {
        static forEach<T>(arr: T[] | readonly T[], cb: (value: T, index: number) => (boolean | void), isLast?: boolean): void;
        /**
         * 更新个数
         * @param curCount
         * @param oldCount
         * @param itemCb
         */
        static updateItemCount(curCount: number, oldCount: number, itemCb: (add: boolean) => void): void;
        static pop<T>(arr: (T[]) | (readonly T[]), remove?: boolean): T;
        static delete<T>(arr: T[], value: T): boolean;
        /**
         * 冒泡排序
         * @param arr
         * @param cb
         */
        static bubblingSort<T>(arr: T[], cb: (a: T, b: T) => boolean): void;
        static reverse<T>(arr: T[]): T[];
        static map<U, T>(arr: T[], cb: (value: T, index: number, array: T[]) => U): U[];
        static has<T>(arr: T[] | undefined, value: T, stringCompare?: boolean): boolean;
        static add<T>(arr: T[], ...values: T[]): void;
        /**
         * 随机一个自身的值
         * @param value
         * @param exclude  ture 排除
         */
        static random<T>(value: T[], exclude?: (value: T, index: number) => boolean, random?: () => number): T;
        /**
     * 随机一个自身的值
     * @param value
     * @param exclude 排除
     */
        static randomOf<T>(value: T[], exclude?: (value: T, index: number) => boolean, random?: () => number): number;
        /**获取值如index超出个数 则取最后一个 */
        static getAt<T>(value: T[], index: number): T;
        /**
         * 筛选 cb => true 的值 如没有 返回 null!
         * @param {(value: T, index: number) => boolean} cb
         * @returns {T}
         * @memberof Sets
         */
        static filterValue<T>(values: T[], cb: (value: T, index: number) => boolean, isLast?: boolean): T;
        /**
         * 插入值
         * @param values
         * @param insertIndex
         * @param getIndex
         */
        static insert<T>(values: T[], value: T, index: number): T[];
        /**
         * 筛选 cb => true 的索引
         * @param {(value: T, index: number) => boolean} cb
         * @returns {number}
         * @memberof Sets
         */
        static filterOf<T>(arr: T[], cb: (value: T, index: number) => boolean, isLast?: boolean): number;
        static filter<T>(values: T[], cb: (value: T, index: number) => boolean, out?: T[]): T[];
        static push<T>(values: T[], push: (T[]) | T): T[];
        /**越大的越在前 */
        static sortMax<T>(values: T[], cb: (value: T) => number): T[];
        /**越小的越在前 */
        static sortMin<T>(values: T[], cb: (value: T) => number): T[];
        /**
         * 打乱数组, 默认改变
         * @param {boolean} [isChangeOriginal=true] 是否改变原数组
         * @returns {any[]}
         */
        static shuffle<T>(arr: T[], isChangeOriginal?: boolean, random?: () => number): T[];
        /**
         * 随机取count个数据
         * @param vlaues
         * @param count
         */
        static randomArray<T>(values: T[], count?: number): T[];
        values: T[];
        /**是否对数组进行去重处理 */
        private isRepeat;
        /**
         *
         * @param {boolean} [isRepeat=true] 去重
         * @param {...T[]} values
         * @memberof Sets
         */
        constructor(isRepeat?: boolean, ...values: T[]);
        get size(): number;
        indexOf(value: T): number;
        clear(): void;
        /**
         * 拿下标第一个的值 默认删除第一个
         * @param {boolean} [isOrign=true] 是否删除第一个
         * @returns {T}
         * @memberof Sets
         */
        shift(isOrign?: boolean): T;
        toString(): string;
        forEach(cb: (value: T, index: number) => (boolean | void), isLast?: boolean): Sets<T>;
        add(...values: T[]): Sets<T>;
        delete(value: T): boolean;
        has(value: T, stringCompare?: boolean): boolean;
        map<U>(cb: (value: T, index: number, array: T[]) => U): U[];
        filterOf(cb: (value: T, index: number) => boolean): number;
        filterValue(cb: (value: T, index: number) => boolean): T;
        filter(cb: (value: T, index: number) => boolean): T[];
    }
}
 namespace apeng {
    /**单个池子 */
    class PoolOnce<V> {
        maxCount: number;
        onObj: () => V;
        onClear: (data: V) => void;
        onDestroy?: (data: V) => void;
        private data;
        constructor(maxCount: number, onObj: () => V, onClear: (data: V) => void, onDestroy?: (data: V) => void);
        /**实例化个数 */
        instantiate(size: number): void;
        get<T extends V>(): T;
        put(data: V): void;
        clear(): void;
        size(): number;
    }
    /**多池子 */
    class Pool<K, V> {
        private maxCount;
        private onObj;
        private onClear;
        private onDestroy?;
        private datas;
        constructor(maxCount: number, onObj: (url: K) => V, onClear: (data: V, url: K) => void, onDestroy?: (data: V, url: K) => void);
        /**实例化个数 */
        instantiate(url: K, size: number): void;
        get<T extends V>(url: K): T;
        put<T extends V>(data: T): void;
        clear(): void;
        size(): number;
        pool(url: K): PoolOnce<V>;
    }
    /**池子数组 */
    class PoolArray<V> {
        private pool;
        data: V[];
        constructor(pool: PoolOnce<V>);
        clear(): void;
        add(): V;
        size(): number;
        get(index: number): V;
    }
    const CPoolArray: PoolOnce<any[]>;
}
 namespace apeng {
    /**异步计数 */
    class LoadDir {
        count: number;
        onFinish: () => void;
        onSub: (data: any) => void;
        logPrefix: string;
        constructor(count: number, onFinish: () => void, onSub?: (data: any) => void, logPrefix?: string);
        subCount(data?: any): () => void;
    }
}
 namespace apeng {
    class Queue {
        complete: () => void;
        interval: number;
        log: string | ((index: number) => string);
        static readonly pool: PoolOnce<Queue>;
        private loadDir;
        private values;
        private _values;
        isRun: boolean;
        constructor(complete?: () => void, interval?: number, log?: string | ((index: number) => string));
        add(cb: (complete: () => void) => void, run?: boolean): this;
        remove(index: number): void;
        remove2(cb: Function): void;
        has(index: number): boolean;
        runIndex(index: number, complete?: () => void): void;
        /**
         * 开始运行
         * @param count 并发个数
         * @returns
         */
        run(count?: number): void;
        clear(): void;
        dispose(): void;
    }
}
 namespace apeng {
    interface IEventDispatcherEmit {
        eventName: string;
        target: IEventDispatcher;
    }
    interface IEventDispatcher {
        on(eventName: string | number, callBack: Function, caller: any): void;
        once?(eventName: string | number, callBack: Function, caller: any): void;
        off(eventName: string | number, callBack: Function, caller: any): void;
        emit?(eventName: string | number, ...param: any[]): void;
    }
    const EventDispatcherEventType: {
        ON: string;
        OFF: string;
        CLEAR: string;
    };
    class EventDispatcher implements IEventDispatcher {
        private eventMap;
        /**
         * 注册事件
         * @param eventName
         * @param callBack 派发队列事件 则( 按照优先级一个一个派发  第一个参数回调 complete 完成了后进行下一个)
         * @param caller
         * @param priority 优先级 由小往大执行
         */
        on(eventName: string | number, callBack: Function, caller?: any, priority?: number): Function;
        /**
         * 如不返回 或返回为true则注销
         * @param eventName
         * @param callBack
         * @param caller
         * @returns
         */
        once(eventName: string | number, callBack: Function, caller?: any, priority?: number): () => void;
        off(eventName: string | number, callBack: Function, caller?: any): void;
        offAll(eventName: string | number): boolean;
        emit(eventName: string | number, ...param: any[]): any[];
        /**
         * 派发队列事件
         * @param eventName
         * @param complete
         * @param param
         * @returns
         */
        emitQueue(eventName: string | number, interval?: number, complete?: () => void, log?: string | ((index: number) => string), ...param: any[]): Queue;
        hasEvent(eventName: string | number, callBack: Function, caller: any): boolean;
        hasEventName(eventName: string | number): boolean;
        clearEvent(): void;
    }
}
 namespace apeng {
    /**
     * Object 二次封装
     * 优化增删改查操作
     *  key 只能是 number | string
     * @export
     * @class Maps
     * @template K
     * @template V
     */
    class Maps<K, V> {
        /**
         * 筛选 cb => true 的值 如没有 返回 null
         * @param {(value: T, index: number) => boolean} cb
         * @returns {T}
         * @memberof Sets
         */
        static filterValue<T>(values: {
            [key: string]: T;
        }, cb: (value: T, key: string) => boolean): T;
        /**
         * 对象的个数
         * @param value
         */
        static size(value: {}): number;
        /**
         * 筛选 cb => true 的索引
         * @param {(value: T, index: number) => boolean} cb
         * @param isLast 倒着循环
         * @returns {number}
         * @memberof Sets
         */
        static filterKey<T>(values: {
            [key: string]: T;
        }, cb: (value: T, key: string) => (boolean | void), isLast?: boolean): string;
        /**取第一个value */
        static shiftKey<V>(value: {
            [key: string]: V;
        }): string;
        /**取第一个value */
        static shiftValue<V>(value: {
            [key: string]: V;
        }): V;
        /**
         * 将对象value值转换为数组
         * @param value
         */
        static converValueArray<V>(value: {
            [key: string]: V;
        }): V[];
        /**
         *
         * @param value 数据
         * @param cb 每次循环回调 返回true终止循环
         * @param isDeleteChild 循环中删除了子节点也会进入循环
         */
        static forEach<V>(value: {
            [key: string]: V;
        } | Object, cb: (value: V, key: string, index: number) => (boolean | void), isDeleteChild?: boolean): void;
        /**随机取一个 V */
        static randomValue<T>(values: {
            [key: string]: T;
        }, exclude?: (value: T, key: string) => boolean): T;
        /**随机取一个 V */
        static randomKey<T>(values: {
            [key: string]: T;
        }, exclude?: (value: T, key: string) => boolean): string;
        static values<T>(values: {
            [key: string]: T;
        }, exclude?: (value: T, key: string) => boolean, out?: T[]): T[];
        static map<T, V>(values: {
            [key: string]: T;
        }, cb: (v: T, key: string) => V): {
            [key: string]: V;
        };
        static keys<T>(values: {
            [key: string]: T;
        }, exclude?: (value: T, key: string) => boolean, out?: string[]): string[];
        static valuesMap<T, R>(values: {
            [key: string]: T;
        }, cb: (key: string, value: T) => R): R[];
        _values: any;
        /**判断key是number类型 */
        isKeyNumber: boolean;
        private _onceValue;
        private _lastKey;
        private _curKey;
        keyArray: K[];
        setCount: number;
        get length(): number;
        /**
         *Creates an instance of Maps.
         * @param {Object} [obj] 将一个对象转换为 Maps结构
         * @memberof Maps
         */
        constructor(obj?: Object);
        set(key: K, value: V): Maps<K, V>;
        has(key: K): boolean;
        get<T extends V>(key: K): T;
        gets(keys: K[]): V[];
        /**通过value 获取添加时的索引 */
        getValueByIndex(value: V): number;
        delete(key: K): void;
        clear(): void;
        /**取第一个value */
        shiftValue<T extends V>(): T;
        /**取上一个value */
        lastValue(): V;
        /**取上当前value */
        curValue(): V;
        converKey(key: string): any;
        /**
         *
         * @param cb
         * @param isLast 从后往前便利
         */
        forEachArray<T extends V>(cb: (value: T, key: K, index: number) => (boolean | void), isLast?: boolean): void;
        get size(): number;
        filterValue<T extends V>(cb: (value: T, key: string) => boolean): T;
        filterKey<T extends V>(cb: (value: T, key: string) => boolean): K;
        randomValue(): V;
        values<T extends V>(exclude?: (value: T, key: string) => boolean, out?: T[]): T[];
        keys(): string[];
        valuesMap<R>(cb: (key: string, value: V) => R): R[];
        forEach<T extends V>(cb: (value: T, key: K) => (boolean | void), isDeleteChild?: boolean): Maps<K, V>;
    }
}
 namespace apeng {
    class JS {
        /**
         * 获取枚举 value为number的值
         * @param enums
         * @param cb
         * @returns
         */
        static getEnumValue(enums: any, cb?: (value: number) => void): number[];
        static getEnumByNums(enums: any): number[];
        static promiseDelay(delay: number): Promise<unknown>;
        /**深拷贝类 只拷贝一层 */
        static minxi<T>(value: T): T;
        static deep<T>(value: T): T;
        static parseArray<T>(str: string): T[];
        static _copyprop(name: string, source: any, target: any): void;
        static _getPropertyDescriptor(obj: any, name: any): PropertyDescriptor;
        /**
       * 判断是否为空对象
       * @param {Object} obj
       * @returns {boolean}
       * @memberof Maps
       */
        static isNullObj(obj: Object): boolean;
        static isValid(value: any): boolean;
        private static _mixin;
        /**
     * @param filename  文件名   a.txt
     * @param content 内容
     * @param contentType  头部
     */
        static download(filename: string, content: string, contentType?: string): void;
        static isPromise(obj: any): boolean;
        /**写入文本到粘贴板 */
        static copyContent(text: string): void;
    }
}
 namespace apeng {
    interface IStorage {
        clear(cb?: () => void): void;
        getItem(key: string): string | null;
        removeItem(key: string): void;
        setItem(key: string, value: string): void;
    }
    interface IInstanceStorage {
        set(key: string | number, value: any, isDelay?: boolean): void;
        get<T>(key: string | number, defaultValue: T): T;
        delete(key: string | number): void;
        getPrefixKeys: (str: string) => string[];
    }
    class BaseInstanceStorage implements IInstanceStorage {
        type: number;
        storage: BaseStorage<number>;
        constructor(type: number, storage: BaseStorage<number>);
        set(key: string | number, value: any, isDelay?: boolean): void;
        get<T>(key: string | number, defaultValue: T): T;
        delete(key: string | number): void;
        getPrefixKeys(str: string): string[];
    }
    class BaseStorage<Type extends number> {
        /**缓存接口 */
        private localStorage;
        /**延迟多长时间调用系统接口缓存(秒) */
        delayCache: number;
        getObjData: () => Object;
        static getKey(type: number, key: string | number): string;
        static parse(value: any): any;
        private cache;
        /**需要更新的缓存 */
        private updateCache;
        constructor(
        /**缓存接口 */
        localStorage: IStorage, 
        /**延迟多长时间调用系统接口缓存(秒) */
        delayCache: number, getObjData: () => Object);
        byteSize(type: number): string;
        getPrefixKeys(prefix: string): string[];
        private timeId;
        /**
         * 设置缓存
         * @param {string} key
         * @param {string} value 与 get时类型保持一致 不能为 null undefined "null"
         * @param {boolean} isDelay 延迟缓存
         * @param {boolean} toServer 推送到服务端
         */
        set(type: Type, key: string | number, value: any, isDelay?: boolean): void;
        /**
         * 拿缓存 如没 返回 null
         * @param {string} key
         * @param {T} defaultValue 返回当前值
         * @param {boolean} save 默认没有缓存时 写入本地
         */
        get<T>(type: Type, key: string | number, defaultValue: T): T;
        has(type: Type, key: string | number): boolean;
        /**
         * 删除缓存
         * @param {string} key
         */
        delete(type: Type, key: string | number): void;
        /**清除全部缓存 */
        clear(cb?: () => void): void;
        private checkCacheValue;
        private onSet;
    }
}
 namespace apeng {
    /**缓存接口 支持每帧调用*/
    const StorageMgr: BaseStorage<number>;
    const CStorageDefaultType = 1;
    /**不需要填写type字段的缓存接口 */
    const StorageOnceMgr: BaseInstanceStorage;
    const CDataStorage: {
        _data: {
            [key: string]: string;
        };
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
        clear(): void;
        getItem(key: string): string;
    };
    const DataStorageMgr: BaseStorage<number>;
    /**临时变量 不写入缓存 */
    const DataStorageOnceMgr: BaseInstanceStorage;
}
 namespace apeng {
    class BaseModule implements IBaseModule {
        /**模块缓存 */
        storage: BaseInstanceStorage;
        /**自身 new 时 */
        onBeforeInstance?(): void;
        /**自身 new 时 */
        onInstance?(): void;
        /**初始化自身模块数据 可以引用其他模块实例 但不能调用或使用 */
        onCreate?(): void;
        /**所有 onCreate 执行完后 可引用模块 跑逻辑 */
        onLogic?(): void;
        /**所有 onLogic 执行完后 */
        onComplete?(): void;
    }
    class BaseModuleEvent extends EventDispatcher implements IBaseModule {
        storage: BaseInstanceStorage;
        /**自身 new 时 */
        onBeforeInstance?(): void;
        /**自身 new 时 */
        onInstance?(): void;
        /**初始化自身模块数据 可以引用其他模块实例 但不能调用或使用 */
        onCreate?(): void;
        /**所有 onCreate 执行完后 可引用模块 跑逻辑 */
        onLogic?(): void;
        /**所有 onLogic 执行完后 */
        onComplete?(): void;
    }
}
 namespace apeng {
    /**数据管理 避免数据模块之间循环引用 */
    class ModuleMgr<TType> extends EventDispatcher {
        readonly EventType: {
            /**实例化完成 */
            INSTANCE: string;
            /**启动队列 */
            START_UP: string;
            /**run完成 */
            RUN_COMLETE: string;
        };
        private modules;
        modelTypeOrgin: any;
        _adds: TModuleType;
        add(type: TType): (target: new () => IBaseModule) => void;
        /**获取实例化后的模块 */
        get<T extends IBaseModule>(moduleType: number): T;
        instanceOnce(moduleType: number): BaseModule;
        /**实例化时 */
        instance(useCacheType: boolean, newComplete?: () => void): void;
        forEach(cb: (module: BaseModule) => void): void;
        run(complete: () => void, _enum?: any): void;
    }
}
 const startTime: number;
/**启动入口 主逻辑运行处*/
 namespace apeng {
    /**版本sdk号，可到框架源码处查看更新日志 */
    let versionCode: number;
    /**主 事件 全局处理 */
    let _main: MainModule;
    /**多语言管理 */
    let _language: LanguageModule;
    /**平台 */
    let _platform: PlatformModule;
    /**定时器 帧循环 */
    let _timer: TimerModule;
    /**资源 */
    let _resouces: ResoucesModule;
    /**ui管理 */
    let _ui: UIModule;
    /**音频 */
    let _audio: AudioModule;
    /**场景 */
    let _scene: SceneModule;
    /**隐私协议 */
    let _privacy: PrivacyModule;
    /**gm窗口 */
    let _gm: GmModule;
    /**引导 */
    let _guide: GuideModule;
    /**登录 */
    let _login: LoginModule;
    /**道具 */
    let _prop: PropModule;
    /**排行 */
    let _rank: RankModule;
    /**是编辑器环境 */
    const EDITOR: boolean;
    /**框架模块管理 */
    const moduleMgr: ModuleMgr<number>;
    /**平台实例 */
    const platformMgr: ModuleMgr<EPlatformType>;
    /**平台逻辑模块 */
    const platformLogicMgr: ModuleMgr<EPlatformLogicType>;
    /**传入的静态初始化数据 */
    let initData: IInitData;
    /**配置表数据 */
    let _config_: ConfigHelper<IConfigDefineBase>;
    /**
     * 初始化主框架
     * @param data 静态数据
     * @param dataConfig 配置表数据
     */
    function initCore(data: IInitData, complete?: (state: EInitCoreState) => void): void;
    /**屏幕尺寸 */
    function winSize(addW?: number, addH?: number): _cc_.Size;
    /**屏幕中心点 */
    function winCenterPostion(addX?: number, addY?: number): _cc_.math.Vec2;
}
 namespace apeng {
    /**
     * 基于位运算的分组控制
     */
    class ColliderGroup {
        groups: {
            [groupName: string]: number;
        };
        colliders: {
            [curCollider: string]: number[];
        };
        private _checkGroup;
        /**
         * 添加分组
         * @param groupName
         */
        add(groupName: number): void;
        /**
         * 设置可发生碰撞的分组
         * @param self 当前分组
         * @param collider 可发生碰撞的组
         */
        setCollider(self: number, collider: number): void;
        /**
         * 设置可发生碰撞的分组配对
         * @param self
         * @param other
         */
        setColliders(self: number, other: number[]): void;
        /**
         * 校验分组
         * @param self
         * @param other
         * @returns 能发生碰撞
         */
        has(self: number, other: number): boolean;
    }
}
 namespace apeng {
    export enum ECollider2DShapeType {
        None = 0,
        Circle = 1,
        Point = 2,
        Polygon = 3
    }
    type colliderCallBack = ((self: Collider2DShape, other: Collider2DShape) => void) | Function;
    export abstract class Collider2DShape {
        Collider2DRoot: Collider2DRoot;
        abstract type: ECollider2DShapeType;
        /**碰撞框倍率 */
        mul: number;
        owner: any;
        position: Vector2;
        /**当前分组 */
        group: number;
        /**开启碰撞 */
        _isCollider: boolean;
        set isCollider(value: boolean);
        get isCollider(): boolean;
        /**偏移 */
        offset: Vector2;
        /**弧度 */
        angle: number;
        onColliderEnter: colliderCallBack;
        onColliderExit: colliderCallBack;
        onColliderUpdate: colliderCallBack;
        onSetCollider: (isCollider: boolean) => void;
        onClear: () => void;
        id: number;
        /**进入的其他碰撞id */
        otherCollider: Collider2DShape[];
        /**被其他碰撞的引用 */
        selfCollider: Collider2DShape[];
        /**脏标记 防止同帧重复调用 */
        dataDirty: boolean;
        /**动态更新 return{boolean} 是否更新节点树 */
        updateShape: (value: Collider2DShape) => boolean;
        octree: Collider2DQuadtree[];
        root: Collider2DRoot;
        /**正在碰撞中 */
        isColliderEnter: boolean;
        /**清空所有引用 */
        clear(): void;
        hasExit(other: Collider2DShape): void;
        /**是否正在与其他物体产生碰撞 */
        hasColliderOther(): boolean;
        updatePosition(x: TVectorSet, y?: number): void;
        updateAngle(angle: number): void;
        setOffset(x: TVectorSet, y?: number): void;
        /**从树中删除当前数据 */
        removeFormOctreeItem(): void;
    }
    export {};
}
 namespace apeng {
    interface IVector2 {
        x: number;
        y: number;
    }
    type TVectorSet = number | number[] | IVector2;
    class Vector2 implements IVector2 {
        static readonly pool: PoolOnce<Vector2>;
        /**零向量,禁止修改*/
        static readonly ZERO: Vector2;
        /**一向量,禁止修改*/
        static readonly ONE: Vector2;
        /**一向量,禁止修改*/
        static readonly UP: Vector2;
        /**一向量,禁止修改*/
        static readonly RIGHT: Vector2;
        /**一向量,禁止修改*/
        static readonly LEFT: Vector2;
        /**一向量,禁止修改*/
        static readonly DOWN: Vector2;
        /**逐元素向量最小值 */
        static min(out: IVector2, a: IVector2, b: IVector2): IVector2;
        /**逐元素向量最大值 */
        static max(out: IVector2, a: IVector2, b: IVector2): IVector2;
        /**
         * 两个向量的夹角角度
         * @param a
         * @param b
         * @param orgin
         * @param dot 加上方向 顺时针为负
         * @returns
         */
        static twoAngle(a: IVector2, b: IVector2, orgin?: IVector2, dot?: boolean): number;
        static sort(points: IVector2[]): IVector2[];
        private static sortItem;
        static distance(value1: IVector2, value2: IVector2): number;
        /**
        * 两个三维向量距离。 不开方
        * @param	value1 向量1。
        * @param	value2 向量2。
        * @return	距离。
        */
        static distanceSqr(value1: IVector2, value2: IVector2): number;
        /**
       * 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
       * @method mulSelf
       * @param {number} num
       * @return {Vec2} returns this
       * @chainable
       * @example
       * v.mulSelf(5);// return Vec2 {x: 50, y: 50};
       */
        static mul(out: IVector2, value: IVector2, num: number | IVector2): IVector2;
        static equals(a: IVector2, b: IVector2, offset?: number): boolean;
        static equalsZero(a: IVector2, b: IVector2): boolean;
        static equals2f(value1: IVector2, x: number, y: number): boolean;
        /**
       * 以自身为原点 获取 另外点同自身的角度 0~360
       * @param other
       * @param rotate 0~360 默认 0度=>正右方； 逆时针旋转角度
       */
        static angle360(self: IVector2, other: IVector2, rotate?: number): number;
        static angle(value: IVector2, rotate?: number): number;
        /**
         * 缩放二维向量。
         * @param	a 源二维向量。
         * @param	b 缩放值。
         * @param	out 输出二维向量。
         */
        static scale(a: Vector2, b: number, out: Vector2): void;
        /**
        * 求两个二维向量的点积。
        * @param	a left向量。
        * @param	b right向量。
        * @return   点积。
        */
        static dot(a: IVector2, b: IVector2): number;
        /**
         * 归一化二维向量。
         * @param	s 源三维向量。
         * @param	out 输出三维向量。
         */
        static normalize(out: IVector2, value: IVector2): IVector2;
        /**
         * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
         * @param to 目标向量。
         * @param ratio 插值比率，范围为 [0,1]。
         */
        static lerp(out: IVector2, from: IVector2, to: IVector2, ratio: number): IVector2;
        /**
          * 转换为方便阅读的字符串。
          * @method toString
          * @return {string}
          */
        static toString(value: Vector2): string;
        /**
         * @zh 将当前向量的旋转
         * @param radians 旋转角度（弧度制）。
         */
        static rotate(out: IVector2, value: IVector2, radians: number): IVector2;
        /**
         * 向量减法，并返回新结果
         * @param vector
         * @param out
         */
        static sub<T extends IVector2>(out: T, a: IVector2, b: IVector2): T;
        /**
         * 求向量长度
         */
        static len(value: IVector2): number;
        /**
         * 求向量长度平方
         */
        static lengthSqr(value: IVector2): number;
        /**
         * 向量减法，并返回新结果
         * @param vector
         * @param out
         */
        static add(out: IVector2, a: IVector2, b: IVector2): IVector2;
        /**两个向量的中心点 */
        static center(out: IVector2, a: IVector2, b: IVector2): IVector2;
        static clampf(out: IVector2, value: IVector2, min: IVector2, max: IVector2): IVector2;
        static set<T extends IVector2>(self: T, x?: TVectorSet, y?: number): T;
        /**
         * 找到多边形的中心点
         * @param polygon
         */
        static polygonByCenterPoint(out: IVector2, polygon: IVector2[]): IVector2;
        /**
         * 近似判断两个点是否相等。<br/>
         * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
         * @method fuzzyEquals
         * @param {Vec2s} other
         * @param {Number} variance
         * @return {Boolean}
         */
        static fuzzyEquals(self: IVector2, other: IVector2, variance: number): boolean;
        /**X轴坐标*/
        x: number;
        /**Y轴坐标*/
        y: number;
        /**
         * 创建一个 <code>Vector2</code> 实例。
         * @param	x  X轴坐标。
         * @param	y  Y轴坐标。
         */
        constructor(x?: TVectorSet, y?: number);
        mul(out: IVector2, num: number | IVector2): IVector2;
        mulSelf(num: number | IVector2): Vector2;
        len(): number;
        lengthSqr(): number;
        equals(other: IVector2): boolean;
        equals2f(x: number, y: number): boolean;
        set(x?: TVectorSet, y?: number): Vector2;
        sub(out: IVector2, value: IVector2): IVector2;
        subSelf(value: IVector2): Vector2;
        rotate(out: IVector2, radians: number): IVector2;
        rotateSelf(radians: number): Vector2;
        normalize(out: IVector2): Vector2;
        normalizeSelf(): Vector2;
        add(out: IVector2, value: IVector2): IVector2;
        addSelf(value: IVector2): Vector2;
        toString(): string;
        clampf(out: IVector2, min: IVector2, max: IVector2): Vector2;
        clampfSelf(min: IVector2, max: IVector2): Vector2;
    }
}
 namespace apeng {
    class Collider2DPolygon extends Collider2DShape {
        /**
         * 使用 rectange 创建多边形碰撞盒
         * @param rectange
         */
        static createByRectange(rectange: Rectangle, group: number, out?: Collider2DPolygon): Collider2DPolygon;
        type: ECollider2DShapeType;
        /**存储方向与长度 方便计算放大缩小 */
        polygon: {
            dir: Vector2;
            offsetDir: Vector2;
            len: number;
            offsetLen: number;
        }[];
        private _polygon;
        constructor(position: IVector2, group: number, polygon: IVector2[]);
        updatePolygon(position: IVector2, polygon: IVector2[]): void;
        getPolygon(): Vector2[];
        /**更新未偏移的原点 */
        setOffset(x: TVectorSet, y?: number): void;
    }
}
 namespace apeng {
    class Collider2DBox extends Collider2DPolygon {
        constructor(position: IVector2, group: number, width: number, height: number);
    }
}
 namespace apeng {
    class Collider2DCircle extends Collider2DShape {
        type: ECollider2DShapeType;
        radius: number;
        private circle;
        constructor(position: IVector2, group: number, radius: number);
        getCircle(): Circle;
    }
}
 namespace apeng {
    /**
     * 引擎部分重写
     * 声明提示文件
     * 方便使用 vscode 导入
     */
    const ccclass: ((name?: string) => ClassDecorator) & ClassDecorator;
    const menu: (path: string) => ClassDecorator;
    function menuComponent(compName: string): ClassDecorator;
    function menuUI(compName: string): ClassDecorator;
    function menuAnim(compName: string): ClassDecorator;
    function menuList(compName: string): ClassDecorator;
    function menuBtn(compName: string): ClassDecorator;
    function menuScene(compName: string): ClassDecorator;
    function menuController(compName: string): ClassDecorator;
    function menuShape(compName: string): ClassDecorator;
    function menuEntity(compName: string): ClassDecorator;
    function menuP2(compName: string): ClassDecorator;
    const requireComponent: (requiredComponent: Function | Function[]) => ClassDecorator;
    const executeInEditMode: ClassDecorator & ((yes?: boolean) => ClassDecorator);
    const property: (options: _cc_.__private._cocos_core_data_decorators_property__IPropertyOptions) => _cc_.__private._cocos_core_data_decorators_utils__LegacyPropertyDecorator;
}
 namespace apeng {
    interface IAddEvent {
        type: string | number;
        callBack: Function;
        caller: any;
        registTarget: Object | (() => Object);
        fourByarg?: any;
        once: boolean;
        /**内置的事件不清理 */
        isSelf?: boolean;
    }
    export class BaseComponent extends _cc_.Component {
        /**关闭组件生命周期方法 */
        CLOSE_ON_CC: boolean;
        backupDescribe: string;
        set editorUpdateData(value: boolean);
        get editorUpdateData(): boolean;
        set editorClearData(value: boolean);
        get editorClearData(): boolean;
        /**update执行间隔时间 */
        onUpdateInterval: number;
        /**暂停update */
        isUpdate: boolean;
        protected _cacheComponents: Map<(new () => _cc_.Component), _cc_.Component>;
        _eventMap: IAddEvent[];
        private isEventOn;
        private _autoMember;
        private __isPreload;
        protected orginLabelColor: _cc_.Color;
        protected orginLabel2Color: _cc_.Color;
        private isEventSelf;
        private _isPersistRootNode;
        /**当前节点是否处于常驻节点 */
        get isPersistRootNode(): boolean;
        /**在场景显示 */
        get isVisible(): boolean;
        /**
         * @deprecated 已停用
         * 子类不可使用
        */
        __preload(): void;
        _onLoad?(): void;
        _onEnable?(): void;
        _onDisable?(): void;
        /**赋值成员属性跟事件 */
        autoMember(): void;
        onLoad(): void;
        start(): void;
        onEnable(): void;
        onDisable(): void;
        onDestroy(): void;
        clearCacheComponent(): void;
        /**
         * @deprecated 已停用
         * 请使用 onUpdte
         * 方便对update进行管理
         */
        update?(): void;
        private _update;
        /**设置点击 只有最新的一个生效 */
        setClick(callBack: Function, caller?: any): void;
        clearEventMap(): void;
        /**
         * 覆盖延迟定时器
         * 会覆盖上一次的执行
         * @param callBack 不能是箭头函数
         * @param delay 延迟时间
         */
        protected scheduleOnceCover(callBack: Function, delay?: number): void;
        /**
         * 添加一个事件
         * @param type
         * @param callBack
         * @param caller
         * @param registTarget
         * @param fourByarg
         * @returns
         */
        addEvent(
        /**事件类型 */
        type: string | number, 
        /**事件回调 */
        callBack: Function | any, 
        /**默认使用 this */
        caller: any, 
        /**注册到节点 反之注册到事件中心 */
        registTarget: Object | (() => Object), 
        /**注册接口的第四个参数 */
        fourByarg?: any, 
        /**执行一次销毁 */
        once?: boolean): Function;
        private _addEventRegist;
        setSize(width?: number | _cc_.Size, height?: number): void;
        getChildByCreate(nodeName: string, createCb: (node: _cc_.Node) => void, addChildIndex?: number, editorShow?: boolean): _cc_.Node;
        getNodeComponents<T extends _cc_.Component>(comps: {
            new (): T;
        }[]): T[];
        getParentByName(parentName: string): _cc_.Node;
        getParentByNameChild(parentName: string): _cc_.Node;
        walkAllChild(cb: (node: _cc_.Node) => (boolean | void), deep?: boolean): void;
        walkAllDeepChild(cb: (node: _cc_.Node) => (number | void)): void;
        followTarget(target: IVector3, speed: number | IVector3, rotate?: number, isWorld?: boolean, defaultRotate?: number): boolean;
        lerpScaleTarget(target: number | IVector3, ratio: number | IVector3, isWorld?: boolean): boolean;
        lerpTarget(target: IVector3, ratio: number | IVector3, rotate?: number, isWorld?: boolean, defaultRotate?: number): boolean;
        lookAt(target: IVector3, rotate?: number): void;
        getPosition(isWorld: boolean, offsetX?: number, offsetY?: number, offsetZ?: number): IVector3;
        getRotate(isWorld: boolean): _cc_.math.Quat;
        getRotateV3(isWorld: boolean): _cc_.math.Vec3;
        setRotate(value: IVector3, isWorld: boolean): void;
        setRotateX(x: number, isWorld: boolean): void;
        setRotateY(y: number, isWorld: boolean): void;
        setRotateZ(z: number, isWorld: boolean): void;
        rotateX(angle: number, isWorld: boolean): void;
        rotateY(angle: number, isWorld: boolean): void;
        rotateZ(angle: number, isWorld: boolean): void;
        setPosition(value: IVector3, isWorld: boolean, offsetX?: number, offsetY?: number, offsetZ?: number): void;
        setPositionXY(value: TVectorSet, isWorld: boolean): void;
        setPositionX(x: number, isWorld: boolean): void;
        setPositionY(y: number, isWorld: boolean): void;
        setPositionZ(z: number, isWorld: boolean): void;
        getScale(isWorld: boolean): IVector3;
        setScale(value: IVector2, isWorld: boolean): void;
        setScaleNum(num: number, isWorld: boolean): void;
        setScaleX(x: number, isWorld: boolean): void;
        setScaleY(y: number, isWorld: boolean): void;
        setScaleZ(z: number, isWorld: boolean): void;
        getYMin(isWorld: boolean): number;
        getYMax(isWorld: boolean): number;
        getXMax(isWorld: boolean): number;
        getXMin(isWorld: boolean): number;
        getChildrenByComponents<T extends _cc_.Component>(comp: {
            new (): T;
        } | string, cb?: (comp: T, index: number) => void, out?: T[]): T[];
        getChildrenByComponent<T extends _cc_.Component>(comp: {
            new (): T;
        } | string): T;
        getParentByComponent<T extends _cc_.Component>(comp: {
            new (): T;
        } | string): T;
        findChildrenByNameOnce(childrenName: string): _cc_.Node;
        findChildrenByNamePrefixs(prefixName: string, cb?: (value: _cc_.Node) => void): _cc_.Node[];
        findChildrenByPrefixNameOnce(prefixName: string): _cc_.Node;
        convertSelfToOtherNodeSpaceAR(out: _cc_.Vec3, other: _cc_.Node, point: _cc_.Vec3): IVector3;
        convertToNodeSpaceAR(out: _cc_.Vec3, point: IVector2): _cc_.math.Vec3;
        convertToWorldSpaceAR(out: _cc_.Vec3, point: _cc_.Vec3): _cc_.math.Vec3;
        distance(other: _cc_.Node, type?: "xyz" | "xy" | "x" | "y" | "z"): number;
        move(dir: IVector3, speed: number, isWorld: boolean): _cc_.math.Vec3;
        setOpacity(opacity: number): void;
        getOpacity(): number;
        isHit(point: IVector2): boolean;
        getRectangle(out: IRectangle, isWorld: boolean, ignoreSclae?: boolean): IRectangle;
        gray(isGray: boolean): void;
        zIndexSort(fn: (node: _cc_.Node, index: number) => number): void;
        private _coordinateTracker;
        coordinateTracker(uiParent: _cc_.Node, converNode: _cc_.Node, camera: _cc_.Camera, distance: number, useScale: boolean): {
            converPosition: _cc_.math.Vec3;
            scale: number;
        };
        /**
         * 获取当前节点或子节点第一个匹配的组件
         * 存入缓存中 方便高速取值
         * 如未找到 返回 null
         */
        getCacheComponent<T extends _cc_.Component>(comp: (new () => T) | string): T;
        /**当前节点或子节点挂载的第一个 动画组件 */
        get AnimtorCC(): AnimtorCC;
        get AutoTargetSizeCC(): AutoTargetSizeCC;
        get ButtonCC(): ButtonCC;
        get ControllerCC(): ControllerCC;
        get MoveCC(): MoveCC;
        get SwitchChildrenCC(): SwitchChildrenCC;
        get SwitchSpriteCC(): SwitchSpriteCC;
        get ListCC(): ListCC;
        get DragonBonesCC(): DragonBonesCC;
        get SpriteLoaderCC(): SpriteLoaderCC;
        get AnimtorByTweenCC(): AnimtorByTweenCC;
        get LayoutCC(): LayoutCC;
        get CreatePrefabToEditorCC(): CreatePrefabToEditorCC;
        get CreatePrefabToEditorOnceCC(): CreatePrefabToEditorOnceCC;
        get RenderOpacityAnimCC(): RenderOpacityAnimCC;
        get SpineCC(): SpineCC;
        get ListRollCC(): ListRollCC;
        get FontCC(): FontCC;
        get ClickChangeViewCC(): ClickChangeViewCC;
        get SubContextViewCC(): SubContextViewCC;
        get LevelRollCC(): LevelRollCC;
        get LayoutCircleCC(): LayoutCircleCC;
        get DragViewCC(): DragViewCC;
        get CameraOrbitControlCC(): CameraOrbitControlCC;
        get JoystickCC(): JoystickCC;
        get SpriteFrameAnimCC(): SpriteFrameAnimCC;
        get P2ConstraintEditorCC(): P2ConstraintEditorCC;
        get P2ShapeEditorCC(): P2ShapeEditorCC;
        get ProgressCC(): ProgressCC;
        get CameraTouchMoveCC(): CameraTouchMoveCC;
        get LabelNumRollCC(): LabelNumRollCC;
        get ParticleSystem2DCC(): ParticleSystem2DCC;
        get Collider2DEditorCC(): Collider2DEditorCC;
        get Label(): _cc_.Label;
        get Sprite(): _cc_.Sprite;
        get MotionStreak(): _cc_.MotionStreak;
        get Collider2D(): _cc_.Collider2D;
        get Layout(): _cc_.Layout;
        get Widget(): _cc_.Widget;
        get RigidBody2D(): _cc_.RigidBody2D;
        get ScrollView(): _cc_.ScrollView;
        get ScrollBar(): _cc_.ScrollBar;
        get Mask(): _cc_.Mask;
        get PageView(): _cc_.PageView;
        get UITransform(): _cc_.UITransform;
        get UIOpacity(): _cc_.UIOpacity;
        get Camera(): _cc_.Camera;
        get MeshRenderer(): _cc_.MeshRenderer;
        get Graphics(): _cc_.Graphics;
        get UIRenderer(): _cc_.UIRenderer;
        get spSkeleton(): _cc_.sp.Skeleton;
        get BlockInputEvents(): _cc_.BlockInputEvents;
        get DragonBonesArmatureDisplay(): _cc_.dragonBones.ArmatureDisplay;
        get EditBox(): _cc_.EditBox;
        get Animation(): _cc_.Animation;
        get ParticleSystem2D(): _cc_.ParticleSystem2D;
        /**onLoad之前调用 */
        protected onPreLoad?(): void;
        /**每帧执行 */
        protected onUpdate?(): void;
        /**第二个update */
        protected _onUpdate?(): void;
        /**点击节点时 捕获阶段触发 */
        protected onClickCatch?(e: _cc_.EventTouch): void;
        /**点击节点时 */
        protected onClick?(e: _cc_.EventTouch): void;
        /**鼠标在节点内按下时 */
        protected onTouchStart?(e: _cc_.EventTouch): void;
        /**鼠标在节点内移动时 */
        protected onTouchMove?(e: _cc_.EventTouch): void;
        /**鼠标在节点内抬起时 */
        protected onTouchEnd?(e: _cc_.EventTouch): void;
        /**鼠标在节点外抬起时 */
        protected onTouchCancel?(e: _cc_.EventTouch): void;
        /**节点尺寸改变时 */
        protected onSizeChange?(): void;
        /**节点锚点改变时 */
        protected onAnchorChange?(): void;
        /**编辑器更新属性 */
        protected onEditorUpdateData?(): void;
        /**编辑器清除属性 */
        protected onEditorClearData?(): void;
        /**键盘按下时 */
        protected onKeyDown?(e: _cc_.EventKeyboard): void;
        /**键盘抬起时 */
        protected onKeyUp?(e: _cc_.EventKeyboard): void;
        /**点击场景时 */
        protected onStageClick?(e: _cc_.EventTouch): void;
        /**鼠标在场景内按下时 */
        protected onStageTouchStart?(e: _cc_.EventTouch): void;
        /**鼠标在场景内移动时 */
        protected onStageTouchMove?(e: _cc_.EventTouch): void;
        /**鼠标在场景内抬起时 */
        protected onStageTouchEnd?(e: _cc_.EventTouch): void;
        /**节点局部位置改变时 */
        protected onPositionChange?(): void;
        /**节点局部缩放改变时 */
        protected onScaleChange?(): void;
        /**节点局部旋转改变时 */
        protected onRotationChange?(): void;
        /**鼠标滑轮滚动时 */
        protected onMouseWheel?(e: _cc_.EventMouse): void;
    }
    export {};
}
 namespace apeng {
    enum ECollider2DShapeTypeCC {
        None = 0,
        Circle = 1,
        Point = 2,
        Polygon = 3,
        Box = 4
    }
    /**
     * 形状编辑器基类
     * 提供基础数据接口
     * 如有复杂功能 多个碰撞管理 可使用此组件
     *
     * 支持节点缩放 节点z轴旋转
     * 偏移加旋转
     */
    export class Collider2DEditorCC extends BaseComponent {
        /**开启碰撞框调试 */
        static debug: boolean;
        backupDescribe: string;
        editorColor: _cc_.math.Color;
        editorLineWidth: number;
        runEditorShow: boolean;
        tag: string;
        set shapeType(value: ECollider2DShapeTypeCC);
        get shapeType(): ECollider2DShapeTypeCC;
        set circleRadius(value: number);
        get circleRadius(): number;
        set boxSize(value: _cc_.math.Size);
        get boxSize(): _cc_.math.Size;
        set poygonPoints(value: _cc_.math.Vec2[]);
        get poygonPoints(): _cc_.math.Vec2[];
        set shapeOffset(value: _cc_.math.Vec2);
        get shapeOffset(): _cc_.math.Vec2;
        private _shapeType;
        private _circleRadius;
        private _boxSize;
        private _shapeOffset;
        private _poygonPoints;
        protected onEditorUpdateData: () => void;
        shape: Collider2DShape;
        onLoad(): void;
        onFocusInEditor(): void;
        onLostFocusInEditor(): void;
        updateCCGraphics(): void;
        private getGraphics;
        /**
         * 创建形状数据
         * @param group
         * @param owner
         * @returns
         */
        getShape<T extends Collider2DShape>(group: number, point?: IVector2): T;
        _getShape(group: number, point: IVector2): Collider2DShape;
        updateNodeByShape(): void;
    }
    export {};
}
 namespace apeng {
    class Collider2DPoint extends Collider2DShape {
        type: ECollider2DShapeType;
        point: Vector2;
        constructor(position: IVector2, group: number);
        getPoint(): Vector2;
    }
}
 namespace apeng {
    /**
    * 四叉树叶节点
    */
    class Collider2DQuadtree {
        root: Collider2DRoot;
        parent: Collider2DQuadtree;
        /**当前空间的范围 */
        rect: Rectangle;
        /**子包围盒 */
        child: Collider2DQuadtree[];
        /**当前层级 */
        curLevel: number;
        /**分到当前块的数据 */
        colliders: Collider2DShape[];
        /**可碰撞的碰撞体数据  减少碰撞基数 */
        colliderByGroup: {
            [group: string]: Collider2DShape[];
        };
        /**手动更新个数 减少 array.length 消耗 */
        colliderSize: number;
        /**添加数据 */
        addShape(shpae: Collider2DShape): void;
        /**
         * 从树中删除一块数据
         * @param shpae
         */
        remove(shpae: Collider2DShape): void;
        /**清除当前树 */
        clear(): void;
        /**
         * 添加一个数据
         * 会自动判断进入分块中
         * @param _item
         */
        add(item: Collider2DShape): void;
        /**
         * 获取当前的深度层
         * @returns
         */
        getLevel(): number;
        hasRect(rect: Rectangle, shpae: Collider2DShape): boolean;
    }
}
 namespace apeng {
    /**
    * 碰撞管理
    * 分组
    * 多边形，点， 圆，矩形
    * 旋转(偏移旋转)
    * 四叉树(将所有碰撞块放入最后一层子节点中)
    */
    class Collider2DRoot extends Collider2DQuadtree {
        static has(self: Collider2DShape, other: Collider2DShape): boolean;
        /**间隔多少帧执行一次循环 值越小 性能越高 */
        set frame(value: number);
        get frame(): number;
        private _frame;
        private _frameInterval;
        /**激活四叉树 */
        set enableQuadTree(value: boolean);
        get enableQuadTree(): boolean;
        private _enableQuadTree;
        /**分组控制 */
        group: ColliderGroup;
        /**最大层级深度 */
        maxLevel: number;
        ids: number;
        /**动态更新位置的集合 */
        updateShapes: Collider2DShape[];
        /**逻辑帧的执行次数 */
        cycleCount: number;
        private _updateAABB;
        private curFrameDelta;
        /**更新前调用 */
        preOnUpdate: () => void;
        constructor();
        /**
         * 初始化八叉树
         * 如不初始化 则使用 双层for循环
         * @param maxAABB 根包围盒，应当包含所有子块
         * @param maxLevel 子节点分层
         */
        initQuadtree(x: number, y: number, width: number, height: number, maxLevel?: number): void;
        /**添加数据 */
        add(item: Collider2DShape): void;
        addShape(shpae: Collider2DShape): void;
        /**
         * 移除数据
         * @param shpae
         */
        remove(shpae: Collider2DShape): void;
        /**帧循环 */
        onUpdate(dt: number): void;
        /**
         * 更新需要动态更新aabb
         */
        updateShape(): void;
        /**更新形状到树中 */
        updateShapeByQuadtree(shape: Collider2DShape): void;
        /**双层for循环碰撞 */
        defaultCollider(): void;
        /**分组碰撞 */
        groupByCollider(shapes: {
            [group: string]: Collider2DShape[];
        }): void;
        /**四叉树碰撞 */
        quadtreeCollider(childs: Collider2DQuadtree[]): void;
        /**
         * 清空数据
         */
        clear(): void;
        /**
           * 相交碰撞检测
           * 以性能最高方式编写 使用临时变量 栈高速存取
           * 减少函数调用
           * 减少array.length
           * @param items
           * @param length
           * @returns
           */
        colliderOther(selfs: Collider2DShape[], others: Collider2DShape[]): void;
        /**获取添加到所有块的个数 */
        getItemAllCount(): number;
    }
}
 namespace apeng {
    enum ETweenType {
        None = 0,
        Breathe = 1,
        BreatheLinear = 2,
        /**自上到中的动画 */
        UIshow = 3,
        TipShow = 4,
        Rotate = 5,
        /**从0放大到1.5 */
        ScaleZeroToMax = 6,
        /**当前放大到1.2倍在缩回来 */
        ScaleTo = 7,
        MoveLeftRight = 8,
        /**轻微放大缩小 */
        ScaleTo2 = 9,
        BreatheLinear2 = 10,
        /**摇晃 */
        Shake = 11,
        /**ui打开时 缩放 */
        UISHowScale = 12,
        /**从上到中在回去 */
        TipShowTop = 13,
        /**上下循环移动动画 */
        MoveTopDown = 14
    }
    class TweenHelper {
        static UISHowScaleDuration: number;
        private static _defaultData;
        static setDefaultData(type: ETweenType, data: any): void;
        static stop(value: any, type?: string | number): typeof TweenHelper;
        static default<T extends _cc_.Node>(node: _cc_.Node, type: ETweenType, cb?: (data?: any) => void): _cc_.Tween<T>;
        static getTween<T>(obj: T, type: string | number, create?: (_tween: _cc_.Tween<T>) => _cc_.__private._cocos_tween_tween__ConstructorType<T>): _cc_.Tween<T>;
        /**获取tween的持续时间 */
        static duration(_tween: _cc_.Tween<any>): number;
        /**
         * 改变tween里第 index的tween的持续时间
         * @param _tween
         * @param index
         * @param duration
         */
        static setDuration(_tween: _cc_.Tween<any>, index: number, duration: number): typeof TweenHelper;
        static pause(obj: any): typeof TweenHelper;
        static resume(obj: any): typeof TweenHelper;
        static hasPause(obj: any): any;
        static hasRun(obj: any): boolean;
    }
}
 namespace apeng {
    /**
     * 动画曲线函数
     */
    enum EEaseType {
        /**(无效)不使用 */
        none = 0,
        /**常数 */
        constant = 1,
        /**线性 */
        linear = 2,
        /**平方曲线缓入函数。运动由慢到快 */
        quadIn = 3,
        /**平方曲线缓出函数。运动由快到慢 */
        quadOut = 4,
        /**平方曲线缓入缓出函数。运动由慢到快再到慢 */
        quadInOut = 5,
        /**立方曲线缓入函数。运动由慢到快 */
        cubicIn = 6,
        /**立方曲线缓出函数。运动由快到慢 */
        cubicOut = 7,
        /**立方曲线缓入缓出函数。运动由慢到快再到慢 */
        cubicInOut = 8,
        /**四次方曲线缓入函数。运动由慢到快 */
        quartIn = 9,
        /**四次方曲线缓出函数。运动由快到慢 */
        quartOut = 10,
        /**四次方曲线缓入缓出函数。运动由慢到快再到慢 */
        quartInOut = 11,
        /**五次方曲线缓入函数。运动由慢到快 */
        quintIn = 12,
        /**五次方曲线缓出函数。运动由快到慢 */
        quintOut = 13,
        /**五次方曲线缓入缓出函数。运动由慢到快再到慢 */
        quintInOut = 14,
        /**正弦曲线缓入函数。运动由慢到快 */
        sineIn = 15,
        /**正弦曲线缓出函数。运动由快到慢 */
        sineOut = 16,
        /**正弦曲线缓入缓出函数。运动由慢到快再到慢 */
        sineInOut = 17,
        /**指数曲线缓入函数。运动由慢到快 */
        expoIn = 18,
        /**指数曲线缓出函数。运动由快到慢 */
        expoOut = 19,
        /**指数曲线缓入和缓出函数。运动由慢到很快再到慢 */
        expoInOut = 20,
        /**循环公式缓入函数。运动由慢到快 */
        circIn = 21,
        /** 循环公式缓出函数。运动由快到慢 */
        circOut = 22,
        /**指数曲线缓入缓出函数。运动由慢到很快再到慢 */
        circInOut = 23,
        /**弹簧回震效果的缓入函数 */
        elasticIn = 24,
        /**弹簧回震效果的缓出函数 */
        elasticOut = 25,
        /**弹簧回震效果的缓入缓出函数 */
        elasticInOut = 26,
        /**回退效果的缓入函数。 */
        backIn = 27,
        /**回退效果的缓出函数。 */
        backOut = 28,
        /**回退效果的缓入缓出函数。 */
        backInOut = 29,
        /**弹跳效果的缓入函数。 */
        bounceIn = 30,
        /**弹跳效果的缓出函数。 */
        bounceOut = 31,
        /**弹跳效果的缓入缓出函数。 */
        bounceInOut = 32,
        /**平滑效果函数。 */
        smooth = 33,
        /**渐褪效果函数。 */
        fade = 34,
        quadOutIn = 35,
        cubicOutIn = 36,
        quartOutIn = 37,
        quintOutIn = 38,
        sineOutIn = 39,
        expoOutIn = 40,
        circOutIn = 41,
        backOutIn = 42,
        bounceOutIn = 43
    }
    function easing(type: EEaseType, ratio: number): number;
}
 namespace apeng {
    class AnimtorByTweenCC extends BaseComponent {
        backupDescribe: string;
        private type;
        private isEnablePlay;
        private delayPlay;
        private delayPlayByOpacityZeor;
        onEnable(): void;
        onDisable(): void;
        stop(): void;
        play(cb?: () => void): void;
        getDuration(): number;
    }
}
 namespace apeng {
    export interface IRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    type TRectangleSet = IRectangle | number;
    export class Rectangle implements IRectangle {
        static TEMP: Rectangle;
        static set(self: IRectangle, x?: TRectangleSet, y?: number, width?: number, height?: number): IRectangle;
        /**由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形 */
        static fromMinMax(out: IRectangle, min: IVector2, max: IVector2): IRectangle;
        /**xy是否在近似值内 */
        static equalsXY(self: IRectangle, other: IRectangle, range: number): boolean;
        /**计算当前矩形与指定矩形重叠部分的矩形，将其赋值给出口矩形 */
        static intersection(out: IRectangle, self: IRectangle, other: IRectangle): IRectangle;
        /**创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给出口矩形 */
        static union<T extends IRectangle>(out: T, self: IRectangle, other: IRectangle): T;
        /**判断当前矩形是否包含指定矩形 */
        static containsRect(self: IRectangle, other: IRectangle): boolean;
        /**判断当前矩形是否包含指定的点 */
        static contains(self: Rectangle, point: IVector2): boolean;
        /**判断当前矩形是否与指定矩形相交 */
        static intersects(self: IRectangle, other: IRectangle): boolean;
        /**判断当前矩形是否与指定矩形相等 */
        static equals(self: IRectangle, other: IRectangle): boolean;
        /**绕中心旋转矩形 */
        static angleCenter(out: Vector2[], value: Rectangle, angle: number): Vector2[];
        /**根据指定的插值比率，从当前矩形到目标矩形之间做插值 */
        static lerp(out: IRectangle, self: IRectangle, to: IRectangle, ratio: number): IRectangle;
        /**距中心点 缩放矩形 */
        static mul(out: Rectangle, value: Rectangle, mul: TVectorSet): Rectangle;
        /**从中心点 增加范围 */
        static add(out: Rectangle, value: Rectangle, addWidth: number, addHeight: number): Rectangle;
        /**
         * 等分矩形到位置
         * @param x
         * @param y
         * @param center 排除边框点 全部居中排列
         */
        static layout(out: IVector2[][], rectange: IRectangle, xCount: number, yCount: number, center: boolean): IVector2[][];
        /**
         * 将 self里的一个坐标
         * 转换到 other里的坐标
         * @param out
         * @param self
         * @param other
         */
        static converPointToOther(out: IVector2, point: IVector2, self: Rectangle, other: Rectangle): IVector2;
        static layoutPoint(out: IVector2, rectange: IRectangle, i: number, j: number, xCount: number, yCount: number, center: boolean): IVector2;
        static _layoutPointByIndex: {
            i: number;
            j: number;
        };
        static layoutPointByIndex(rectange: Rectangle, point: IVector2, xCount: number, yCount: number, center: boolean): {
            i: number;
            j: number;
        };
        static create(x?: number, y?: number, width?: number, height?: number): Rectangle;
        static clone(rectange: Rectangle): Rectangle;
        static polygon(out: Vector2[], value: Rectangle): Vector2[];
        /**将当前包围盒分成4等分的矩形 */
        static quadtree(out: Rectangle[], value: Rectangle): Rectangle[];
        x: number;
        y: number;
        width: number;
        height: number;
        angle: number;
        /**获取或设置矩形的 x 和 y 坐标 */
        private _origin;
        get origin(): IVector2;
        set origin(value: IVector2);
        /**获取或设置矩形中心点的坐标 */
        private _center;
        get center(): IVector2;
        set center(value: IVector2);
        /**中心点相对于左边的距离 */
        get centerDisLeft(): number;
        get centerDisRight(): number;
        get centerDisTop(): number;
        get centerDisDown(): number;
        get yMax(): number;
        set yMax(value: number);
        get yMin(): number;
        set yMin(value: number);
        get xMax(): number;
        set xMax(value: number);
        get xMin(): number;
        set xMin(value: number);
        /**获取或设置矩形的尺寸 */
        get size(): {
            width: number;
            height: number;
        };
        set size(value: {
            width: number;
            height: number;
        });
        private _v2s;
        get v2s(): Vector2[];
        constructor(x?: number, y?: number, width?: number, height?: number);
        private _layoutOut;
        _layoutXCount: number;
        _layoutYCount: number;
        _layoutCenter: boolean;
        layoutSelf(xCount: number, yCount: number, center: boolean): IVector2[][];
        layoutPoint(out: IVector2, i: number, j: number): IVector2;
        layoutPointByIndex(point: IVector2): {
            i: number;
            j: number;
        };
        polygon(): Vector2[];
        set(x?: TRectangleSet, y?: number, width?: number, height?: number): Rectangle;
        lerp(out: IRectangle, to: IRectangle, ratio: number): IRectangle;
        lerpSelf(to: IRectangle, ratio: number): Rectangle;
        equals(other: IRectangle): boolean;
        intersects(other: IRectangle): boolean;
        contains(point: IVector2): boolean;
        containsRect(other: IRectangle): boolean;
        union(out: IRectangle, other: IRectangle): IRectangle;
        unionSelf(other: IRectangle): this;
        intersection(out: IRectangle, other: IRectangle): IRectangle;
        intersectionSelf(other: IRectangle): IRectangle;
        equalsXY(other: IRectangle, range: number): boolean;
        mul(out: Rectangle, mul: TVectorSet): Rectangle;
        mulSelf(mul: TVectorSet): Rectangle;
        add(out: Rectangle, addWidth: number, addHeight: number): Rectangle;
        addSelf(addWidth: number, addHeight: number): Rectangle;
        layout(out: IVector2[][], xCount: number, yCount: number, center: boolean): IVector2[][];
        converPointToOther(out: IVector2, point: IVector2, other: Rectangle): IVector2;
        fromMinMax(min: IVector2, max: IVector2): IRectangle;
        clone(): Rectangle;
        angleCenter(addAngle?: number): Vector2[];
        private _quadtree;
        quadtree(): Rectangle[];
    }
    export {};
}
 namespace apeng {
    class CreatePrefabToEditorCC extends BaseComponent {
        /**item 上  itemAnimIgnore为true 不播放动画*/
        static itemAnimIgnore(item: _cc_.Node, value: boolean): void;
        backupDescribe: string;
        Pool: PoolOnce<_cc_.Node>;
        set prefabItem(value: _cc_.Prefab);
        get prefabItem(): _cc_.Prefab;
        set isPreloadPrefab(value: boolean);
        get isPreloadPrefab(): boolean;
        prefabItemByUuid: string;
        private prefabItemDeep;
        set numItems(value: number);
        get numItems(): number;
        set runClearItem(value: boolean);
        get runClearItem(): boolean;
        isPool: boolean;
        isPlayAnim: boolean;
        set itemScale(value: number);
        get itemScale(): number;
        private _isPreloadPrefab;
        _numItems: number;
        _itemScale: number;
        _runClearItem: boolean;
        private _prefabItem;
        isLoadPrefab: boolean;
        loadPrefabUrl: string;
        get itemOrginScale(): number;
        get itemOrginUITransform(): _cc_.UITransform;
        _renderData: {
            datas: any[] | number;
            comp: {
                new (): any;
            } | string;
            render: (comp: any, data: any, index: number, sortIndex: number) => (boolean | void);
            sort?: (data: any) => number;
            sortChangDatas: boolean;
        };
        /**render 接口不阻断*/
        isRenderItems: boolean;
        /**容器 */
        protected get content(): _cc_.Node;
        get contentUITransform(): _cc_.UITransform;
        get items(): readonly _cc_.Node[];
        protected onEditorUpdateData(): void;
        protected onEditorClearData(): void;
        onPreLoad(): void;
        onEnable(): void;
        onDisable(): void;
        onDestroy(): void;
        private clearAnim;
        forEach<T extends _cc_.Component>(comp: {
            new (): T;
        } | string, cb: (comp: T, index: number) => void): void;
        private createNode;
        private updatePreloadPrefab;
        preloadPrefab(url?: string, updateItem?: boolean, complete?: (isVisible: boolean) => void): void;
        getPrefabUuidByUrl(): string;
        updateItem(): void;
        /**
         * 初始化子节点并循环
         * @param datas
         * @param comp 当前或子节点第一个匹配的组件
         * @param render
         * @param sort 数据排序 返回值越大在越前面
         * @param sortChangDatas 改变原数组数据
         */
        render<T extends _cc_.Component, D>(datas: D[] | number, comp: {
            new (): T;
        } | string, render: (comp: T, data: D, index: number, sortIndex: number) => (boolean | void), sort?: (data: D) => number, sortChangDatas?: boolean): void;
        addItem(item?: _cc_.Node): _cc_.Node;
        removeItem(item?: _cc_.Node, destroy?: boolean): any;
        playItemAnim(): void;
        private hasPlayScaleAnim;
        /**创建item 添加到节点前时 */
        protected onAddItem(item: _cc_.Node): void;
        /**刷新时 */
        protected onUpdateItem?(): void;
        /**调用render之前 */
        protected onRenderBefore?(): void;
        /**调用render完成时 */
        protected onRenderComplete?(): void;
        /**item数量改变时 */
        protected onItemCountChange?(): void;
    }
}
 namespace apeng {
    class Draw {
        key: string;
        nodes: _cc_.Node[];
        localOpacitys: number[];
        childrens: _cc_.Node[][];
        next: Draw;
        prev: Draw;
        constructor(key: string);
    }
    export class ListCCByRenderQueue {
        items: {
            [key: string]: Draw;
        };
        head: Draw;
        set(prev: Draw, data: Draw): void;
        clear(): void;
    }
    class _ListCCByRender {
        enable: boolean;
        lists: ListCC[];
        queues: ListCCByRenderQueue[];
        init(): void;
        lateUpdate(list: ListCC): void;
        private render;
        start(list: ListCC, queue: ListCCByRenderQueue): void;
        end(list: ListCC, queue: ListCCByRenderQueue): void;
    }
    export const ListCCByRender: _ListCCByRender;
    class _ListCCByRender2 {
        enable: boolean;
        parents: _cc_.Node[];
        queues: ListCCByRenderQueue[];
        init(): void;
        lateUpdate(parent: _cc_.Node, queue: ListCCByRenderQueue): void;
        private render;
        start(parent: _cc_.Node, queue: ListCCByRenderQueue): void;
        end(parent: _cc_.Node, queue: ListCCByRenderQueue): void;
    }
    export const ListCCByRender2: _ListCCByRender2;
    export {};
}
 namespace apeng {
    class ListCC extends CreatePrefabToEditorCC {
        /**item在显示当中 */
        itemShow(item: _cc_.Node): any;
        readonly EventType: {
            ADD_ITEM: string;
            RENDER_DELAY: string;
        };
        backupDescribe: string;
        set intervalAddTime(value: number);
        get intervalAddTime(): number;
        set intervalAddCount(value: number);
        get intervalAddCount(): number;
        removeRender: boolean;
        removeRenderByResetSort: boolean;
        uiAnimCheck: boolean;
        isClickMove: boolean;
        btnMoveTop: _cc_.Node;
        btnMoveBottom: _cc_.Node;
        btnMoveLeft: _cc_.Node;
        btnMoveRight: _cc_.Node;
        borderHideBtn: boolean;
        private maxCountEnableDrag;
        private renderBoxScale;
        private resoucesDelay;
        private _intervalAddCount;
        private _intervalAddTime;
        private rectangle;
        _delayItems: _cc_.Node[];
        _items: _cc_.Node[];
        private contentOrginPosition;
        private _onRenderComplete;
        orginChilds: _cc_.Node[];
        renderQueue: ListCCByRenderQueue;
        private loadQueueResouces;
        private isLoadQueueResouces;
        /**渲染过后 拖拽过 */
        isDragScrolling: boolean;
        dragScrollContentY: number;
        /**容器 */
        get content(): _cc_.Node;
        get items(): _cc_.Node[];
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        lateUpdate(dt: number): void;
        updateRect(): void;
        /**其他组件播放动画 延迟更新list */
        otherAnimComplete(start: boolean, data?: any): void;
        private updateScrollBar;
        private clearAll;
        protected onPositionChange: () => void;
        protected onSizeChange: () => void;
        protected onUpdateItem(): void;
        protected onAddItem(item: _cc_.Node): void;
        private _delayAddItem;
        addItemToScene(item: _cc_.Node): void;
        private onEventScrolling;
        private updateClickBtnMove;
        private setVisibleByRectangeListView;
        private setVisibleItem;
        setItemVisible(item: _cc_.Node, visible: boolean): void;
        protected onRenderComplete(): void;
        renderComplete(): void;
        private onDelayRenderComplete;
        protected onRenderBefore(): void;
        private clearLoadResoucesQueue;
        private checkLoadResouces;
        intersectsRectItem(index: number): boolean;
        /**
         * 当前item全显示
         * @param item
         * @returns
         */
        containsRectItem(index: number): boolean;
        setContentPosition(x: number, y: number): void;
        setContentDeviation(x: number, y: number): void;
    }
}
 namespace apeng {
    interface IEventHandlerCC {
        callBack: Function | ((args: any) => void);
        caller?: Object;
        args?: any[];
    }
    /**使用 dispatchEvent 携带的数据 */
    interface IEventTouch<T> extends _cc_.EventTouch {
        emitData: T;
    }
    /**编辑器事件派发类 */
    class EventHandlerCC {
        /**打开按钮事件 */
        static enableClick: boolean;
        /**手指发生了拖动 */
        static touchIsMove: boolean;
        /**手指在拖动中，并且移动了距离 */
        static touchIsMoveRun: boolean;
        /**自动注册点击事件时 播放的音效 */
        static clickSoundUrl: string;
        static touchEvent: {
            on(type: string, callBack: Function, caller?: any): any;
            off(type: string, callBack: Function, caller?: any): any;
        };
        static stopPropagation(event: _cc_.EventTouch): void;
        static onClick(node: _cc_.Node, callBack: Function, caller: any): void;
        static offClick(node: _cc_.Node, callBack: Function, caller: any): void;
        static offAllClick(node: _cc_.Node): void;
        private static getCallBacks;
        static runClick(node: _cc_.Node, event: _cc_.EventTouch): void;
        /**
         * 分发事件到时间流中
         * @param node
         * @param event
         * @param type
         * @param isCatch 捕获阶段
         */
        static dispatchEvent(node: _cc_.Node, event: _cc_.EventTouch, type: string, emitData?: any, isCatch?: boolean): void;
        event: _cc_.EventHandler;
        events: _cc_.EventHandler[];
        get isCall(): boolean;
        private emitHandler;
        private _addEvents;
        emit(...values: any[]): boolean;
        /**添加事件 */
        addEvent(value: IEventHandlerCC): void;
        offEvent(value: IEventHandlerCC): void;
        offAllEvent(): void;
    }
}
 namespace apeng {
    /**完成回调处理  */
    class CompleteCallBack {
        cb: (...param: any[]) => void;
        _cb: (...param: any[]) => void;
        set(cb?: (...param: any[]) => void): void;
        run(...param: any[]): void;
        clear(): void;
    }
}
 namespace apeng {
    class AnimtorCCStateItemFrame {
        /**
         * 创建一个帧事件
         * @param delay
         * @param event
         * @returns
         */
        static create(delay: number, event: IEventHandlerCC): AnimtorCCStateItemFrame;
        delay: number;
        eventHandler: EventHandlerCC;
    }
    class AnimtorCCStateItem {
        animName: string;
        crossFade: number;
        finishPlayName: string;
        eventHandlerFinish: EventHandlerCC;
        frames: AnimtorCCStateItemFrame[];
        animtor: AnimtorCC;
        play(): void;
        onFinish(): void;
    }
    class AnimtorCC extends BaseComponent {
        backupDescribe: string;
        anim: _cc_.Animation;
        private autoPlay;
        private animCompleteUpdateList;
        items: AnimtorCCStateItem[];
        curPlayAnimName: string;
        curPlayAnimNameCb: CompleteCallBack;
        private itemsMap;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        getClipIndexByName(index?: number): string;
        /**
         * 添加状态得帧事件
         * 如果未配置 则创建个新的
         * @param animName 动画名
         * @param event 事件回调
         * @param delay 延迟时间 默认使用编辑器配置的
         * @param frameIndex 帧索引
         */
        addStateFrameEvent(animName: string, event: IEventHandlerCC, delay?: number, frameIndex?: number): void;
        /**
         * 获取一个状态 如没有 则创建默认的
         * @param animName
         * @returns
         */
        getStateItem(animName: string): AnimtorCCStateItem;
        getAnimNameByItem(animName: string): AnimtorCCStateItem;
        /**
         * 播放动画
         * 需先配置item列表
         * @param animName
         * @param cb
         * @returns
         */
        play(animName: string, crossFade?: number, cb?: () => void, speed?: number): void;
        /**当前动画是否播放完毕 */
        hasPlayComplete(animName?: string): boolean;
        /**切换动画状态 */
        changeState(animName: string): void;
        setAnimSpeed(animName: string, speed: number): void;
        getCurState(): _cc_.AnimationState;
        getState(animName: string): _cc_.AnimationState;
        /**设置动画播放完 需要多长时间 */
        setAnimDurationBySpeed(animName: string, duration: number): void;
        pause(animName?: string): void;
        resume(animName?: string): void;
        playDefault(cb?: () => void): void;
        getDefaultClip(): _cc_.AnimationClip;
        stop(): void;
        private onEventAnimFinish;
    }
}
 namespace apeng {
    class AutoTargetSizeCC extends BaseComponent {
        backupDescribe: string;
        target: _cc_.Node;
        autoWidth: boolean;
        set paddingWidth(value: number);
        get paddingWidth(): number;
        set ratioWidth(value: number);
        get ratioWidth(): number;
        autoHeight: boolean;
        set paddingHeight(value: number);
        get paddingHeight(): number;
        set ratioHeight(value: number);
        get ratioHeight(): number;
        private widgets;
        private _paddingWidth;
        private _ratioWidth;
        private _paddingHeight;
        private _ratioHeight;
        protected onEditorUpdateData: () => void;
        /**监听当前节点大小改变时刷新 */
        protected isSizeChangeUpdate: boolean;
        onLoad(): void;
        onEnable(): void;
        /**自动对齐padding */
        protected onSizeChange(): void;
        updateView(): void;
        private updateRender;
        private updateWidget;
        /**获取当前节点大小 方便子类重写 */
        protected getSize(): _cc_.Size;
    }
}
 namespace apeng {
    class ButtonByChildGrayExcludeCC extends _cc_.Component {
        backupDescribe: string;
    }
}
 namespace apeng {
    class ButtonCC extends BaseComponent {
        backupDescribe: string;
        private isPlayAudio;
        isPlayAnimPress: boolean;
        private pressDuration;
        private pressScale;
        private coolingTime;
        set isPlayBreathe(value: boolean);
        get isPlayBreathe(): boolean;
        private breatheLinear;
        set isGray(value: boolean);
        get isGray(): boolean;
        set interactable(value: boolean);
        get interactable(): boolean;
        private uiUrl;
        private globalControl;
        eventHandler: EventHandlerCC;
        private _isGray;
        private _isPlayBreathe;
        private _interactable;
        private _originalScale;
        private _transitionFinished;
        private _time;
        private _targetScale;
        private _fromScale;
        private _toScale;
        /**按下中 */
        private _pressed;
        private _isCooling;
        private _playBreathe;
        private _playPress;
        private tweenType;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        protected onUpdate(): void;
        /**
         * 暂停事件 包括动画 按压效果
         * @param value
         * @param stopEvent 阻止响应事件
         */
        setStopClick(value: boolean, stopEvent: boolean, gray?: boolean): void;
        onTouchStart(e: _cc_.EventTouch): void;
        protected onTouchMove(event: _cc_.EventTouch): void;
        onTouchEnd(event: _cc_.EventTouch): void;
        protected onTouchCancel(event: _cc_.EventTouch): void;
        protected updateScale(): void;
        private onTouchNodeEndTimerOnce;
        private clearData;
        hasEmitEvent(): boolean;
    }
}
 namespace apeng {
    class CameraOrbitControlCC extends Component {
        private target;
        private minDistance;
        private maxDistance;
        private isAutoEvent;
        private minPolarAngle;
        private maxPolarAngle;
        private minAzimuthAngle;
        private maxAzimuthAngle;
        private enableDamping;
        private dampingFactor;
        private enableZoom;
        private zoomSpeed;
        private enableRotate;
        private rotateSpeed;
        private enablePan;
        private panSpeed;
        private screenSpacePanning;
        private keyPanSpeed;
        private autoRotate;
        private autoRotateSpeed;
        private object;
        private camera;
        private state;
        private readonly spherical;
        private readonly sphericalDelta;
        private scale;
        private readonly panOffset;
        private zoomChanged;
        private readonly rotateStart;
        private readonly rotateEnd;
        private readonly rotateDelta;
        private readonly panStart;
        private readonly panEnd;
        private readonly panDelta;
        private readonly dollyStart;
        private readonly dollyEnd;
        private readonly dollyDelta;
        private readonly pointers;
        private readonly pointerPositions;
        private _scaleAdd;
        get scaleRatio(): number;
        onLoad(): void;
        start(): void;
        reset(): void;
        onEnable(): void;
        onDisable(): void;
        onDestroy(): void;
        private onMouseDown;
        private rotateLeft;
        private rotateUp;
        private handleMouseMoveRotate;
        onMouseMove(event: _cc_.EventTouch): void;
        private panLeft;
        private panUp;
        private pan;
        onMouseWheel(event: _cc_.EventMouse): void;
        private getZoomScale;
        private dollyOut;
        private dollyIn;
        private handleMouseWheel;
        private readonly offset;
        private readonly quat;
        private readonly quatInverse;
        private readonly lastPosition;
        private readonly lastQuaternion;
        private updateObject;
        update(deltaTime: number): void;
    }
}
 namespace apeng {
    class CameraTouchMoveCC extends BaseComponent {
        backupDescribe: string;
        changeZ: boolean;
        speed: number;
        private v3_t;
        private quat_t;
        protected onStageTouchMove(evt: _cc_.EventTouch): void;
        private result;
        private _getDirection;
    }
}
 namespace apeng {
    class ClickChangeViewCC extends BaseComponent {
        readonly EventType: {
            CHANGE: string;
        };
        backupDescribe: string;
        set index(vlaue: number);
        get index(): number;
        _index: number;
        private otherBtns;
        get views(): _cc_.Node;
        get btns(): _cc_.Node;
        get curIndexByName(): string;
        get curBtnIndexByName(): string;
        protected onEditorUpdateData: () => void;
        /**返回为true时 可正常切换 */
        hasChange: (idnex: number) => boolean;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        private onClickChildren;
        setIndex(index: number): void;
        updateView(): void;
        getBtnIndexByName(index: number): string;
        getIndexByName(index: number): string;
        setIndexByName(name: string): void;
    }
}
 namespace apeng {
    class ControllerByChildItem {
        controllerName: string;
        visible: boolean;
    }
    class ControllerByChildCC extends BaseComponent {
        backupDescribe: string;
        remove: boolean;
        items: ControllerByChildItem[];
        set all(value: boolean);
        get all(): boolean;
        set noClear(value: boolean);
        get noClear(): boolean;
        private _all;
        private _noClear;
        setVisible(controllerName: string): void;
    }
}
 namespace apeng {
    class ControllerByChildExcludeCC extends _cc_.Component {
        backupDescribe: string;
        remove: boolean;
    }
}
 namespace apeng {
    class ControllerCCItem2 {
        controllerName: string;
    }
    class ControllerCC extends BaseComponent {
        backupDescribe: string;
        items: ControllerCCItem2[];
        set index(vlaue: number);
        get index(): number;
        _index: number;
        set itemName(vlaue: string);
        get itemName(): string;
        _itemName: string;
        private itemNameMap;
        protected onEditorUpdateData: () => void;
        protected onEditorClearData(): void;
        onLoad(): void;
        setIndex(index: number): void;
        setItemName(itemName: string, defaultIndex?: number): void;
        updateView(): void;
    }
}
 namespace apeng {
    class CreatePrefabToEditorOnceCC extends BaseComponent {
        getPool(): Pool<string, _cc_.Node>;
        get item(): _cc_.Node;
        set prefabItem(value: _cc_.Prefab);
        get prefabItem(): _cc_.Prefab;
        private prefabItemDeep;
        set isPreloadPrefab(value: boolean);
        get isPreloadPrefab(): boolean;
        prefabItemByUuid: string;
        runClearItem: boolean;
        private _prefabItem;
        private _isPreloadPrefab;
        isLoadPrefab: boolean;
        loadPrefabUrl: string;
        get content(): _cc_.Node;
        protected onEditorUpdateData(): void;
        protected onEditorClearData(): void;
        onPreLoad(): void;
        private updatePreloadPrefab;
        /**加载引用的预制体 */
        preloadPrefab(url?: string, updateItem?: boolean, complete?: (isVisible: boolean) => void): void;
        updateItem(): void;
        addItem(): _cc_.Node;
        removeItem(item?: _cc_.Node, destroy?: boolean): any;
        getPrefabUuidByUrl(): string;
        removeAll(): void;
        /**创建item 添加到节点前时 */
        protected onAddItem(item: _cc_.Node): void;
        protected onRemoveItem?(): void;
    }
}
 namespace apeng {
    class DragViewCC extends BaseComponent {
        backupDescribe: string;
        content: _cc_.Node;
        dragReverse: boolean;
        brake: number;
        scaleViewMin: number;
        scaleCamera: _cc_.Camera;
        isAutoEvent: boolean;
        lerpTouchDelay: number;
        protected _autoScrolling: boolean;
        protected _topBoundary: number;
        protected _bottomBoundary: number;
        protected _leftBoundary: number;
        protected _rightBoundary: number;
        protected _touchMoveDisplacements: Vector3[];
        protected _touchMoveTimeDeltas: number[];
        protected _touchMovePreviousTimestamp: number;
        protected _touchMoved: boolean;
        protected _autoScrollAttenuate: boolean;
        protected _autoScrollStartPosition: _cc_.math.Vec3;
        protected _autoScrollTargetDelta: _cc_.math.Vec3;
        protected _autoScrollTotalTime: number;
        protected _autoScrollAccumulatedTime: number;
        protected _autoScrollCurrentlyOutOfBoundary: boolean;
        protected _autoScrollBraking: boolean;
        protected _autoScrollBrakingStartPosition: _cc_.math.Vec3;
        protected _outOfBoundaryAmount: _cc_.math.Vec3;
        protected _outOfBoundaryAmountDirty: boolean;
        protected _stopMouseWheel: boolean;
        protected _mouseWheelEventElapsedTime: number;
        protected _isScrollEndedWithThresholdEventFired: boolean;
        protected _deltaPos: _cc_.math.Vec3;
        private _orginCameraOrthoheight;
        private _orginContentSize;
        private _scaleCameraRatio;
        private _scaleAdd;
        private _scaleCheckBoundary;
        isTouchStart: boolean;
        isTouchStartDealy: boolean;
        get scaleRatio(): number;
        get contentUITransform(): _cc_.UITransform;
        scaleMax: number;
        private _scaleToLerpSpeed;
        private _scaleToRatio;
        private _scaleToMinRatio;
        _scaleToStart: boolean;
        onLoad(): void;
        updateContentSize(_size: _cc_.Size): void;
        protected onSizeChange: () => void;
        onUpdate(): void;
        onDisable(): void;
        getScaleToByRatio(): number;
        scaleTo(lerpSpeed: number, toRatio: number, _scaleCheckBoundary?: boolean, minRatio?: number): void;
        scaleTo2(ratio: number): void;
        _onMouseWheel(event: _cc_.EventMouse, captureListeners?: _cc_.Node[]): void;
        _onTouchBegan(event: _cc_.EventTouch, captureListeners?: _cc_.Node[]): void;
        _onTouchMoved(event: _cc_.EventTouch, captureListeners?: _cc_.Node[]): void;
        /**
         * 缩放
         * @param offsetRatio
         * @param reverse 比率取反
         */
        private scaleView;
        _onTouchEnded(event: _cc_.EventTouch, captureListeners?: _cc_.Node[]): void;
        _onTouchCancelled(event: _cc_.EventTouch, captureListeners?: _cc_.Node[]): void;
        private _touchEnd;
        private _touchEndDelay;
        _calculateBoundary(): void;
        setContentPosition(position: _cc_.Vec3): void;
        protected _hasNestedViewGroup(event: _cc_.Event, captureListeners?: _cc_.Node[]): boolean;
        protected _calculateAttenuatedFactor(distance: number): number;
        protected _startAttenuatingAutoScroll(deltaMove: _cc_.Vec3, initialVelocity: _cc_.Vec3): void;
        protected _moveContent(deltaMove: _cc_.Vec3): void;
        protected _getContentLeftBoundary(): number;
        protected _getContentRightBoundary(): number;
        protected _getContentTopBoundary(): number;
        protected _getContentBottomBoundary(): number;
        protected _getHowMuchOutOfBoundary(out: _cc_.Vec3, addition?: _cc_.Vec3): _cc_.math.Vec3;
        protected _stopPropagationIfTargetIsMe(event: _cc_.Event): void;
        /**强制打开插值动画 */
        openLerp(): void;
        /**
         * 插值到目标
         * @param target 左下脚原点
         * @param ratio
         */
        lerpMove(target: IVector2, ratio: number, checkScaleTo?: boolean, minRatio?: number): boolean;
        protected _processDeltaMove(deltaMove: _cc_.Vec3, touch?: boolean): void;
        protected _handleReleaseLogic(touch: _cc_.Touch): void;
        protected _getLocalAxisAlignDelta(out: _cc_.Vec3, touch: _cc_.Touch): void;
        protected _handlePressLogic(): void;
        protected _clampDelta(out: IVector3): void;
        protected _gatherTouchMove(delta: _cc_.Vec3): void;
        protected _processInertiaScroll(): void;
        protected _isOutOfBoundary(): boolean;
        protected _isNecessaryAutoScrollBrake(): boolean;
        protected _processAutoScrolling(dt: number): void;
        protected _checkMouseWheel(dt: number): void;
        protected _calculateMovePercentDelta<T extends IVector2>(anchor: IVector2, applyToHorizontal: boolean, applyToVertical: boolean, out: T): T;
        /**
         * 移动到指定位置
         * @param target 容器下的坐标
         * @param duration
         */
        moveTo(target: IVector2, duration: number): void;
        protected _startAutoScroll(deltaMove: _cc_.Vec3, duration: number, attenuated: boolean): void;
    }
}
 namespace apeng {
    class DragonBonesCC extends BaseComponent {
        EventType: {
            PLAY: string;
        };
        backupDescribe: string;
        anim: _cc_.dragonBones.ArmatureDisplay;
        private crossFade;
        curPlayAnimName: string;
        curPlayTimes: number;
        curState: _cc_.dragonBones.AnimationState;
        lastPlayAnim: string;
        curPlayAnimNameCb: () => void;
        hasPlay: (animName: string) => boolean;
        private initTimeScale;
        private playing;
        onLoad(): void;
        onDisable(): void;
        private onEventAnimComplete;
        /**暂停动画 */
        pause(): void;
        resume(): void;
        /**
         * 播放龙骨
         * @param animName 播放的名称
         * @param playTimes 播放次数 0循环
         * @param cb
         * @returns
         */
        play(animName: string, playTimes?: number, cb?: () => void, checkCur?: boolean): void;
        playDefault(playTimes: number, cb?: () => void, checkCur?: boolean): void;
        /**当前动画是否播放完毕  安卓端无效*/
        hasPlaying(animName: string): boolean;
        getState(animName: string): _cc_.dragonBones.AnimationState;
        /**切换动画状态 */
        changeState(animName: string, playTimes: number): void;
        getCurPlayTime(): number;
        duration(animName: string): number;
        animNames(): string[];
        setCurrentTime(animName: string, currentTime: number, playTimes: number): void;
    }
}
 namespace apeng {
    class CCFontItem {
        string: string;
        set sf(value: _cc_.SpriteFrame);
        get sf(): _cc_.SpriteFrame;
        offsetHight: number;
        offsetWidth: number;
        private _sf;
        get width(): number;
        get height(): number;
    }
    class FontCC extends BaseComponent {
        backupDescribe: string;
        private Pool;
        set space(value: number);
        get space(): number;
        set string(value: string);
        get string(): string;
        set color(value: _cc_.math.Color);
        get color(): _cc_.math.Color;
        set isGray(value: boolean);
        get isGray(): boolean;
        private items;
        get isBold(): boolean;
        set isBold(value: boolean);
        private _isBold;
        private _isGray;
        private _string;
        private _space;
        private _color;
        private itemsByStringMap;
        protected onEditorUpdateData: () => void;
        protected onEditorClearData(): void;
        onLoad(): void;
        onDestroy(): void;
        private getItem;
        updateView(): void;
    }
}
 namespace apeng {
    class JoystickCC extends BaseComponent {
        readonly EventType: {
            MOVE: string;
            START: string;
            END: string;
            ANIM_COMPLETE: string;
        };
        backupDescribe: string;
        private orginNode;
        private orginImgNode;
        private dragNode;
        radius: number;
        private _touchId;
        angle: number;
        len: number;
        dir: Vector2;
        private isAnim;
        onEnable(): void;
        onTouchStart(e: _cc_.EventTouch): void;
        onTouchMove(e: _cc_.EventTouch): void;
        onTouchEnd(e: _cc_.EventTouch): void;
        protected onTouchCancel: (e: _cc_.EventTouch) => void;
        protected onUpdate(): void;
        private stopAnim;
        private setAngle;
    }
}
 namespace apeng {
    class LabelNumRollCC extends BaseComponent {
        static texts: {
            20001: string;
            20002: string;
        };
        backupDescribe: string;
        lastStr: string;
        private duration;
        strInterval: string;
        _to: number;
        private _from;
        isAnim: boolean;
        private _dtCount;
        cur: number;
        onEnable(): void;
        onUpdate(): void;
        toByString(num: number): void;
        updateString(num: number): void;
        setString(num: number): void;
    }
}
 namespace apeng {
    class LanguageLabelCC extends _cc_.Component {
        backupDescribe: string;
        private configID;
        private lb;
        __preload(): void;
        onEnable(): void;
        onDisable(): void;
        private onEventChange;
    }
}
 namespace apeng {
    enum ELayoutType {
        /**横向 */
        Horizontal = 0,
        /**纵向 */
        Vertical = 1,
        /**横向网格 */
        HorizontalGrid = 2,
        /**纵向网格 */
        VerticalGrid = 3
    }
    enum EVerticalDirection {
        BottomToTop = 0,
        TopToBottom = 1
    }
    enum EHorizontalDirection {
        LeftToRight = 0,
        RightToLeft = 1
    }
    class LayoutCC extends BaseComponent {
        backupDescribe: string;
        content: _cc_.Node;
        set itemSize(value: _cc_.math.Size);
        get itemSize(): _cc_.math.Size;
        set numItems(value: number);
        get numItems(): number;
        set type(value: ELayoutType);
        get type(): ELayoutType;
        set horizontalGridCount(value: number);
        get horizontalGridCount(): number;
        set verticalGridCount(value: number);
        get verticalGridCount(): number;
        set horizontalDirection(value: EHorizontalDirection);
        get horizontalDirection(): EHorizontalDirection;
        set verticalDirection(value: EVerticalDirection);
        get verticalDirection(): EVerticalDirection;
        set paddingLeft(value: number);
        get paddingLeft(): number;
        set paddingRight(value: number);
        get paddingRight(): number;
        set paddingTop(value: number);
        get paddingTop(): number;
        set paddingBottom(value: number);
        get paddingBottom(): number;
        set spacingX(value: number);
        get spacingX(): number;
        set spacingY(value: number);
        get spacingY(): number;
        set horizontalItemY(value: number);
        get horizontalItemY(): number;
        set verticalItemX(value: number);
        get verticalItemX(): number;
        set horizontalAddByLevel(value: number);
        get horizontalAddByLevel(): number;
        set verticalAddByLevel(value: number);
        get verticalAddByLevel(): number;
        set isSetContentSize(value: boolean);
        get isSetContentSize(): boolean;
        set ratatePosition(value: number);
        get ratatePosition(): number;
        set applyItemRotate(value: boolean);
        get applyItemRotate(): boolean;
        set showItemByLabelIndex(value: boolean);
        get showItemByLabelIndex(): boolean;
        set gridOneCenter(value: boolean);
        get gridOneCenter(): boolean;
        private _itemSize;
        private _numItems;
        private _horizontalItemY;
        private _verticalItemX;
        private _horizontalGridCount;
        private _verticalGridCount;
        private _isSetContentSize;
        private _type;
        private _horizontalDirection;
        private _verticalDirection;
        private _paddingLeft;
        private _paddingRight;
        private _paddingTop;
        private _paddingBottom;
        private _spacingX;
        private _spacingY;
        private _horizontalAddByLevel;
        private _verticalAddByLevel;
        private _ratatePosition;
        private _applyItemRotate;
        private _showItemByLabelIndex;
        private _gridOneCenter;
        protected onEditorUpdateData: () => void;
        protected onAnchorChange: () => void;
        private get contentTransform();
        /**item所对应的坐标 */
        itemByPosition: Vector2[];
        onLoad(): void;
        start(): void;
        updateView(): void;
        /**获取包围盒 */
        getItemRectange(out: Rectangle, index: number, isWorld: boolean, offset?: IVector2): Rectangle;
        /**通过坐标点获取所在的索引 */
        getPositionByIndex(position: IVector2): number;
        protected _doLayoutVertical(length: number): void;
        protected _doLayoutHorizontal(length: number): void;
        protected _doLayoutHorizontalGrid(length: number): void;
        protected _doLayoutVerticalGrid(length: number): void;
        private setItemPosition;
        /**获取节点位置 */
        getItemPosition<T extends IVector2>(index: number, isWorld: boolean, offset?: IVector2): T;
        updateItemRotate(): void;
        /**更新节点位置 */
        updateItemPosition(index?: number): void;
        getHorizontalWidth(count?: number): number;
        getVerticalHeight(count?: number): number;
        private getHorizontalCount;
        private geVerticalCount;
        protected _getPaddingH(): number;
        protected _getPaddingV(): number;
    }
}
 namespace apeng {
    class LayoutCircleCC extends CreatePrefabToEditorCC {
        backupDescribe: string;
        set mulCount(value: number[]);
        get mulCount(): number[];
        set mulDisCount(value: number);
        get mulDisCount(): number;
        private allCount;
        private _mulDisCount;
        private _mulCount;
        positions: Vector2[];
        onUpdateItem(): void;
        getRadius(): number;
    }
}
 namespace apeng {
    interface ILevelRollCCData {
        /**总的个数 必须是 once+last + loop*整数 */
        count: number;
        items: {
            once: ILevelRollCCDataItem;
            loop: ILevelRollCCDataItem[];
            last: ILevelRollCCDataItem;
        };
    }
    interface ILevelRollCCParse {
        source: ILevelRollCCData;
        allHeight: number;
        onceY: number;
        lastY: number;
        loopY: number[][];
        itemsY: [number, number][];
        bgsY: number[];
    }
    interface ILevelRollCCDataItem {
        height: number;
        position: Vector2[];
    }
    class LevelRollCC extends BaseComponent {
        static getBgIndexByData(index: number, parse: ILevelRollCCParse): ILevelRollCCDataItem;
        static getBgIndexBySf(index: number, parse: ILevelRollCCParse, comp: LevelRollCC): _cc_.SpriteFrame;
        static parseData(data: ILevelRollCCData): ILevelRollCCParse;
        private prefabItem;
        private prefabBg;
        private sfOnce;
        private sfLast;
        private sfLoop;
        private itemYOffset;
        private itemCount;
        private bgCount;
        /**容器 */
        get content(): _cc_.Node;
        get bgParent(): _cc_.Node;
        get itemParent(): _cc_.Node;
        private createNode;
        parses: ILevelRollCCParse;
        private bgs;
        private items;
        contentTrans: _cc_.UITransform;
        private screenH;
        private showBgs;
        private showItems;
        onLoad(): void;
        init(parses: ILevelRollCCParse): void;
        updateView(): void;
        /**清除全部显示的 */
        clearShow(): void;
        scrollToIndex(index: number, duration: number, spaceY: number): void;
        getItemWithIndex(index: number): LevelRollCCItem;
    }
}
 namespace apeng {
    class LevelRollCCBg extends BaseComponent {
        updateView(comp: LevelRollCC, index: number): void;
    }
}
 namespace apeng {
    class LevelRollCCItem extends BaseComponent {
        updateView(comp: LevelRollCC, index: number): void;
    }
}
 namespace apeng {
    class ListCCByBaseItemCC extends BaseComponent {
        listInit(): void;
    }
}
 namespace apeng {
    class ListCCByLayoutItemRenderCC extends _cc_.Component {
        backupDescribe: string;
    }
}
 namespace apeng {
    class ListRollCC extends CreatePrefabToEditorCC {
        backupDescribe: string;
        private renderTop;
        private renderBottom;
        topPadding: number;
        bottomPadding: number;
        ySpace: number;
        itemHeight: number;
        /**容器 */
        get content(): _cc_.Node;
        private itemDatas;
        itemDataLength: number;
        private itemHeights;
        private itemYs;
        private itemByIndexs;
        curRenderMin: number;
        curRenderMax: number;
        itemDataRender: (data: any, item: _cc_.Node, index: number) => void;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        private updateRange;
        clearItems(): void;
        onSizeChange: () => void;
        private onEventScrolling;
        setItemDatas<T>(datas: (T[]) | number): void;
        updateRenderRange(): void;
        updateItems(): void;
        private onDealyAddItem;
        getItemY(index: number): number;
        updateContentSize(): void;
        updateItemData(index: number): void;
        updateItemDatas(): void;
        showIndex(index: number, offset?: number): void;
    }
}
 namespace apeng {
    /**竖屏手机最大高度 */
    function uiMaxSize(): _cc_.Size;
    class MaxBoxCC extends BaseComponent {
        /**空出底部的世界坐标 */
        static worldYBottom(): number;
        /**空出顶部部的世界坐标 */
        static worldYTop(): number;
        backupDescribe: string;
        set isTop(value: boolean);
        get isTop(): boolean;
        set topOffset(value: number);
        get topOffset(): number;
        set isBottom(value: boolean);
        get isBottom(): boolean;
        set bottomOffset(value: number);
        get bottomOffset(): number;
        private _bottomOffset;
        private _topOffset;
        private _isTop;
        private _isBottom;
        protected onEditorUpdateData: () => void;
        onLoad(): void;
        private updateView;
    }
}
 namespace apeng {
    interface IVector3 {
        x: number;
        y: number;
        z: number;
    }
    type TVector3Set = number | number[] | IVector3;
    class Vector3 implements IVector3 {
        static readonly pool: PoolOnce<Vector3>;
        /**零向量,禁止修改*/
        static readonly ZERO: Vector3;
        static readonly ONE: Vector3;
        /**
         *  排除浮点数误差的向量近似等价判断
         */
        static equals(a: IVector3, b: IVector3, epsilon?: number): boolean;
        static equalsZero(a: IVector3, b: IVector3): boolean;
        /** 逐元素向量加法  */
        static add(out: IVector3, a: IVector3, b: IVector3): IVector3;
        /**逐元素向量减法 */
        static sub(out: IVector3, a: IVector3, b: IVector3): IVector3;
        /**绕X轴旋转向量指定角度度 */
        static rotateX(out: IVector3, rotate: IVector3, orgin: IVector3, angle: number): IVector3;
        /**绕Y轴旋转向量指定角度度 */
        static rotateY(out: IVector3, rotate: IVector3, orgin: IVector3, angle: number): IVector3;
        /**绕Z轴旋转向量指定角度度 */
        static rotateZ(out: IVector3, rotate: IVector3, orgin: IVector3, angle: number): IVector3;
        /**
        * 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
        * @method mulSelf
        * @param {number} num
        * @return {Vec2} returns this
        * @chainable
        * @example
        * var v = _cc_.v2(10, 10)
        * v.mulSelf(5)// return Vec2 {x: 50, y: 50}
        */
        static mul(out: IVector3, value: IVector3, num: number | IVector3): IVector3;
        static cloneTo(self: IVector3, out: Vector3): Vector3;
        static set(self: IVector3, x?: TVector3Set, y?: number, z?: number): IVector3;
        /**
         * 转换为方便阅读的字符串。
         * @method toString
         * @return {string}
         */
        static toString(value: IVector3): string;
        /**
         * 求向量长度
         */
        static len(value: IVector3): number;
        /**
         * 求向量长度平方
         */
        static lengthSqr(value: IVector3): number;
        /**
         * 将当前向量归一化
         */
        static normalize(out: IVector3, value: IVector3): IVector3;
        /**
         * 找到多边形的中心点
         * @param polygon
         */
        static polygonByCenterPoint(out: IVector3, polygon: IVector3[]): IVector3;
        /**
         * 两个三维向量距离。 不开方
         * @param	value1 向量1。
         * @param	value2 向量2。
         * @return	距离。
         */
        static distanceSqr(value1: IVector3, value2: IVector3): number;
        /**
       * 两个三维向量距离。
       * @param	value1 向量1。
       * @param	value2 向量2。
       * @return	距离。
       */
        static distance(value1: IVector3, value2: IVector3): number;
        /**
         * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
         * @param to 目标向量。
         * @param ratio 插值比率，范围为 [0,1]。
         */
        static lerp(out: IVector3, from: IVector3, to: IVector3, ratio: number | IVector3): IVector3;
        x: number;
        y: number;
        z: number;
        constructor(x?: TVector3Set, y?: number, z?: number);
        set(x?: TVector3Set, y?: number, z?: number): Vector3;
        equals(b: IVector3, epsilon?: number): boolean;
        sub(out: IVector3, other: IVector3): Vector3;
        subSelf(other: IVector3): Vector3;
        add(out: IVector3, other: IVector3): Vector3;
        addSelf(other: IVector3): Vector3;
        clone(): Vector3;
        len(): number;
        toString(): string;
        lengthSqr(): number;
        mul(out: IVector3, num: number): Vector3;
        mulSelf(num: number): Vector3;
        rotateX(orgin: IVector3, angle: number): Vector3;
        rotateY(orgin: IVector3, angle: number): Vector3;
        rotateZ(orgin: IVector3, angle: number): Vector3;
        normalize(out: IVector3): Vector3;
        normalizeSelf(): Vector3;
    }
}
 namespace apeng {
    /**------------ 最少一帧执行一次---------*/
    interface IMove {
        /**移动的目标点 */
        target: Vector3;
        /**移动速度 */
        speed?: number;
        /**当前移动速度的倍率 默认 1 */
        speedMul?: number;
        /**缓动值 */
        ease?: EEaseType;
        /**正在移动 */
        onUpdate?: ((ratio: number) => void) | Function;
        /**开始移动时 */
        onStart?: (() => void) | Function;
        /**移动结束时 */
        onEnd?: (() => void) | Function;
        /**贝塞尔控制点 曲线点*/
        bezierTarget?: Vector3;
        /**贝塞尔起始点 */
        bezierTargetFrom?: Vector3;
        /**样条曲线 起点； bezierTarget点； splineTraget点; target点；*/
        splineTraget?: Vector3;
        /**移动到指定比率即结束 0~1 默认1 */
        endRatio?: number;
        /**指定从开始比率移动 0~1 默认0 */
        startRatio?: number;
        /**外部数据存储地 */
        temp?: any;
        /**待机不动 */
        delay?: number;
    }
    interface IMoveState {
        /**运行的总dt */
        dtTotal: number;
        /**移动的时间 */
        duration: number;
        /**暂停移动中 */
        isPause: boolean;
        /**比率结束时的位置 */
        endRatioPoint: Vector3;
        /**是否已经使用了开始移动比率 */
        isStartRatio: boolean;
    }
    /**移动组件 支持2d 3d节点移动 */
    class Move {
        static readonly pool: PoolOnce<Move>;
        private static readonly IMove;
        private static readonly IMoveState;
        /**外部实现此方法 避免出现引用 */
        static getPosition(node: any, isWorld: boolean): IVector3;
        /**外部实现此方法 避免出现引用 */
        static setPosition(node: any, value: Vector3, isWorld: boolean): any;
        /**外部实现此方法 避免出现引用 */
        static lookAt(node: Node, target: IVector3, rotate?: number, defaultRotate?: number): void;
        /**获取帧率 */
        static getDeltaTime(isSlowMotion: boolean): number;
        endCallBack: CompleteCallBack;
        /**移动节点 */
        node: any;
        /**世界坐标移动 */
        isWorld: boolean;
        /**移动速度 */
        speed: number;
        /**受到慢镜头影响 */
        isSlowMotion: boolean;
        /**起始位置 */
        private fromTarget;
        /**暂停移动 */
        isPause: boolean;
        /**存上次的index 方便做回调处理 */
        private laseIndex;
        private lookAtNode;
        private lookAtNodeRotate;
        /**需要移动的全部时间 */
        allDuration: number;
        /**运行的数据 */
        states: IMoveState[];
        /**传入的数据 */
        datas: IMove[];
        /**当前正在运行的数据块索引 */
        _index: number;
        setPosition?: (node: any, value: Vector3, isWorld: boolean) => void;
        getPosition?: (node: any) => IVector3;
        private _v3T;
        private _v3T2;
        /**初始化移动数据 */
        init(node: any, isWorld: boolean, speed: number, isSlowMotion?: boolean): void;
        /**清空所有数据 */
        dispose(): void;
        /**重置移动数据 */
        clear(): void;
        /**
         * 移动时 设置朝向
         * @param node
         * @param rotate
         */
        setLookAt(node: any, rotate: number): void;
        /**设置移动数据 */
        setRunData(length: number, cb: (data: IMove, index: number) => void): void;
        /**
        * 设置目标位置
        * @param value
        */
        run(complete?: () => void): void;
        getTargetSpeed(index: number): number;
        onUpdate(): void;
        private setPopTarget;
    }
}
 namespace apeng {
    class MoveCCItem {
        target: _cc_.Node;
        targetV3: _cc_.Vec3;
        speed: number;
        speedMul: number;
        ease: EEaseType;
        endRatio: number;
        startRatio: number;
        isBezier: boolean;
        bezierTarget: _cc_.Node;
        bezierTargetFrom: _cc_.Node;
        isEmitCall: boolean;
        onStart: EventHandlerCC;
        onEnd: EventHandlerCC;
        onUpdate: EventHandlerCC;
    }
    class MoveCC extends BaseComponent {
        backupDescribe: string;
        tag: string;
        target: _cc_.Node;
        isWorldMove: boolean;
        speed: number;
        loopCount: number;
        autoPlay: boolean;
        node_lookAt: _cc_.Node;
        lookAtAngle: number;
        items: MoveCCItem[];
        _move: Move;
        private curLoopCount;
        orginPosition: _cc_.Vec3;
        private completeCb;
        private endPos;
        onLoad(): void;
        onEnable(): void;
        onDestroy(): void;
        protected onUpdate(): void;
        startMove(completeCb?: () => void): void;
        resetPos(): void;
    }
}
 namespace apeng {
    class RenderOpacityAnimCC extends BaseComponent {
        backupDescribe: string;
        speed: number;
        showEaseType: EEaseType;
        hideSpeed: number;
        hideEaseType: EEaseType;
        private _curOpacity;
        private orginOpacity;
        private isFadeIn;
        private playComplete;
        onLoad(): void;
        onDisable(): void;
        protected onUpdate(): void;
        /**
         *
         * @param fadeIn 渐显 反之 渐隐
         * @param cb
         */
        play(fadeIn: boolean, cb?: () => void, anim?: boolean): void;
        private updateView;
        /**当前动画是否播放完毕 */
        isPlayComplete(): boolean;
        protected _setOpacity(ratio: number): void;
    }
}
 namespace apeng {
    class OpacityLoopAnimCC extends RenderOpacityAnimCC {
        backupDescribe: string;
        showDelay: number;
        hideDelay: number;
        onEnable(): void;
        private show;
        private hide;
    }
}
 namespace apeng {
    class ParticleSystem2DCC extends BaseComponent {
        backupDescribe: string;
        private isAutoPlay;
        private delayPlay;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        play(complete: () => void): void;
        private _play;
    }
}
 namespace apeng {
    class ProgressCC extends BaseComponent {
        readonly EventType: {
            COMPLETE: string;
            CHANGE: string;
        };
        backupDescribe: string;
        private sp;
        private lb;
        private lb2;
        strAfterPix: string;
        strLastPix: string;
        set ratio(value: number);
        get ratio(): number;
        private ratioBySpriteLitte;
        private ratioByLabelLitte;
        ratioFollowNode: _cc_.Node;
        isDragRatioFollowNode: boolean;
        followNodeXScale: number;
        followNodeXOffset: number;
        ratioPrefab: _cc_.Prefab;
        set ratioPrefabValues(value: number[]);
        get ratioPrefabValues(): number[];
        isToMax: boolean;
        clickAddNode: _cc_.Node;
        clickSubNode: _cc_.Node;
        clickAddRatio: number;
        maxShow: number;
        private _ratioPrefabValues;
        _ratio: number;
        protected onEditorUpdateData: () => void;
        private progress;
        private dtCount;
        private dtCount2;
        private addSpeed;
        private addSpeed2;
        private isRun;
        maxShowMin: number;
        /**模拟进度跑慢 */
        get isRunMax(): boolean;
        protected onEditorClearData(): void;
        onLoad(): void;
        onUpdate(): void;
        /**
         * 设置分段显示
         * @param count
         */
        setMaxShow(maxCount: number, min?: number, curCount?: number): void;
        getMaxCurCount(): number;
        /**
         * 模拟进度
         * @param progress
         * @param durtion 持续时长
         */
        run(progress: () => number, durtion?: number): void;
        getRatioByLocalX(ratio: number): number;
        getRatioByWorldX(ratio: number): number;
        private updateView;
        getRatioValues(): number[];
    }
}
 namespace apeng {
    class SpineCC extends BaseComponent {
        backupDescribe: string;
        anim: _cc_.sp.Skeleton;
        curPlayAnimName: string;
        loop: boolean;
        curState: _cc_.sp.spine.TrackEntry;
        lastPlayAnim: string;
        private initTimeScale;
        curPlayAnimNameCb: CompleteCallBack;
        onLoad(): void;
        onDisable(): void;
        private onEventAnimFinish;
        stop(): void;
        /**暂停动画 */
        pause(): void;
        resume(): void;
        /**
         * 播放龙骨
         * @param animName 播放的名称
         * @param playTimes 播放次数 0循环
         * @param cb
         * @returns
         */
        play(animName: string, loop: boolean, cb?: () => void, checkCur?: boolean): void;
        playDefault(loop?: boolean, cb?: () => void): void;
        playRandom(loop?: boolean, cb?: () => void): void;
        /**当前动画是否播放完毕 */
        hasPlayComplete(animName?: string): boolean;
        animNames(): string[];
    }
}
 namespace apeng {
    class SpriteEnableFadeInCC extends RenderOpacityAnimCC {
        backupDescribe: string;
        onEnable(): void;
    }
}
 namespace apeng {
    class SpriteFrameAnimCCItem {
        sfs: _cc_.SpriteFrame[];
    }
    class SpriteFrameAnimCC extends Component {
        readonly EventType: {
            /**单次播放完成 */
            PLAY_COMPLETE: string;
            /**总次数播放完成 */
            PLAY_COUNT_COMPLETE: string;
        };
        backupDescribe: string;
        items: SpriteFrameAnimCCItem[];
        itemIndex: number;
        fps: number;
        autoPlay: boolean;
        playCount: number;
        private sp;
        private _dts;
        private _index;
        private _count;
        isPause: boolean;
        get item(): SpriteFrameAnimCCItem;
        protected onLoad(): void;
        protected onEnable(): void;
        protected update(dt: number): void;
        registAnimComplete(cb: () => void): void;
        setIndex(item: SpriteFrameAnimCCItem, index: number): void;
    }
}
 namespace apeng {
    enum EAlignType {
        Left = 0,
        Center = 1,
        Right = 2
    }
    enum EVertAlignType {
        Top = 0,
        Middle = 1,
        Bottom = 2
    }
    enum ESpriteSimpleFillType {
        None = 0,
        /**自由缩放 */
        Scale = 1,
        /**等比缩放(适应高度) */
        ScaleByHeight = 2,
        /**等比缩放(适应宽度) */
        ScaleByWidth = 3,
        /**等比缩放(显示全部) */
        ScaleShowAll = 4,
        /**等比缩放(无边框) */
        ScaleNoBorder = 5
    }
    class SpriteLoaderCC extends BaseComponent {
        backupDescribe: string;
        set mat(value: _cc_.Material);
        get mat(): _cc_.Material;
        isLanguage: boolean;
        private enterLoadQueue2;
        private autoLoad;
        set bindLoad(value: boolean);
        get bindLoad(): boolean;
        set spriteColor(value: _cc_.math.Color);
        get spriteColor(): _cc_.math.Color;
        spriteFrameByUuid: string;
        set spriteFrame(value: _cc_.SpriteFrame);
        get spriteFrame(): _cc_.SpriteFrame;
        private spriteFrameDeep;
        set spriteSimpleFillType(value: ESpriteSimpleFillType);
        get spriteSimpleFillType(): ESpriteSimpleFillType;
        set isTrim(value: boolean);
        get isTrim(): boolean;
        set shrinkOnly(value: boolean);
        get shrinkOnly(): boolean;
        set autoSize(value: boolean);
        get autoSize(): boolean;
        set alignType(value: EAlignType);
        get alignType(): EAlignType;
        set vertAlignType(value: EVertAlignType);
        get vertAlignType(): EVertAlignType;
        private _alignType;
        private _vertAlignType;
        private _spriteSimpleFillType;
        private _shrinkOnly;
        private _bindLoad;
        private _autoSize;
        private _isTrim;
        private _mat;
        private _spriteFrame;
        private _spriteColor;
        spriteFrameUrl: string;
        orginSpriteFrameUrl: string;
        /**图片是否加载成功 */
        isLoadSpriteFrame: boolean;
        private loadSpriteFrames;
        private _listByMark;
        private _listByMarkUrl;
        private _loadSf;
        private _sp;
        protected onEditorUpdateData(): void;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        onDestroy(): void;
        /**显示后加载图片 */
        listByMark(visible: boolean): void;
        private onDelayListByMarkSetSprite;
        /**加载默认的图片 */
        loadDefaultSpriteFrame(cb?: () => void): void;
        setSpriteFrameUrl(url: string, update?: boolean, cb?: () => void, cb2?: () => void): void;
        setSpriteFrame(sf: _cc_.SpriteFrame): void;
        private updateBindLoad;
        getSprite(): _cc_.Sprite;
        protected onSizeChange(): void;
        updateLayout(): void;
    }
}
 namespace apeng {
    /**
     * 子域组件
     * 解决自带的分组bug
     */
    class SubContextViewCC extends SubContextView {
        onLoad(): void;
        onEnable(): void;
        /**重写父类 以节点设置画布大小 */
        private _initSharedCanvas;
    }
}
 namespace apeng {
    class SwitchChildrenCC extends BaseComponent {
        readonly EventType: {
            CHANGE: string;
        };
        backupDescribe: string;
        noIndex: boolean;
        set index(vlaue: number);
        get index(): number;
        private _index;
        protected onEditorUpdateData: () => void;
        onEnable(): void;
        setIndex(index: number): void;
        updateView(): void;
        getIndexNode(): _cc_.Node;
    }
}
 namespace apeng {
    class SwitchSpriteCC extends BaseComponent {
        backupDescribe: string;
        sp: _cc_.Sprite;
        sfs: _cc_.SpriteFrame[];
        set index(vlaue: number);
        get index(): number;
        private _index;
        protected onEditorUpdateData: () => void;
        onLoad(): void;
        onEnable(): void;
        setIndex(index: number): void;
        private updateSp;
    }
}
 namespace apeng {
    class SyncPositionTargetCC extends BaseComponent {
        backupDescribe: string;
        target: _cc_.Node;
        isWorldPos: boolean;
        lerpRatio: number;
        isOffset: boolean;
        offsetPosition: _cc_.math.Vec3;
        private get curPos();
        private get targetPos();
        onLoad(): void;
        onUpdate(): void;
    }
}
 namespace apeng {
    abstract class BaseEntity extends BaseComponent {
        backupDescribe: string;
        CLOSE_ON_CC: boolean;
        abstract entityType: number;
        /**是否回收 */
        abstract isPut: boolean;
        /**是否执行状态机的update */
        abstract isUpdateStateMackine: boolean | (() => boolean);
        /**是否销毁 */
        abstract isDestroy: boolean;
        /**是移动的 */
        abstract isMoving(): boolean;
        /**添加在头部 最先更新update */
        updateStateMachineHead: boolean;
        /**放到数组最后 所有更新完了后 */
        lateUpdateState: boolean;
        /**优先加载资源 */
        isPreLoadResouces: boolean;
        isLoadResouces: boolean;
        /**第一次加载 */
        isLoadResoucesOnce: boolean;
        /**第二个形状点击 */
        getCollider2DEditorCC2?(): Collider2DEditorCC;
        entityMgr: BaseEntityMgr<BaseScene, BaseEntity>;
        private orginCreatePrefabDelayPositon;
        /**加载的路径方便回收 */
        url: string;
        /**创建时的唯一id */
        entityID: number;
        /**自身生命周期 */
        entityStateMackine: StateMackine<EEntityState>;
        protected onStateEnterLoad(): void;
        protected onStateEnterRun(): void;
        protected onStateUpdateRun(): void;
        protected onStateEnterReset(): void;
        protected onStateUpdateReset(): void;
        protected onStateEnterOver(isWin: boolean): void;
        protected onStateUpdateOver(): void;
        protected onStateEnterExit(): void;
        loadResouces(cb: () => void): void;
        protected loadResoucesByComp(url: string, complete: () => void): any;
        protected setSpriteLoaderCCUrl(url: string, complete: () => void): void;
        protected getResoucesUrl(): string;
        protected getDelayVisibleNode(): _cc_.Node;
        protected getCreatePrefabToEditorOnceCC(): CreatePrefabToEditorOnceCC;
        /** 进入资源加载 */
        onLoadResouces?(): void;
        /**加载完成 */
        onLoadResoucesComplete?(): void;
        /**加载完后 同时加载其他资源 */
        loadOtherResouces?(): TResoucesUrl<_cc_.Asset>[];
        /**预加载bundle */
        preLoadBundles?(): string[];
        onShapeClick?(): void;
        onShapeClick2?(): void;
    }
}
 namespace apeng {
    /**战斗实体管理 */
    abstract class BaseEntityMgr<T extends BaseScene, E extends BaseEntity> {
        CLEAR_EXIT: string;
        /**异步加载资源顺序 */
        protected abstract getQueueResoucesPriority(): number[];
        readonly pool: Pool<string, _cc_.Node>;
        /**所有entity集合 */
        entites: Maps<number, E>;
        /**需要刷新状态机的集合 */
        entitesUpdateState: E[];
        entitesLateUpdateState: E[];
        /**通过 type 分类的entity */
        entitesType: Maps<number, Maps<number, E>>;
        /**下发给entity的id */
        entityID: number;
        scene: T;
        private queueResoucseLoad;
        constructor(scene: T);
        /**异步加载资源 */
        loadQueueResouces<T extends BaseEntity>(loadResouces?: (entity: T) => void): void;
        updateStateMachine(): void;
        private add;
        remove<T extends E>(entity: T): void;
        changeState(state: EEntityState): void;
        clear(clearPool: boolean): void;
        create<T extends E>(url: string | _cc_.Node, addEntity?: boolean): T;
        /**
         * 执行component生命周期方法
         * @param entity
         */
        runLife(entity: BaseEntity): void;
        /**异步资源加载完成 */
        protected onLoadQueueResoucesComplete?(): void;
    }
}
 namespace apeng {
    enum EEntityState {
        /**无效状态 */
        None = 0,
        /**加载 实例化数据 */
        Load = 1,
        /**进入战斗前 重置数据 */
        Reset = 2,
        /**进行中 驱动entity状态机 */
        Run = 3,
        /**结束 */
        Over = 4,
        /**退出战斗 清理资源 */
        Exit = 5
    }
}
 namespace apeng {
    class AStarCell {
        /**曼哈顿算法 */
        static manhattan(x: number, y: number, otherX: number, otherY: number): number;
        x: number;
        y: number;
        /**从起点到指定格子耗费 */
        g: number;
        /**从当前到终点耗费 */
        h: number;
        /**g+h */
        f: number;
        /**回遡 寻找路径 */
        parent: AStarCell;
        /**待检测 */
        isOpen: boolean;
        /**已检测 */
        isClose: boolean;
        /**走斜线 */
        isSlash: boolean;
        /**可行走 */
        isFind: boolean;
        constructor(x: number, y: number);
        clear(): void;
        disponse(): void;
    }
    class AStarHelper {
        cells: AStarCell[][];
        xMax: number;
        yMax: number;
        /**走斜线 */
        isSlash: boolean;
        startCell: AStarCell;
        endCell: AStarCell;
        private _finds;
        private findRes;
        init(xMax: number, yMax: number, isSlash: boolean): void;
        /**查找可行走路径，(不包含 终点 起点) */
        run(): AStarCell[];
        private findByCell;
        dispose(): void;
        /**根据一维索引获取格子 */
        getIndexByCell(index: number): AStarCell;
        /**通过格子转换为一维索引 */
        getCellByIndex(cell: AStarCell): number;
    }
}
 namespace apeng {
    /**
     * 自动注册事件
     * 自动赋值成员变量
     */
    class AutoMemberNodeAttribute {
        static isLog: boolean;
        /**自动注册 btn事件的 成员函数 前缀 */
        static registClickEventPrefix: string;
        /**自动找到子节点对应的 成员变量 的前缀 */
        static memberByNodeNamePrefix: string;
        static clearMember(caller: any): void;
        /**
         * andorid for in 循环不到函数 只能遍历全部节点
         *
         * 注册 caller点击事件 caller成员变量
         *
         * caller.onClick{node.name}
         * 注册点击事件 onClick事件前缀， node.name 节点名 ButtonCC可忽略
         *
         * caller.c{node.name} = null
         * 赋值成员变量，c子节点前缀 node.name节点名
         * 如节点名内含有@ccclass("name") 则获取组件返回
         *
         * @param parent
         * @param caller
         */
        static init(parent: _cc_.Node, caller: any): void;
    }
}
 namespace apeng {
    interface IConfigBase {
        /**当前的ID */
        id: number;
        /**配置表名称 */
        configName: string;
    }
    interface IConfigLanguage extends IConfigBase {
        chinese: string;
        traditional: string;
        english: string;
    }
    /**一个物体的基本属性 */
    interface IConfigItemBase extends IConfigBase {
        /**图标路径 */
        icon_url: string;
        /**名字 */
        id_name: number;
        /**描述 */
        id_describe: number;
    }
    interface IConfigPlatform extends IConfigBase {
        banner: string;
        interstitial: string[];
        nativeTemp: string;
        rewardedVideo: string;
        nativeTempRoot: string;
        appid: string;
        /**每天第一次播放使用 */
        rewardedVideoOnce: string;
        bannerUpdate: string;
        blockOnce: string;
        blockOnceUpdate: string;
    }
    interface IConfigCountBase {
        /**默认数量 */
        default_count: number;
        /**最大数量 -1 无限制 */
        max_count: number;
    }
    /**基础皮肤配置 */
    interface IConfigSkinBase extends IConfigItemBase, ISkinHelperItem {
        /**预制体路径 */
        prefab_url: string;
        /**购买需要金币 */
        buy_gold: number;
    }
    interface IConfigProp extends IConfigItemBase, IConfigCountBase {
        /**自动恢复间隔时间 */
        auto_resume: [
        /**自动恢复间隔时间 分 -1不开启 */
        number, 
        /**自动恢复间隔增加数量 */
        number, 
        /**自动恢复 离线恢复  0不启动*/
        number];
        /**获得道具时ui界面icon路径 */
        add_other_icon_url: string;
        /**1在背包展示 */
        is_package_show: number;
        /**是否播放飞行特效 */
        is_fly: number;
        /**第二天是否恢复上限 */
        is_refull: number;
        /**一天最多使用次数 */
        today_max: number;
        /**看完视频 添加道具个数 */
        video_add_count: number;
        /**看完视频 1直接使用 */
        is_video_add_use: 1 | 0;
        /**获取弹窗图片路径（title；tip；icon） */
        ui_img_url: string[];
    }
    interface IConfigDefineBase {
        /**主配置表 */
        main: any;
        /**平台配置表 */
        platform: IConfigPlatform;
        /**语言表 */
        language: IConfigLanguage;
        /**道具表 */
        prop: IConfigProp;
        /**省份表 */
        province_item: IConfigProvinceItem;
    }
    /**省份表 */
    interface IConfigProvinceItem extends IConfigItemBase {
        /**假数据最小 */
        fakemin: number;
        /**假数据最大 */
        fakemax: number;
    }
    /**城市表 */
    interface IConfigCountryItem extends IConfigItemBase {
    }
    class ConfigHelper<T extends IConfigDefineBase> {
        /**数组形式的配置数据 */
        readonly arr: {
            [Key in keyof T]: T[Key][];
        };
        /**对象形式的配置数据 */
        readonly obj: {
            [Key in keyof T]: {
                [id: number]: T[Key];
            };
        };
        constructor(configs: Object, define: Object);
        private deParse;
    }
}
 namespace apeng {
    class DataLogicHelper<T> extends EventDispatcher {
        private poolCreate;
        private poolClear;
        readonly EventType: {
            /**删除 index */
            REMOVE: string;
            RESET: string;
        };
        readonly pool: PoolOnce<T>;
        datas: T[];
        constructor(poolCreate: () => T, poolClear: (data: T) => void);
        create(): T;
        count(): number;
        hasZero(): boolean;
        reset(): void;
        remove(index: number): void;
    }
}
 namespace apeng {
    /**编辑器环境解析数据永久储存 */
    class EditorParseDataCC<T> {
        data: string;
        info: string;
        set(data: T): void;
        get(): T;
    }
}
 namespace apeng {
    /**间隔时间 */
    class IntervalTimeHelper {
        /**方便使用模块缓存 */
        private readonly storage;
        /**缓存时的前缀 */
        private readonly cachePrefix;
        /**间隔时间 */
        interval: number;
        /**使用函数时间戳 秒 */
        cacheTimeFn?: () => number;
        /**减少 剩余的时间 */
        onSub?: () => number;
        private static _instance;
        static instance(interval: number, cacheTime: number): IntervalTimeHelper;
        /**缓存时的时间戳 */
        get cacheTime(): number;
        /**获取剩余间隔的时间 */
        get sub(): number;
        /**不限制 */
        get subMax(): number;
        /**获取已经过的时间 进度，1为可领取 最大为0～1 */
        get ratio(): number;
        /**获取已经过了的时间，可超过1 */
        get ratioMax(): number;
        constructor(
        /**方便使用模块缓存 */
        storage: IInstanceStorage, 
        /**缓存时的前缀 */
        cachePrefix: string, 
        /**间隔时间 */
        interval: number, 
        /**使用函数时间戳 秒 */
        cacheTimeFn?: () => number, 
        /**减少 剩余的时间 */
        onSub?: () => number);
        /**根据时间获取倍率 */
        getMul(allTime: number, interval?: number): number;
        /**设置间隔时间 */
        setCache(): void;
        /**获取离线时 的倍率 */
        getOfflineMul(add?: number, interval?: number): number;
        disponse(): void;
    }
}
 namespace apeng {
    /**关卡管理 */
    class LevelHelper<T, S> extends EventDispatcher {
        /**方便使用模块缓存 */
        private readonly storage;
        /**使用测试读取关卡 */
        test: number;
        /**缓存的前缀 */
        cacheKey: string;
        /**已配置的最大关卡 */
        max: number;
        /**可超出最大关卡 */
        toMax: boolean;
        /**超过配置关卡后 随机之前的关卡，需要排除的关卡 */
        exclude: number[];
        defautCacheData: S;
        _parseDataCb: (level: number) => T;
        static readonly EventType: {
            /**调用 setCache时 */
            CACHE_CHANGE: string;
            ADD: string;
            CHNAGE: string;
        };
        private _parseData;
        /**获取当前关 */
        get cur(): number;
        /**当前已转换的关卡 */
        get curConverLevel(): number;
        /**当前关卡数据 */
        get curData(): T;
        /**当前关卡的缓存数据 */
        get curCache(): S;
        constructor(
        /**方便使用模块缓存 */
        storage: IInstanceStorage, 
        /**使用测试读取关卡 */
        test: number, 
        /**缓存的前缀 */
        cacheKey: string, 
        /**已配置的最大关卡 */
        max: number, 
        /**可超出最大关卡 */
        toMax: boolean, 
        /**超过配置关卡后 随机之前的关卡，需要排除的关卡 */
        exclude: number[], defautCacheData: S, _parseDataCb?: (level: number) => T);
        /**设置当前关卡的缓存数据 */
        setCurCache(data: S): void;
        /**获取关卡对应数据块 */
        getData(level: number): T;
        /**设置关卡缓存数据 */
        setCache(level: number, data: S): void;
        /**
         * 获取全部缓存数据
         * @param cb
         */
        getAllCache<T2>(cb: (cache: S) => T2): T2[];
        /**获取关卡缓存数据 */
        getCache(level: number): S;
        add(): boolean;
        set(level: number): void;
        /**
         * 经过转换后 读取文件的level
         * @param level
         * @returns
         */
        getConverLevel(level: number): number;
    }
}
 namespace apeng {
    type TNode = Node;
    class NodeHelper {
        static UICamera: _cc_.Camera;
        static setHideFlags(node: _cc_.CCObject, ...flags: _cc_.CCObject.Flags[]): void;
        /**
         * 获取一个子节点
         * @param parent
         * @param nodeName
         * @param createCb
         * @param addChildIndex 默认添加到最后
         * @returns
         */
        static getChildByCreate(parent: _cc_.Node, nodeName: string, createCb?: (node: _cc_.Node) => void, addChildIndex?: number, editorShow?: boolean, addChildComplete?: (node: _cc_.Node) => void): _cc_.Node;
        /**
         * 指定level插入到parent中
         * 如果找到了 则返回当前节点
         * 如果没用 则创建一个
         * @param parent
         * @param level
         * @returns 当前等级得节点
         */
        static insertChild(parent: _cc_.Node, level: number): _cc_.Node;
        static setSize(node: _cc_.Node, width?: number | _cc_.Size, height?: number): void;
        static getUITransform(node: _cc_.Node): _cc_.UITransform;
        static getUIRenderer(node: _cc_.Node): _cc_.UIRenderer;
        /**
         * 朝目标方向移动
         * @param node
         * @param dir
         * @param speed
         * @param isWorld
         * @returns
         */
        static move(node: _cc_.Node, dir: IVector3, speed: number, isWorld: boolean): _cc_.Vec3;
        /**
        * 获取节点上可操作的逻辑脚本
        * @param node
        * @returns
        */
        static getNodeComponents<T extends _cc_.Component>(node: _cc_.Node, comps: {
            new (): T;
        }[]): T[];
        /**递归父节点存在的组件 */
        static getParentByComponent<T extends _cc_.Component>(parent: _cc_.Node, comp: {
            new (): T;
        } | string): T;
        static gray(parent: _cc_.Node, isGray: boolean): void;
        /**递归父节点相等的name */
        static getParentByName(node: _cc_.Node, parentName: string): _cc_.Node;
        /**递归父节点相等的name的子节点 */
        static getParentByNameChild(node: _cc_.Node, parentName: string): _cc_.Node;
        static getChildrenByComponent<T extends _cc_.Component>(node: _cc_.Node, comp: {
            new (): T;
        } | string): T;
        /**获取当前或所有子节点第一个匹配的组件 */
        static getAllByComponent<T extends _cc_.Component>(node: _cc_.Node, comp: {
            new (): T;
        } | string): T;
        static getChildrenByComponents<T extends _cc_.Component>(node: _cc_.Node, comp: {
            new (): T;
        } | string, cb?: (comp: T, index: number) => void, out?: T[]): T[];
        /**
         * 看向目标点
         * @param node
         * @param target
         * @param rotate 角度制
         */
        static lookAt(node: _cc_.Node, target: IVector3, rotate?: number, defaultRotate?: number): void;
        /**
         * 返回值越小越前 越大越在上层
         * @param nodes
         * @param fn
         */
        static zIndexSort(nodes: readonly _cc_.Node[], fn: (node: _cc_.Node, index: number) => number): void;
        /**
         * 当前节点朝着目标点移动
         * @param node 移动节点
         * @param target 目标位置
         * @param speed 移动速度
         * @param rotate 看向目标点(角度制)
         * @return {boolean} 到达目标点
         */
        static followTarget(node: _cc_.Node, target: IVector3, speed: number | IVector3, rotate?: number, isWorld?: boolean, defaultRotate?: number): boolean;
        /**
         * 插值到目标点
         * @param node
         * @param target
         * @param ratio 插值比率 0~1
         * @param rotate 看向目标点(弧度制)
         * @returns 到达目标点
         */
        static lerpTarget(node: _cc_.Node, target: IVector3, ratio: number | IVector3, rotate?: number, isWorld?: boolean, defaultRotate?: number, min?: number): boolean;
        /**触点坐标转换为游戏视图坐标 */
        static converScreenToWorld<T extends IVector3>(out: T, position: IVector3, camear?: _cc_.Camera): T;
        /**游戏坐标转换为触点坐标 */
        static converSceneToUI<T extends IVector3>(out: T, worldPosition: IVector3, sceneCamear: _cc_.Camera): T;
        /**
       * 插值到目标点
       * @param node
       * @param target
       * @param ratio 插值比率 0~1
       * @param rotate 看向目标点(弧度制)
       * @returns 到达目标点
       */
        static lerpScaleTarget(node: _cc_.Node, target: number | IVector3, ratio: number | IVector3, isWorld?: boolean): boolean;
        static lerpRotateTarget(node: _cc_.Node, target: number | IVector3, ratio: number | IVector3, isWorld?: boolean): boolean;
        static lerpQuatTarget(node: _cc_.Node, target: _cc_.Quat, ratio: number): boolean;
        /**
         * 遍历所有子节点
         * 默认广度便利 方便查找浅层节点
         * @param parent
         * @param cb true时 终止循环
         * @param deep true深度便利 false广度便利
         * @returns true 终止循环，
         */
        static walkAllChild(parent: _cc_.Node, cb: (node: _cc_.Node) => (boolean | void), deep?: boolean): void;
        /**
         * 深度遍历子节点
         * @param parent
         * @param cb
         * @returns 1不遍历子节点 2终止循环
         */
        static walkAllDeepChild(parent: _cc_.Node, cb: (node: _cc_.Node) => (number | void)): void;
        static setRotate(node: _cc_.Node, value: IVector3, isWorld: boolean): void;
        static setRotateX(node: _cc_.Node, x: number, isWorld: boolean): void;
        static setRotateY(node: _cc_.Node, y: number, isWorld: boolean): void;
        static setRotateZ(node: _cc_.Node, z: number, isWorld: boolean): void;
        static rotateX(node: _cc_.Node, angle: number, isWorld: boolean): void;
        static rotateY(node: _cc_.Node, angle: number, isWorld: boolean): void;
        static rotateZ(node: _cc_.Node, angle: number, isWorld: boolean): void;
        static setScale(node: _cc_.Node, value: IVector2, isWorld: boolean): void;
        static setScaleNum(node: _cc_.Node, num: number, isWorld: boolean): void;
        static getRotate(node: _cc_.Node, isWorld: boolean): _cc_.Quat;
        private static _getRotateV3;
        static getRotateV3(node: _cc_.Node, isWorld: boolean): _cc_.Vec3;
        static getRotateZ(node: _cc_.Node): number;
        static getScale(node: _cc_.Node, isWorld: boolean): IVector3;
        static setScaleX(node: _cc_.Node, x: number, isWorld: boolean): void;
        static setScaleY(node: _cc_.Node, y: number, isWorld: boolean): void;
        static setScaleZ(node: _cc_.Node, z: number, isWorld: boolean): void;
        static setPositionX(node: _cc_.Node, x: number, isWorld: boolean): void;
        static setPositionY(node: _cc_.Node, y: number, isWorld: boolean): void;
        static setPositionZ(node: _cc_.Node, z: number, isWorld: boolean): void;
        static setPositionXY(node: _cc_.Node, value: TVectorSet, isWorld: boolean): void;
        static setPosition(node: _cc_.Node, value: IVector3, isWorld: boolean, offsetX?: number, offsetY?: number, offsetZ?: number): void;
        /**
         *
         * @param node
         * @param opacity  0~1
         */
        static setOpacity(node: _cc_.Node, opacity: number): void;
        static getOpacity(node: _cc_.Node): number;
        private static _getPosition;
        static getPosition(node: _cc_.Node, isWorld: boolean, offsetX?: number, offsetY?: number, offsetZ?: number): IVector3;
        static distance(node1: _cc_.Node, node2: _cc_.Node, type?: "xyz" | "xy" | "x" | "y" | "z"): number;
        static convertToWorldSpaceAR(out: _cc_.Vec3, node: _cc_.Node, point: _cc_.Vec3): _cc_.math.Vec3;
        static convertToNodeSpaceAR(out: _cc_.Vec3, node: _cc_.Node, point: IVector2): _cc_.math.Vec3;
        /**
         * 将 self下的坐标转化为 other下的坐标
         * @param self
         * @param other
         * @param point
         * @returns
         */
        static convertSelfToOtherNodeSpaceAR(out: _cc_.Vec3, self: _cc_.Node, other: _cc_.Node, point: _cc_.Vec3): IVector3;
        static isHit(node: _cc_.Node, point: IVector2): boolean;
        static getRectangle<T extends IRectangle>(out: T, node: _cc_.Node, isWorld: boolean, ignoreSclae?: boolean): T;
        static getYMin(node: _cc_.Node, isWorld: boolean, ignoreSclae?: boolean): number;
        static getYMax(node: _cc_.Node, isWorld: boolean, ignoreSclae?: boolean): number;
        static getXMax(node: _cc_.Node, isWorld: boolean, ignoreSclae?: boolean): number;
        static getXMin(node: _cc_.Node, isWorld: boolean, ignoreSclae?: boolean): number;
        /**
          * 找到子节点第一个匹配的 name
          * @param node
          * @param name
          */
        static findChildrenByNameOnce(parent: _cc_.Node, childrenName: string): _cc_.Node;
        /**
        * 找到子节点第一个前缀匹配的
        * @param node
        * @param name
        */
        static findChildrenByPrefixNameOnce(parent: _cc_.Node, prefixName: string): _cc_.Node;
        /**
         * 获取所有子节点 前缀匹配的所有节点
         * @param node
         */
        static findChildrenByNamePrefixs(parent: _cc_.Node, prefixName: string, cb?: (value: _cc_.Node) => void): _cc_.Node[];
        /**
         * 将3D节点转换到ui节点下
         * 返回远近比和ui坐标
         * @param out
         * @param uiParent
         * @param converNode
         * @param camera
         * @param distance 距相机多少距离为正常显示计算大小
         * @param useScale 是否是缩放映射
         * @returns
         */
        static coordinateTracker(out: {
            /**转换后的ui坐标 */
            converPosition: _cc_.Vec3;
            /**远近比率 */
            scale: number;
        }, uiParent: _cc_.Node, converNode: _cc_.Node, camera: _cc_.Camera, distance: number, useScale: boolean): {
            /**转换后的ui坐标 */
            converPosition: _cc_.Vec3;
            /**远近比率 */
            scale: number;
        };
        /**
     * 保存截图到本地 返回地址
     * @param node
     */
        static getSaveImageUrl(node: _cc_.Node): Promise<string>;
    }
}
 namespace apeng {
    /**
     * 道具管理
     */
    class PropHelper extends EventDispatcher {
        /**方便使用模块缓存 */
        private readonly storage;
        /**配置表名字 */
        readonly configName: string;
        readonly id: number;
        /**初始数量 */
        defaultCount: number;
        /**最大数量 */
        _maxCount: number;
        /**当前数量可超出最大数量 */
        toMax: boolean;
        /**缓存前缀 */
        cachePrefix: string;
        static readonly EventType: {
            /** id 数量改变时 当前；上一次 */
            CHANGE: string;
            /**第一次调用add接口 */
            ADD_ONCE: string;
            /**添加数量时 count isAutoResume */
            ADD: string;
        };
        intervalTime: IntervalTimeHelper;
        autoResumeCount: number;
        isAutoResumeOffline: boolean;
        /**是否调用过add接口 */
        get isAdd(): boolean;
        /**当前数量 */
        get cur(): number;
        /**最大数量 */
        get maxCount(): number;
        /**变换添加时数量 */
        addCountConver: (count: number) => number;
        /**变换减少时数量 */
        subCountConver: (count: number) => number;
        /**变换最大值 */
        maxCountConver: (count: number) => number;
        constructor(
        /**方便使用模块缓存 */
        storage: IInstanceStorage, 
        /**配置表名字 */
        configName: string, id: number, 
        /**初始数量 */
        defaultCount: number, 
        /**最大数量 */
        _maxCount: number, 
        /**当前数量可超出最大数量 */
        toMax?: boolean, 
        /**缓存前缀 */
        cachePrefix?: string);
        /**
         * 添加数量
         * @param count
         */
        add(count: number, isAutoResume?: boolean): void;
        /**减少数量 */
        sub(count: number): void;
        /**
         * 设置当前数量
         * @param count
         */
        set(count: number, emit?: boolean): void;
        has(count: number): boolean;
        /**开启自动恢复 */
        openAutoResume(): void;
        /**开启自动恢复 */
        initAutoResume(interval: number, count: number, offline: boolean): void;
        /**自动恢复 */
        private onLoopAutoResume;
        /**离线计算收益 */
        autoResumeByOffline(interval?: number, count?: number): void;
        private getCacheKey;
        dispose(): void;
    }
}
 namespace apeng {
    /**
 * 多道具管理
 */
    class PropsHelper {
        /**方便使用模块缓存 */
        private readonly storage;
        /**配置表名字 */
        readonly configName: string;
        private readonly addOnce;
        readonly configDatas: {
            [id: number]: any;
        };
        /**初始数量 */
        readonly defaultCount: (id: number) => number;
        /**最大数量 */
        readonly maxCount: (id: number) => number;
        /**当前数量可超出最大数量 */
        toMax: (id: number) => boolean;
        /**自动恢复 */
        isAutoResume?: (id: number) => boolean;
        autoResumeIntervale?: (id: number) => number;
        /**自动恢复增加数量 */
        autoResumeCount?: (id: number) => number;
        /**离线计算收益 */
        isAutoResumeOffline?: (id: number) => boolean;
        /**监听添加数量时 */
        readonly addCount?: (id: number, count: number, isAutoResume: boolean, isNew: boolean) => void;
        /**监听数量改变时 */
        readonly changeCount?: (id: number, count: number) => void;
        readonly cachePrefix: string;
        _updateCount: () => void;
        readonly datas: Maps<number, PropHelper>;
        constructor(
        /**方便使用模块缓存 */
        storage: IInstanceStorage, 
        /**配置表名字 */
        configName: string, addOnce: (id: number) => void, configDatas: {
            [id: number]: any;
        }, 
        /**初始数量 */
        defaultCount: (id: number) => number, 
        /**最大数量 */
        maxCount: (id: number) => number, 
        /**当前数量可超出最大数量 */
        toMax: (id: number) => boolean, 
        /**自动恢复 */
        isAutoResume?: (id: number) => boolean, autoResumeIntervale?: (id: number) => number, 
        /**自动恢复增加数量 */
        autoResumeCount?: (id: number) => number, 
        /**离线计算收益 */
        isAutoResumeOffline?: (id: number) => boolean, 
        /**监听添加数量时 */
        addCount?: (id: number, count: number, isAutoResume: boolean, isNew: boolean) => void, 
        /**监听数量改变时 */
        changeCount?: (id: number, count: number) => void, cachePrefix?: string, _updateCount?: () => void);
        /**获取已有的所有道具ID */
        getAll(exclude?: number[]): number[];
        /**获取已调用过 add 接口的 */
        getAdds(): number[];
        updateCount(): void;
        /**获取当前数据 */
        get(id: number): PropHelper;
    }
}
 namespace apeng {
    interface ISkinHelperItem {
        /**解锁类型 */
        unlock_type: number;
        /**1可以使用 */
        is_use: 1 | 0;
        /**1默认解锁 */
        is_unlock: 1 | 0;
    }
    /**
     * 皮肤管理
     */
    class SkinHelper extends EventDispatcher {
        /**方便使用模块缓存 */
        private readonly storage;
        /**配置表的名称 */
        readonly configName: string;
        /**默认解锁的ID */
        readonly defaultID: number;
        static readonly EventType: {
            /** id */
            CHANGE_AFTER: string;
            /** id */
            CHANGE: string;
            /** id */
            UNLOCK: string;
        };
        private configDatas;
        private _defaultUnlocks;
        /**当前皮肤ID */
        get cur(): number;
        /**上次使用的ID */
        get lastCur(): number;
        /**已解锁的 */
        get unlocks(): number[];
        /**未解锁的皮肤 */
        get noUnlocks(): number[];
        constructor(
        /**方便使用模块缓存 */
        storage: IInstanceStorage, 
        /**配置表的名称 */
        configName: string, 
        /**默认解锁的ID */
        defaultID: number);
        private getCacheKey;
        /**是否已解锁 */
        has(id: number): boolean;
        /**解锁皮肤 */
        unlock(id: number): void;
        /**
         * 使用皮肤
         * @param id
         * @param isTip
         * @returns
        */
        use(id: number): void;
        /**获取当前类型 中 未解锁的ID */
        getUnlockTypeByNoIDs(type: number): number[];
        /**是否可以使用 反之则未开放状态 */
        hasIDUse(id: number): boolean;
        /**默认解锁的 */
        getDefaultUnlocks(): number[];
    }
}
 namespace apeng {
    abstract class BaseHollow {
        /**获取形状中心点 */
        abstract getShapeCenter(): IVector2;
        /**按下点与形状相交 */
        abstract intersection(touchPosition: IVector2): boolean;
        protected abstract onScaleing(scale: number): void;
        /**点击镂空区域时 */
        private clickShape;
        /**分发事件流node */
        protected eventNode: _cc_.Node | (() => _cc_.Node);
        /**延迟绘制 */
        delay: number;
        fingerNode: _cc_.Node;
        protected itemParent: _cc_.Node;
        protected graphics: _cc_.Graphics;
        protected outlineGraphics: _cc_.Graphics;
        /**显示手指动画 */
        isFingerAnim: boolean;
        /**播放镂空的缩放动画 */
        protected isScaleAnim: boolean;
        /**绘制 */
        isDraw: boolean;
        private scaleMax;
        private scaleDuration;
        private scaleEase;
        /**手指相对于形状中心点的偏移 */
        fingerOffsetPoint: IVector2;
        fingerAngle: number;
        /**脏标记 */
        dirty: boolean;
        private _curScale;
        init(itemParent: _cc_.Node, graphics: _cc_.Graphics, outline?: _cc_.Graphics): this;
        setDelay(delay: number): this;
        setIsDraw(isDraw: boolean): this;
        setFinger(offset: TVectorSet, angle?: number): this;
        setAnim(duration: number, scaleMax?: number, ease?: EEaseType): this;
        setClick(cb?: (e: _cc_.EventTouch) => void, node?: _cc_.Node | (() => _cc_.Node)): this;
        onClick(e: _cc_.EventTouch): void;
        updateFingerPosition(): void;
        onUpdate2(): void;
        private _onScaleStart;
        private _onScaleEnd;
        protected onCreate?(): void;
        /**由ui跑的 update */
        onUpdate?(): void;
        /**缩放动画开始时 */
        protected onScaleStart?(): void;
        /**缩放动画结束时 */
        protected onScaleEnd?(): void;
        /**绘制形状 */
        draw?(): void;
    }
}
 namespace apeng {
    class CircleHollow extends BaseHollow {
        _circle: Circle | (() => Circle);
        circleHeight: number;
        circle: Circle;
        copyCircle: Circle;
        constructor(_circle: Circle | (() => Circle), circleHeight?: number);
        protected onCreate(): void;
        protected onScaleing(scale: number): void;
        draw(): void;
        getShapeCenter(): IVector2;
        intersection(touchPosition: IVector2): boolean;
    }
}
 namespace apeng {
    /**节点镂空 拷贝节点到遮罩之上 */
    class NodeHollow extends BaseHollow {
        private _node;
        syncPosition: boolean;
        createCopyNode?: (node: _cc_.Node) => void;
        private node;
        private copyNode;
        rect: Rectangle;
        /**
         *
         * @param node 复制的节点
         * @param syncPosition 实时同步世界坐标
         */
        constructor(_node: _cc_.Node | (() => _cc_.Node), syncPosition?: boolean, createCopyNode?: (node: _cc_.Node) => void);
        onCreate(): void;
        protected onScaleing(scale: number): void;
        onUpdate(): void;
        getShapeCenter(): IVector2;
        intersection(touchPosition: IVector2): boolean;
    }
}
 namespace apeng {
    class PolygonHollow extends BaseHollow {
        _polygon: IVector2[] | (() => IVector2[]);
        polygon: IVector2[];
        private copyPolygon;
        private centerPolygon;
        constructor(_polygon: IVector2[] | (() => IVector2[]));
        onCreate(): void;
        protected onScaleStart(): void;
        protected onScaleEnd(): void;
        protected onScaleing(scale: number): void;
        draw(): void;
        getShapeCenter(): IVector2;
        intersection(touchPosition: IVector2): boolean;
    }
}
 namespace apeng {
    class RectHollow extends BaseHollow {
        _rect: Rectangle | (() => Rectangle);
        rectRadius: number;
        rect: Rectangle;
        copyRect: Rectangle;
        constructor(_rect: Rectangle | (() => Rectangle), rectRadius?: number);
        protected onCreate(): void;
        protected onScaleing(scale: number): void;
        draw(): void;
        getShapeCenter(): IVector2;
        intersection(touchPosition: IVector2): boolean;
    }
}
 namespace apeng {
    class AudioModule extends BaseModule {
        /**音频资源池 */
        datas: Map<string, IAudioData>;
        curMusicUrl: string;
        onLogic(): void;
        /**设置全部音量 控制开关 */
        setVolume(music: boolean, ratio: number): void;
        getVolume(music: boolean): number;
        setDefalutVolume(url: string, ratio: number): void;
        setStartTime(url: string, time: number): void;
        /**设置音量缩放 */
        setScaleVolume(url: string, ratio: number): void;
        /**当前的真正音量大小 */
        private getCurVolume;
        /**播放音频，默认停止上一个 如需不停止 使用 this.playMore接口 */
        play(url: string, loop?: boolean, music?: boolean, reset?: boolean): void;
        /**不停止上一个 需要已加载完毕的 才可播放 */
        playMore(url: string): void;
        private _playSource;
        playMusic(url: string): void;
        checkPlaying(url: string): boolean;
        resumeAll(): void;
        pauseAll(): void;
        resume(url: string): void;
        pause(url: string): void;
        stop(url: string): void;
        /**
         * 加载一个音频
         * @param url
         * @param cb
         */
        load(url: string, delay?: number, cb?: (succes: boolean) => void): void;
        private addAudioSouce;
        private getData;
    }
}
 namespace apeng {
    class GmModule extends BaseModule {
        private datas;
        onLogic(): void;
        addData(data: IGMData): this;
        getDatas(): IGMData[];
        /**执行 dec 的点击 方便命令行调试 */
        click(dec: string, input?: string): void;
    }
}
 namespace apeng {
    class GuideModule extends BaseModuleEvent {
        readonly EventType: {
            /**新手引导完成 */
            NEW_USER_COMPLETE: string;
            /**新手引导 队列 */
            NEW_USER_COMPLETE_QUEUE: string;
            FINGER_CLICK: string;
        };
        private models;
        /**新手引导已完成 */
        get newUserComplete(): boolean;
        /**新手引导当前步骤 */
        get newUserCur(): number;
        /**新手引导的索引 data数组索引*/
        get newUserIndex(): number;
        onCreate(): void;
        trigger(): void;
        /**从后往前获取数组索引 */
        getLastByIndex(type: number, lastIndex: number): number;
        /**添加模块引导 */
        add(type: number, data: IGuideNewUser): this;
        addOnce(data: IGuideNewUser): this;
        getOnceLastByIndex(lastIndex: number): number;
        /**当前步骤完成 */
        complete(): void;
        /**下一模块 */
        next(isOnce?: boolean): void;
        moveFinger(framWorldPosition: IVector2, toWorldPosition: IVector2): void;
        dialogue(data: IGuideDialogueUI): void;
        mask(data: IGuideMaskUI): void;
        finger(finger: IGuideFingerUI): void;
        closeDialogue(): void;
        closeMask(): void;
        closeFinger(): void;
        /**单个ui模块引导 */
        ui<T extends BaseUI>(uiUrl: string, cacheKey: string, cb: (ui: T, complete: () => void) => void, delay?: number): void;
        maskByPolygon(collider: Collider2DEditorCC, conver?: (shape: Collider2DPolygon) => void, worldPosition?: IVector3): PolygonHollow;
        maskByCircle(node: _cc_.Node, conver?: (shape: Circle) => void, closeUI?: boolean): CircleHollow;
        maskByRect(node: _cc_.Node, radius?: number, conver?: (shape: Rectangle) => void, closeUI?: boolean): RectHollow;
    }
}
 namespace apeng {
    class LanguageModule extends BaseModuleEvent {
        readonly EventType: {
            CHANGE: string;
        };
        cur: ELanguageType;
        curStr: string;
        private _datas;
        onCreate(): void;
        onLogic(): void;
        change(type: ELanguageType): void;
        private updateType;
        /**设置当前的语言id */
        setLanguageType(type: ELanguageType): void;
        /**通过lang配置表获取对应的文本 */
        get<T extends string>(id: number): T;
        replace(id: number, str: string): string;
        /**获取语言对应图片的路径 */
        getSpriteFrame(url: string): string;
        /**格式化图片路径 */
        converSpriteFrameUrl(url: string): string;
    }
}
 namespace apeng {
    class LoginModule extends BaseModule {
        /**是新用户 */
        isNewUser: boolean;
        private _requests;
        get registTime(): number;
        get userData(): si.User.SCLogin;
        onInstance(): void;
        onLogic(): void;
        updateInfo(value: TUserInfo): void;
        requestByLogin(path: string, data: si.ParamGame, complete?: (data: si.SCSendDataBase) => void, loading?: boolean): void;
        login(complete?: () => void): void;
        request(path: string, data: si.ParamGame, complete?: (data: si.SCSendDataBase) => void, loading?: boolean): HttpRequest;
    }
}
 namespace apeng {
    class MainModule extends BaseModuleEvent {
        readonly EventType: {
            /**新的一天 */
            NEW_DAY: string;
            /**当日首次上线 不包括第一天*/
            TODAY_ONCE_ONLINE: string;
            SHOW_QUERY: string;
            /**为false 时播放点击特效 worldPosition */
            HAS_PLAY_CLICK_EFFECT: string;
            /**手指按下时 */
            TOUCH_DOWN: string;
            TOUCH_UP: string;
            /**参数 false 播放完成 */
            VIDEO_COMPLETE: string;
        };
        /**循环定时器推送服务器间隔 一般用于存储时间 */
        loopIntervalServer: number;
        /**游戏开始时的时间 秒 */
        startTime: number;
        /**进入游戏时的离线时间 */
        offlineTime: number;
        /**预加载队列 */
        preLoadQueue: Queue;
        /**是当前天 */
        _isToDay: boolean;
        /**上次添加时间 */
        private lastOnlineTimeAdd;
        loadingCompleteColor: _cc_.math.Color;
        /**已在线所有时长 */
        get onlineTime(): number;
        /**今日在线的时长 */
        get onlineTimeToDay(): number;
        /**已离线了多少分钟 */
        get offlineByMinute(): number;
        /**已离线了多少小时 */
        get offlineByHour(): number;
        /**已离线了多少天 */
        get offlineByDay(): number;
        /**是今天注册的玩家 */
        get dayNewUser(): boolean;
        /**已登录了多少天 */
        get allDayCount(): number;
        onCreate(): void;
        onLogic(): void;
        onComplete(): void;
        changeScene(url: string, complete: () => void, delay?: number): void;
        private registTouch;
        private checkLaunch;
        private showVideoQuery;
        showVideo(report: string, complete: () => void, share?: boolean, shareFail?: () => void): void;
        getShareData(): TShare.Param;
        updateNewDay(): void;
        private _updateNewDay;
        changeOtherAccount(): void;
        private updateLogicTime;
        /**是新的一天 获取一次后 就不是新的一天了*/
        getNewDay(key: string): boolean;
        converBillToGold(count: number): number;
        /**获取用不重复的id id 从 1开始 */
        getAddId(key: string): number;
    }
}
 namespace apeng {
    /**平台管理模块 */
    class PlatformModule extends BaseModuleEvent {
        readonly EventType: {
            INIT: string;
            /**从后台进入前台 */
            ON_SHOW: string;
            /**从前台进入后台 */
            ON_HIDE: string;
        };
        openWebSimulationUI: boolean;
        systemInfo: TSystemInfo;
        instance: BasePlatform;
        config: TConfig;
        type: EPlatformType;
        initTime: number;
        isInit: boolean;
        OpenDataContext: TOpenDataContext.I;
        _banner_: BannerPlatformLogic;
        _blockOnce_: BlockOncePlatformLogic;
        _interstitial_: InterstitialPlatformLogic;
        _nativeTemp_: NativeTempPlatformLogic;
        _record_: RecordPlatformLogic;
        _rewardedVideo_: RewardedVideoPlatformLogic;
        _share_: SharePlatformLogic;
        _vibrate_: VibratePlatformLogic;
        get _web(): WebPlatform;
        get _wx(): WxPlatform;
        get _qq(): QQPlatform;
        get _tt(): TTPlatform;
        get _vivo(): VivoPlatform;
        get _oppo(): OppoPlatform;
        get _hbs(): BasePlatform;
        get _xiaomi(): WxPlatform;
        get _overseas_android_xgame(): WxPlatform;
        get _a360(): WxPlatform;
        get _overseas_kwai(): WxPlatform;
        get _overseas_weiyou(): WxPlatform;
        get _ks(): WxPlatform;
        get _ios(): BasePlatform;
        /**网络在线 */
        get isNetWork(): boolean;
        /**是苹果机 */
        get isIOS(): boolean;
        /**是开发者工具 */
        get isIDE(): boolean;
        /**是长屏手机 */
        get isLongScreen(): boolean;
        get isNative(): boolean;
        /**是海外版本 */
        get isOverseas(): boolean;
        onInstance(): void;
        init(complete: () => void): void;
        /**
         * 发送消息到原生平台
         * @param arg1
         * @param arg2
         */
        sendToNative(eventType: ENativeSend, arg1?: string): string;
        private _dayAdCount;
        /**获取每天播放广告的次数 */
        getDayAd(key: string): {
            day: number;
            count: number;
        };
        addDayAdCount(key: string): void;
        /**展示广告 */
        hasOpenAd(): boolean;
        setKeepScreenOn(): void;
        setEnableDebug(enableDebug: boolean): void;
        _bannerOrNativeTempType: EBottomAdType;
        bannerOrNativeTemp(type: EBottomAdType): void;
        private _bannerOrNativeTemp;
        _blockOnceType: EBlockOnceAdType;
        blockOnce(type: EBlockOnceAdType): void;
        private __blockOnce;
        _settingData: any;
        getSetting(cb: (value: any) => void, cache?: boolean): void;
    }
}
 namespace apeng {
    class PrivacyModule extends BaseModule {
        show(openComplete: () => void, complete: () => void): void;
        openDecUI(): void;
        openUserUI(): void;
    }
}
 namespace apeng {
    class PropModule extends BaseModuleEvent {
        readonly numRollAnimParam: any;
        readonly EventType: {
            /**飞行特效完成时 */
            FLY_TIP_COMPLETE: string;
            /**道具数量改变时 configName id count */
            CHANGE: string;
            PROP_CHANGE: string;
            PROP_SUB: string;
        };
        propUseCount: {
            [id: number]: number;
        };
        /**所有单个道具值 */
        singles: PropsHelper;
        /**多道具值 */
        plurals: {
            [configName: string]: PropsHelper;
        };
        /**多皮肤值 */
        skins: {
            [configName: string]: SkinHelper;
        };
        /**道具的世界坐标 做道具飞行 */
        singlesByUIWorldPosition: {
            [configID: number]: IVector3;
        };
        private singlesOpenUIData;
        onCreate(): void;
        onLogic(): void;
        flyTipByProp(config: IConfigProp, startWorldPosition: IVector2, itemCount?: number | (number[])): void;
        /**创建多道具管理 */
        private create;
        setSinglesOpenUI(id: number, fn: () => void): this;
        /**
         * 打开获取道具弹窗
         * @param id
         */
        openGetUI(prop: PropHelper): void;
        /**创建皮肤管理 */
        createSkin<T extends IConfigSkinBase>(storage: IInstanceStorage, configName: string, defaultID: number, addItemRender?: (item: null, config: T) => number | undefined): SkinHelper;
        addPropBuyShare(id: number): void;
        /**可打开的ui */
        hasOpenUI(prop: PropHelper): boolean;
        addProp(id: number): void;
        hasUseProp(id: number): boolean;
        resetProp(): void;
        hasToDayMax(id: number): boolean;
        useProp(id: number): void;
    }
}
 namespace apeng {
    class RankModule extends BaseModuleEvent {
        readonly EventType: {
            CHANGE_PRIOVINCE: string;
            UPDATE_PROVINCE: string;
        };
        provinceConfigs: IConfigProvinceItem[];
        provinceAllData: {
            index: number;
            count: number;
        }[];
        get curProvinceIndex(): number;
        get curFakeData(): {
            [configIndex: number]: number;
        };
        private randomSeed;
        onCreate(): void;
        onLogic(): void;
        getProvineData(): {
            datas: any[];
            selfRank: number;
        };
        private updateFakeData;
        private parseProvinceAll;
        changePriovinceIndex(index: number): void;
    }
}
 namespace apeng {
    class ResoucesModule extends BaseModuleEvent {
        readonly EventType: {
            /**包加载完成 包名 */
            BUNDLE_LOAD_COMPLETE: string;
            /**释放所有包时 */
            RELEASE_ALL: string;
            /** setSpriteFrame 接口的 url加载完毕时 */
            SPRITEFRAME_COMPLETE: string;
        };
        /**加载过的所有资源 */
        loadMap: Map<string, _cc_.Asset>;
        private loadDirUrls;
        private bundles;
        private _rootBundle;
        private sfQueue;
        private sfRunCount;
        onInstance(): void;
        /**
         * 添加常驻包 切换场景不释放
         * @param bundleName
         */
        addRootBundle(...bundleName: string[]): void;
        private _loadPrefab;
        /**加载预制体，调用load */
        loadPrefab(url: string, cb?: (resouces: _cc_.Prefab) => void, progress?: (ratio: number) => void, isCache?: boolean): void;
        private _loadSpriteFrame;
        /**加载图片，调用load */
        loadSpriteFrame(url: string, cb?: (resouces: _cc_.SpriteFrame) => void, progress?: (ratio: number) => void, isCache?: boolean): void;
        /**
         * 加载本地资源 main/prefab/123
         * 暂不支持加载网络资源
         * @param url
         * @param type
         * @param cb
         * @param progress
         * @param isCache
         * @returns
         */
        load<T extends _cc_.Asset>(_url: TResoucesUrl<T>, cb?: (resouces: T) => void, progress?: (ratio: number) => void, isCache?: boolean): void;
        loadBundles(bundleNames: string[], cb: () => void): void;
        /**
         * 加载一个包
         * @param url
         * @param cb
         */
        loadBundle(url: string, cb: (bundle: _cc_.AssetManager.Bundle, path: string) => void, bundleName?: string): void;
        getBundle(bundleName: string): IBundle;
        /**
         * 释放所有包
         * @param exclude 排除
         */
        releaseAllBundle(...exclude: string[]): void;
        /**
         * 获取加载后的回调
         * @param url
         */
        get<T extends _cc_.Asset>(_url: TResoucesUrl<T>, type?: new () => T): T;
        /**
         * 释放资源 不会导致正在使用的出错
         * @param {string} path
         */
        release<T extends _cc_.Asset>(url: string, assetType: new () => T): void;
        /**通过路径获取包名 */
        getUrlByBoundleName(url: string): string;
        /**通过路径获取包下面的路径 */
        getUrlByBoundlePath(url: string): string;
        /**
         * 批量加载资源
         * @param urls
         * @param cb
         * @param onProgress 加载进度 0~1
         * @param isCache
         */
        loadDir(urls: TResoucesUrl<_cc_.Asset>[], cb?: () => void, onProgress?: (ratio: number) => void, isCache?: boolean): void;
        setSfData(interval: number, runCount: number): void;
        /**
          * 设置精灵组件上的异步图片
          * 网络图片
          * @param sprite
          * @param url
          */
        setSpriteFrame(sprite: ISpriteFrameByComponent, url: string, cb?: (sf: _cc_.SpriteFrame) => void, enterLoadQueue?: boolean): Function;
        /**取消正在加载的队列 */
        cancleSpriteFrame(complete: Function): void;
        /**
         * 通过uuid获取文件相对于 asset下的路径
         * 需 bundle提前加载好
         * @param uuid
         * @returns
         */
        getUuidByUrl(uuid: string): string;
        getCacheAllUrls(): string[];
        private defaultSpriteFrameUrl;
        getDefaultSpriteFrame(): _cc_.SpriteFrame;
        loadDefaultSpriteFrame(complete?: () => void): void;
    }
}
 namespace apeng {
    class SceneModule extends BaseModuleEvent {
        readonly EventType: {
            /**场景切换成功时 */
            CHANG_SUCCESS: string;
            /**场景切换开始时 进入 change接口 */
            CHANG_START: string;
        };
        private cur;
        lastUrl: string;
        curUrl: string;
        private preLoadUrls;
        private preLoadBundles;
        private preLoads;
        /**真正场景正在切换中 */
        isChange: boolean;
        /**包含预加载资源的 正在切换中 */
        isProChange: boolean;
        get enterCount(): {
            [sceneUrl: string]: number;
        };
        /**切换场景的总次数 */
        get enterCountAll(): number;
        onInstance(): void;
        getEnterCount(sceneUrl: string): number;
        setEnterCount(sceneUrl: string, count: number): void;
        /**
         * 设置加载场景时
         * 需要预先加载的资源
         * @param sceneUrl
         * @param urls
         */
        setPreLoadUrls(sceneUrl: string, urls: () => TResoucesUrl<_cc_.Asset>[]): this;
        /**
     * 设置加载场景时
     * 需要预先加载的额外包
     * @param sceneUrl
     * @param urls
     */
        setPreLoadBundles(sceneUrl: string, urls: () => string[]): this;
        setPreLoad(url: string, cb: (complete: () => void) => void): this;
        /**
         * 预加载场景
         * @param sceneUrl 场景路径
         * @param cb
         * @param progress
         * @param openLoadingUI
         */
        preLoad(sceneUrl: string, cb?: (bundle: _cc_.AssetManager.Bundle, path: string) => void, progress?: (ratio: number) => void, proLoadScene?: boolean): void;
        /**
         * 加载并切换场景
         * 当前场景切换 销毁所有 在重新加载
         * @param sceneUrl
         * @param cb
         * @param progress
         * @param openLoadingUI duration(加载显示几秒);url(打开加载ui，默认白屏过度)
         */
        change(sceneUrl: string, cb?: () => void, progress?: (ratio: number) => void, openLoadingUI?: {
            duration?: number;
            url?: string;
        }, changeData?: any): void;
        getCurrent<T extends BaseScene>(): T;
    }
}
 namespace apeng {
    class TimerModule extends BaseModule {
        private handerPool;
        private handerMap;
        private _updateInterval;
        private _updateAddTime;
        private handerComponent;
        private _dt;
        private minDt;
        private _dirtyMark;
        get scheduler(): _cc_.Scheduler;
        /**游戏统一帧率 增加控制慢镜头缩放比例 */
        get dt(): number;
        /**一秒的帧率平滑 */
        get dtSecond(): number;
        /**不受时间缩放影响的帧率 */
        get dtDefault(): number;
        private _fps;
        /**当前帧率 */
        get fps(): number;
        set fps(value: number);
        get timeScale(): number;
        onInstance(): void;
        /**手动传入 避免循环引用 */
        init(canvas: _cc_.Canvas): void;
        /**所有执行完毕的帧定时器 */
        private lateUpdate;
        /**
         * 延迟定时器
         * @param callBack
         * @param delay
         */
        once(caller: any, callBack: Function, delay?: number, args?: any[], cover?: boolean): void;
        /**
         * 延迟到下一帧执行
         * @param caller
         * @param callBack
         */
        callLater(caller: any, callBack: Function, args?: any[], cover?: boolean): void;
        /**
         * 循环定时器
         * @param callback
         * @param interval
         * @param repeat -1时 无限循环
         * @param delay -1时立即执行
         * @param cover 覆盖上一个执行
         */
        loop(caller: any, callBack: Function, interval: number, repeat?: number, delay?: number, args?: any[], cover?: boolean): void;
        pauseAll(): void;
        resumeAll(): void;
        isPauseAll(): boolean;
        /**
         * 清除一个定时器
         * @param caller
         * @param callback
         * @returns
         */
        clear(caller: any, callBack: Function): void;
        /**
         * 清除目标上的所有定时器
         * @param caller
         * @returns
         */
        clearAll(caller: any): void;
        /**
         * 是否注册过
         * @param caller
         * @param callback
         * @returns
         */
        has(caller: any, callBack: Function): boolean;
        /**
         * 注册过的值
         * @param caller
         * @param callback
         * @returns
         */
        get(caller: any, callBack: Function): ITimerHander;
        private onCallBack;
        /**低帧率 */
        hasLowFps(): boolean;
        setTimeScale(raito: number): void;
        /**
         * 获取标记 true 脏了
         * 会在lateUpdate将标记置为true
        */
        dirtyMark(key: string): boolean;
        deleteDirtyMark(key: string): void;
        /**清除间隔执行 */
        clearUpdateInterval(id: string | number): void;
        /**
         *
         * update里检测间隔执行
         * 误差(间隔时间)在 -1 到1之间
         * @param dt
         * @param interval 间隔多长时间 返回 true
         * @param onceValue  第一次进入返回false
         */
        hasUpdateIntervale(id: string | number, interval: number, onceValue: boolean): boolean;
        /**
         * update里增加时间
         * @param id
         * @returns 增量到当前的时间
         */
        updateAddTime(id: string | number): number;
        /**清除递增时间 */
        clearUpdateAddTime(id: string | number): void;
    }
}
 namespace apeng {
    class _Loading {
        private _waitComponent;
        private _waitVisible;
        private get screenComponent();
        /**白屏动画 */
        screen(visible: boolean, color?: _cc_.Color): void;
        getScreenState(): ETipWhiteState.Hide | ETipWhiteState;
        setScreenShow(cb: () => void): void;
        /**
         * 打开等待加载ui
         * @param visible 显隐
         * @param clickClose 点击关闭自己
         * @param progress 加载进度
         * @param url 打开的路径， 默认 UIMgr.DefaultUrl.wait
         * @param autoAddDurtion 假进度加载时间
         * @returns
         */
        wait(visible: boolean, clickClose?: boolean, progress?: () => number, url?: string, duration?: number, resoucesLoadComplete?: () => void): void;
        getWaitState(): ETipWaitState;
        setWaitShow(cb: () => void): void;
    }
    export class UIModule extends BaseModuleEvent {
        readonly EventType: {
            LOAD_COMPLETE: string;
            OPEN_BEFORE: string;
            OPEN: string;
            CLOSE: string;
            DISPOSE: string;
            /**关闭全部弹窗时，不包括 lockUIMgrAll=true，layerType=EUILayer.WindowUp|EUILayer.Window*/
            CLOSE_SCENE_ALL: string;
            /**同上 下一帧检测 */
            CLOSE_SCENE_ALL_DELAY: string;
            /**有一个为 false 时 不算全部关闭弹窗 */
            HAS_CLOSE_SCENE_ALL: string;
        };
        DefaultUrl: {
            tip: string;
            tipSystemFont: string;
            tipClick: string;
            tipClickSystemFont: string;
            tipTitleClick: string;
            tipTitleClickSystemFont: string;
            wait: string;
            moveUp: string;
            flyItem: string;
            fly: string;
        };
        /**延迟预加载音效 */
        delayProAudio: number;
        Loading: _Loading;
        readonly pool: Pool<string, _cc_.Node>;
        /**ui池 */
        modules: Maps<string, IUIModule>;
        UICamera: _cc_.Camera;
        ScreenshotCamera: _cc_.Camera;
        /**舞台 */
        stage: _cc_.Node;
        /**舞台上层 */
        stageUp: _cc_.Node;
        private waits;
        private openTotal;
        private preLoadUrls;
        private preLoads;
        onBeforeInstance(): void;
        /**
         * 屏蔽所有触摸事件
         * @param visible
         * @param layer
         * @param stage 可选stageUp 默认 stage
         */
        blockTouchEvent(visible: boolean, layer?: EUILayer, stage?: _cc_.Node): void;
        blockTouchEventVisible(layer?: EUILayer, stage?: _cc_.Node): boolean;
        /**
         * 获取ui数据
         * @param url
         * @returns
         */
        getModule(url: string): IUIModule;
        /**
         * 系统提示
         * @param str
         */
        tip(str: string, clickClose?: boolean, closecb?: () => void, systemFont?: boolean): void;
        /**
              * 飞行动画
              * @param start
              * @param end
              * @param iconUrl
              * @param itemCount 默认 10～15个，生成的个数  可传入固定个数，也可[2,10]随机指定个数
              * @param cb
              */
        flyTip(start: IVector2, end: IVector2, iconUrl: string, itemCount?: number | (number[]), cb?: () => void): void;
        /**向上飞的动画 */
        moveUp(startWorldPosition: IVector2, text: string, iconUrl?: string, complete?: () => void, scale?: number): void;
        /**
         * 系统提示
         * @param title 标题 如无 则不显示标题栏
         * @param strs 从上往下排列的字符
         * @param closeCb
         */
        tipTitle(datas: (ITipTitleClickItemRight | string)[], title?: string, closeCb?: () => void, showDot?: boolean, autoClose?: boolean, downTip?: string, systemFont?: boolean): void;
        /**清除所有提示 */
        clearTip(): void;
        /**
         * 调起系统弹窗
         * @param content 文字内容
         * @param btn 点击按钮
         * @param rightBtn 如有 则为两个按钮 为右边的按钮
         */
        dialogue(str: string, btn: IDialogueBtn, rightBtn?: IDialogueBtn): void;
        /**获取处于原点下的UI节点 */
        getZeroWorldPointNode(): _cc_.Node;
        /**生成线 */
        showLine(startWorld: IVector2, endWorld: IVector2, color?: Readonly<_cc_.math.Color>, width?: number): _cc_.Node;
        private get _line();
        hideLine(): void;
        createSpriteSplashItem(parent: _cc_.Node, color?: _cc_.Color, size?: _cc_.Size): _cc_.Node;
        createByRectangle(rectangle: Rectangle): void;
        preOpen(url: string, openData?: any): void;
        /**
         * 打开一个ui
         * @param url ui预制体相对路径
         * @param openData 传入数据到module
         * @param openCb 真正打开回调 onCreate后
         * @param closeCb 监听ui关闭时回调 onClose后
         * @param tipWait 打开ui加载进度界面`true`
         * @returns
         */
        open(url: string, openData?: any, openCb?: () => void, closeCb?: (closeData: any) => void, tipWait?: boolean, show?: boolean): void;
        /**
         * 关闭ui
         * active = false
         * @param url addModule名
         * @returns
         */
        close(url: string): void;
        private checkAd;
        /**
         * 播放粒子特效
         * @param url
         * @param pos 屏幕中心点
         * @param layer
         */
        playParticle(url: string, centerOffset: IVector2, layer?: EUILayer): void;
        private onDelayCheckAd;
        /**获取当前展示最上层的ui */
        getTop(add?: (ui: BaseUI) => boolean): string;
        /**场景上是否还有其他ui */
        checkSceneOpenUI(): void;
        private onDelayHasOpenUIEvent;
        /**查看 场景上还有其他弹窗 */
        hasSceneOpenUI(): true | IUIModule;
        /**
       * 转换世界坐标到ui节点下得坐标
       * @param camera
       * @param worldPosition
       * @param parent
       * @returns
       */
        cameraConverToUINode(worldPosition: _cc_.Vec3, parent: _cc_.Node): _cc_.Vec3;
        /**
         * 打开在等待队列中的ui
         */
        private openWaitUI;
        /**
         * 设置ui的显隐 并派发事件
         * @param url
         * @param isOpen
         * @param isCb
         */
        private setActive;
        /**
         * 关闭指定的ui
         */
        closeAll(layer: EUILayer, exclude?: string[], checkLock?: boolean): this;
        /**
         * 销毁一个ui
         * @param url
         */
        dispose(url: string): void;
        /**
         * 销毁指定ui
         */
        disposeAll(layer: EUILayer): this;
        private emitOpenByCloseCb;
        /**获取UI父节点 */
        getLayerParent(layer: EUILayer, stage?: _cc_.Node): _cc_.Node;
        setStage(canvasNode: _cc_.Node): void;
        /**
         * 加载一个ui
         * @param url
         * @param cb
         */
        load(url: string, cb?: () => void, openData?: any, progress?: (ratio: number) => void): void;
        /**
         * 销毁ui时 释放资源
         * @param url
         * @param release 默认true
         */
        setDisposeByRelease(url: string, release?: boolean): void;
        /**
      * 设置加载UI时
      * 需要预先加载的资源
      * @param url
      * @param urls
      */
        setPreLoadUrls(url: string, urls: (openData: any) => TResoucesUrl<_cc_.Asset>[]): this;
        /**
    * 设置加载UI时
    * 需要预先加载的资源
    * @param url
    * @param urls
    */
        setPreLoad(url: string, complete: (openData: any, complete: () => void) => void): this;
        /**获取启动游戏开始 打开的次数 */
        getOpenCount(url: string): number;
        clearOpenDayCount(): void;
        /**获取当天打开的次数 */
        getToDayOpenCount(url: string): number;
        /**获取打开页面到当前的持续时间 秒*/
        getOpenByDuation(url: string): number;
        /**属于up层 */
        hasUp(url: string): boolean;
        private hasLayerUp;
        /**注册打开事件 */
        onceOpen<T extends BaseUI>(uiUrl: string, cb: (ui: T) => void, delay?: number): void;
        private onOpened;
    }
    export {};
}
 namespace apeng {
    interface IAudioData {
        url: string;
        source: _cc_.AudioSource;
        sources: _cc_.AudioSource[];
        music: boolean;
        volume: number;
        /**音量缩放 */
        volumeScale: number;
        startTime: number;
    }
}
 namespace apeng {
    interface IGMData {
        dec: string;
        click: (input: string) => void;
        inputTip?: string;
    }
}
 namespace apeng {
    const CGuideDefine: {
        fingerUrl: string;
    };
    interface IGuideNewUser {
        /**属于哪个场景 */
        sceneUrl: string;
        /**引导队列 */
        datas: (() => void)[];
        /**进入时初始化 */
        enter: (complete: () => void) => void;
        /**到了此索引时 就已经完成  -1 最后一个*/
        completeIndex: number;
    }
    interface IGuideDialogueUI {
        dec: string;
        /**播放显示动画 */
        openAnim: boolean;
        /**播放隐藏动画 */
        closeAnim: boolean;
        closeCb: () => void;
        click?: () => void;
    }
    interface IGuideClickUIFinger {
        position: IVector2 | (() => IVector2);
        delay?: number;
    }
    interface IGuideClickUI {
        click: (e: _cc_.EventTouch) => void;
        finger?: IGuideClickUIFinger;
    }
    interface IGuideFingerUI {
        position: IVector2 | (() => IVector2);
        delay?: number;
        touchStartCloseUI?: boolean;
        angle?: number;
        range?: Rectangle;
        clickRange?: (e: _cc_.EventTouch) => void;
        click?: (e: _cc_.EventTouch) => void;
    }
    interface IGuideMaskUIDrag {
        framWorldPosition: IVector2;
        toWorldPosition: IVector2;
        startRect?: Rectangle;
        /**在范围点按下时 */
        touchStart?: () => void;
    }
    interface IGuideMaskUIText {
        str: string;
        worldPos: IVector2;
        delay: number;
    }
    interface IGuideMaskUI {
        /**显示的文本提示 */
        text?: IGuideMaskUIText;
        /**镂空区域 */
        hollows?: BaseHollow[];
        /**点击镂空区域时关闭ui 默认 false */
        clickShapeByCloseUI?: boolean;
        /**点击任意位置也可以触发成功事件 默认 false */
        anyTrigger?: boolean;
        /**拖动属性 */
        drag?: IGuideMaskUIDrag;
        touchEvent?: {
            start?: IGuideMaskUITouchEvent;
            move?: IGuideMaskUITouchEvent;
            end?: IGuideMaskUITouchEvent;
        };
        /**显示镂空区域描边 */
        hollowOutLine?: boolean;
    }
    interface IGuideMaskUITouchEvent {
        fn: (e: _cc_.EventTouch) => void;
        /**要判断手指在形状内 */
        checkHollow: boolean;
    }
}
 namespace apeng {
    /**广告展示的类型 */
    enum EBottomAdType {
        /**跳过检测 */
        Jump = 0,
        /**什么都不显示 */
        None = 1,
        /**显示Banner */
        Banner = 2,
        /**显示原生 */
        Native = 3
    }
    enum EBlockOnceAdType {
        /**跳过检测 */
        Jump = 0,
        /**什么都不显示 */
        None = 1,
        /**显示 */
        Show = 2
    }
    type TRewardedVideo = {
        onLoad: (cb: (res: any) => void) => void;
        onError: (cb: (res: any) => void) => void;
        onClose: (cb: (res: {
            isEnded: boolean;
        }) => void) => void;
        load: () => Promise<unknown>;
        show: () => Promise<unknown>;
        /**是 web 模拟广告组件 */
        isSimulate?: boolean;
    };
    type TInterstitial = {
        onLoad: (cb: (res: any) => void) => void;
        onError: (cb: (res: any) => void) => void;
        onClose: (cb: (res: any) => void) => void;
        load: () => Promise<unknown>;
        show: () => Promise<unknown>;
        destroy: () => void;
    };
    type TRecord = {
        start: (value: {
            duration?: number;
            isMarkOpen?: boolean;
            locTop?: number;
            locLeft?: number;
            frameRate?: number;
        }) => void;
        resume: () => void;
        pause: () => void;
        stop: () => void;
        onStart: (cb: (res: any) => void) => void;
        onPause: (cb: (res: any) => void) => void;
        onResume: (cb: (res: any) => void) => void;
        onStop: (cb: (res: any) => void) => void;
        onError: (cb: (res: any) => void) => void;
        clipVideo: (obj: {
            path: string;
            timeRange?: number[];
            clipRange?: number[];
            success?: (res: any) => void;
            fail?: (res: any) => void;
            complete?: (res: any) => void;
        }) => void;
    };
    module TOpenDataContext {
        interface I {
            set: (value: number[]) => void;
            startRender: (param: Param[]) => void;
            updateRender: (index: number) => void;
        }
        type Param = {
            /**以大到小排序 */
            max: boolean;
            /**数量后缀 */
            lastStr: string;
            /**默认的数据 */
            defaultData: number;
        };
    }
    module TNativeTemp {
        type Style = {
            left?: number;
            top?: number;
            width?: number;
            height?: number;
        };
        type Ad = {
            isLoading?: boolean;
            isLoadingByShow?: boolean;
            isShow: () => boolean;
            destroy: () => void;
            show: () => Promise<unknown>;
            hide: () => Promise<unknown>;
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onHide: (cb: (res: any) => void) => void;
            onClose: (cb: (res: any) => void) => void;
        };
    }
    module TBanner {
        type Style = {
            left?: number;
            top?: number;
            width?: number;
            height?: number;
        };
        type Ad = {
            isLoading?: boolean;
            isLoadingByShow?: boolean;
            style?: Style;
            destroy: () => void;
            show: () => Promise<unknown>;
            hide: () => Promise<unknown>;
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onHide: (cb: (res: any) => void) => void;
            onResize: (cb: (res: {
                width: number;
                height: number;
            }) => void) => void;
        };
    }
    module TBlockOnce {
        type Style = {
            left?: number;
            top?: number;
        };
        type Ad = {
            isLoading?: boolean;
            isLoadingByShow?: boolean;
            style?: Style;
            destroy: () => void;
            show: () => Promise<unknown>;
            hide: () => Promise<unknown>;
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onHide: (cb: (res: any) => void) => void;
            onResize: (cb: (res: {
                width: number;
                height: number;
            }) => void) => void;
        };
    }
    /**ui对应的banner模式 */
    enum EAdState {
        /**不进行任何操作 */
        None = 0,
        /**显示banner */
        Show = 1,
        /**将显示的banner隐藏 */
        Hide = 2
    }
    module TShare {
        type Param = {
            title: string;
            imageUrl?: string;
            query?: string;
            desc?: string;
        };
        const ParamDefault: {
            title: string;
            imageUrl: string;
            query: string;
            desc: string;
        };
        type Share = {
            onShareAppMessage: (path: string, param?: () => TShare.Param) => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void) => void;
            circleFriends?: (value: TShare.Param, cb?: (success: boolean) => void) => void;
        };
        interface shareMessage {
            videoPath?: string;
            title?: string;
            desc?: string;
            mapUrl?: string;
            mapid?: string;
            mapauthor?: string;
            modelid?: string;
            videoTag?: string;
            defaultBgm?: string;
            share_index?: number;
            channel?: string;
            query?: any;
        }
    }
    type TVibrate = {
        long: () => void;
        short: () => void;
    };
    type TUserInfo = {
        /** 昵称*/
        name: string;
        /** 头像地址*/
        avatarUrl: string;
        /** 年龄*/
        age: number;
        /** 城市*/
        city: string;
    };
    enum ERewardVideoState {
        /**观看视频完成 */
        Finish = 0,
        /**中途关闭 */
        Close = 1,
        /**拉起失败，播放失败等 */
        Error = 2
    }
    type TSystemInfo = {
        /** 手机品牌*/
        brand: string;
        /** 手机型号*/
        model: string;
        /** 屏幕宽度*/
        screenWidth: number;
        /** 屏幕高度*/
        screenHeight: number;
        /** 版本号*/
        version: string;
        /**小游戏版本 */
        SDKVersion: string;
        /**尺寸缩放比率 */
        pixelRatio: number;
    };
    type TConfig = {
        gameName: string;
        appid: string;
        /**开始多长时间屏蔽广告 */
        startBlockAd: number;
        /**分享数据 */
        share: {
            callTime: number;
            list: (TShare.Param[]) | {
                title: string[];
                imgUrl: string[];
            };
            /**后台审核过的ID */
            templateId: string[];
        };
        banner: {
            /**后台ID */
            id: string;
            /**自动刷新 切换的第二个id */
            idUpdate?: string;
            /**自动刷新的时间 */
            refreshInterval: number;
            /**大小比率 */
            sizeRatio: number;
            /**激活banner */
            active: boolean;
        };
        blockOnce: {
            id: string;
            refreshInterval: number;
            idUpdate: string;
        };
        interstitial: {
            /**后台ID */
            id: Array<string>;
            /**调起的间隔时间 */
            coolingTime: number;
        };
        nativeTemp: {
            id: string;
            idRoot: string;
            refreshInterval: number;
        };
        rewardedVideo: {
            id: string;
            /**每天第一次播放使用 */
            idOnce: string;
            /**最多调用这么多次 */
            showMaxCount: number;
            /**直接回调成功 */
            isSuccess: boolean;
        };
    };
    interface IAndroidPlatformLoginTapTap {
        /**1成功 2失败 */
        result: 1 | 2;
        openid: string;
        head_url: string;
        name: string;
    }
    enum WxShareScene {
        /**聊天界面 */
        share_session = 0,
        /**朋友圈 */
        share_timeline = 1,
        /**收藏 */
        share_favorite = 2
    }
    enum WxShareType {
        /**纯文本 */
        type_text = 0,
        /**纯图片 */
        type_image = 1,
        /**视频----暂时用不到 */
        type_video = 2,
        /**音乐----暂时用不到 */
        type_music = 3,
        /**网址 */
        type_webPage = 4,
        /**小游戏----暂时用不到*/
        type_miniProgram = 5
    }
    enum ENativeSend {
        language = "language",
        umInit = "umInit",
        umReport = "umReport",
        platform = "platform",
        rewardedVideoCreate = "rewardedVideoCreate",
        rewardedVideoShow = "rewardedVideoShow",
        interstitialCreate = "interstitialCreate",
        interstitialLoad = "interstitialLoad",
        interstitialShow = "interstitialShow",
        bannerCreate = "bannerCreate",
        bannerHide = "bannerHide",
        BannerShow = "BannerShow",
        hideLauncher = "hideLauncher",
        /**wyd add */
        wxgetcode = "wxgetcode",
        wxshare = "wxshare",
        fbshare = "fbshare",
        facebookLogin = "facebookLogin",
        downloadsaveimg = "downloadsaveimg",
        openVibrator = "openVibrator",
        hideVibrator = "hideVibrator",
        taptapLogin = "taptapLogin",
        googleLogin = "googleLogin",
        taptapAntiAddiction = "taptapAntiAddiction",
        privacyConfirm = "privacyConfirm",
        OpenMediationShowRewardAd = "OpenMediationShowRewardAd",
        reportEventCustom = "reportEventCustom",
        reportUserProperty = "reportUserProperty",
        getSystemInfo = "getSystemInfo"
    }
    enum ENativeReceive {
        rewardVideoError = "rewardVideoError",
        rewardVideoLoaded = "rewardVideoLoaded",
        rewardVideoShowed = "rewardVideoShowed",
        rewardVideoClose = "rewardVideoClose",
        interstitialError = "interstitialError",
        interstitialLoaded = "interstitialLoaded",
        interstitialShow = "interstitialShow",
        interstitialClose = "interstitialClose",
        bannerError = "bannerError",
        bannerLoaded = "bannerLoaded",
        bannerShow = "bannerShow",
        bannerHide = "bannerHide",
        ReceSystemInfo = "ReceSystemInfo",
        login_success = "login_success",
        login_fail = "login_fail",
        wxShareReturn = "wxShareReturn",
        downLoadSaveImgResult = "downLoadSaveImgResult",
        AntiAddictionResult = "AntiAddictionResult",
        privacyConfirmComplete = "privacyConfirmComplete",
        OpenMediation_RewardAd_Result = "OpenMediation_RewardAd_Result"
    }
}
 namespace apeng {
    interface IPrivacyDecUI {
        path: string;
        count: number;
        pathPirfix?: string;
        gameName: string;
    }
}
 namespace apeng {
    type TResoucesUrl<T extends _cc_.Asset> = (string | {
        url: string;
        type: new () => T;
    });
    interface ISpriteFrameByComponent extends _cc_.Component {
        spriteFrame: _cc_.SpriteFrame | null;
    }
    interface IBundle {
        bundle: _cc_.AssetManager.Bundle;
        parent: string[];
        children: string[];
    }
}
 namespace apeng {
    interface ITimerHander {
        callBack: Function;
        caller: any;
        timerCallBack: () => void;
        args: any[];
    }
}
 namespace apeng {
    enum ETipWhiteState {
        Hide = 0,
        Show = 1,
        Showing = 2,
        Hideing = 3
    }
    enum ETipWaitState {
        Hide = 0,
        Complete = 1,
        Loading = 2
    }
    /**ui当前状态 */
    enum EUIState {
        /**无效状态 */
        None = 0,
        /**正在加载中 */
        Load = 1,
        /**显示中 */
        Open = 2,
        /**加载过后 隐藏中 */
        Close = 3,
        /**被顶掉 等调用CloseUI时显示 等待中*/
        Wait = 4,
        /**还没加载完 调用了关闭 */
        LoadClose = 5
    }
    /**ui层级 up层不具备顶掉功能 */
    enum EUILayer {
        /**主界面 */
        Window = 0,
        /**主界面上层 之前*/
        WindowUpAfter = 1,
        /**主界面上层 */
        WindowUp = 2,
        /**弹窗层 */
        Panel = 3,
        PanelUp = 4,
        /**公告层 */
        Notice = 5,
        NoticeUp = 6,
        /**提示 道具ui等 加载ui等 */
        Item = 7,
        ItemUp = 8,
        /**引导最上层 */
        Guide = 9,
        GuideUp = 10,
        /**最上层 */
        Top = 11,
        TopUp = 12
    }
    interface IUIModule {
        /**ui节点 */
        ui: BaseUI;
        /**当前ui状态 */
        state: EUIState;
        /**打开ui的次数 */
        openCount: number;
        /**打开的时间 */
        openTime: number;
        /**关闭回调 */
        closeCb: (closeData: any) => void;
        url: string;
        loaded: boolean;
        disposeByRelease: boolean;
        openTotal: number;
    }
}
 namespace apeng {
    const StorageLogic: {
        /**
         * 已离线了多少分钟
         */
        offlineByMinute(offlineTime: number): number;
        /**
         * 已离线了多少小时
         */
        offlineByHour(offlineTime: number): number;
        /**
         * 已登录了多少天
         */
        onlineByDay(onlineTime: number): number;
        /**
             * 已离线了多少秒
             */
        offlineBySecond(offlineTime: number): number;
        /**
         * 已离线了多少天
         */
        offlineByDay(offlineTime: number): number;
        /**是今天注册的玩家 */
        dayNewUser(registTime: number): boolean;
        /**猫失踪回来还有多长时间， <= 0(回归) */
        catMissBackTime(allDuration: number, startTime: number, helpCount: number, helpDuration: number): number;
        /**通过缓存key 拿到枚举类型 */
        getKeyByModuleType(key: string): EModuleType;
    };
}
 namespace apeng {
    class BannerPlatformLogic extends BaseModule {
        private size;
        private isShow;
        isSimulate: boolean;
        private ad;
        private ad2;
        errHide: boolean;
        private curIndex;
        get worldTopY(): number;
        onCreate(): void;
        private resetSize;
        create(id: string): TBanner.Ad;
        hide(complete?: () => void): void;
        show(complete?: () => void): void;
        private getAd;
        preCreate(): TBanner.Ad;
    }
}
 namespace apeng {
    class BlockOncePlatformLogic extends BaseModule {
        /**距离右上角胶囊多少 */
        topSpace: number;
        private isShow;
        private ad;
        private ad2;
        private curIndex;
        onCreate(): void;
        create(id: string): TBlockOnce.Ad;
        hide(complete?: () => void): void;
        show(complete?: () => void): void;
        private getAd;
        preCreate(): TBlockOnce.Ad;
    }
}
 namespace apeng {
    class InterstitialPlatformLogic extends BaseModule {
        isSimulate: boolean;
        private lastShowTime;
        private callBack;
        private idByIndex;
        private ads;
        onCreate(): void;
        create(id: string): TInterstitial;
        getAd(addIndex: boolean): any;
        pre(): void;
        show(closeCb?: () => void): void;
    }
}
 namespace apeng {
    class NativeTempPlatformLogic extends BaseModule {
        private ad;
        private adRoot;
        adOffsetY: number;
        adRootOffsetY: number;
        isSimulate: boolean;
        private isShow;
        private isShowRoot;
        onCreate(): void;
        showRoot(): void;
        hideRoot(complete?: () => void): void;
        create(id: string, centerOffset: number): TNativeTemp.Ad;
        hide(complete?: () => void): void;
        pre(): void;
        preRoot(): void;
        show(complete?: () => void): void;
    }
}
 namespace apeng {
    class RecordPlatformLogic extends BaseModule {
        isSimulate: boolean;
        viodeTime: number;
        recordering: boolean;
        active: boolean;
        stoping: boolean;
        videoPath: string;
        getvideo: boolean;
        private _isEvent;
        private record;
        onCreate(): void;
        stop(): void;
        getSharePath(): string;
        start(duration?: number): void;
        pause(): void;
        resume(): void;
    }
}
 namespace apeng {
    class RewardedVideoPlatformLogic extends BaseModule {
        isSimulate: boolean;
        private ad;
        private adOnce;
        private callBack;
        private reportName;
        private showTime;
        private pause;
        private _lastShowByCloseTime;
        onCreate(): void;
        create(id: string): TRewardedVideo;
        getLastShowByCloseTime(): number;
        /**视频正在加载中 */
        isLoaded(): boolean;
        /**
         * 精简调起接口，其他状态时自动弹出提示
         * @param report 视频打点
         * @param cb 看完时回调
         */
        showByFinish(report: string, cb: () => void, failCb?: () => void): void;
        private report;
        private error;
        private getAd;
        preCreate(): TRewardedVideo;
        private reprotAddress;
        /**
         * 拉起激励视频广告
         * @param report 视频汇报点， ,号分割value字段
         * @param cb
         * @returns
         */
        show(report: string, cb?: (state: ERewardVideoState) => void): void;
        private clearShowData;
    }
}
 namespace apeng {
    class SharePlatformLogic extends BaseModule {
        isSimulate: boolean;
        private share;
        onCreate(): void;
        getData(): TShare.Param;
        onShareAppMessage(param?: () => TShare.Param): void;
        getImgUrlByPath(url?: string): string;
        show(value: TShare.Param, cb?: (success: boolean) => void): void;
        /**
         * 朋友圈
         */
        circleFriends(value: TShare.Param, cb?: (success: boolean) => void, query?: string): void;
    }
}
 namespace apeng {
    class VibratePlatformLogic extends BaseModule {
        private vibrate;
        get isOpen(): boolean;
        onCreate(): void;
        /**开启振动 */
        setOpen(open: boolean): void;
        /**短振动 */
        short(): void;
        /**长振动 */
        long(): void;
    }
}
 namespace apeng {
    abstract class BasePlatform extends BaseModule {
        static IRecordMgr(): TRecord;
        static IOpenDataContext(): TOpenDataContext.I;
        static IInterstitialCreate(id: string): TInterstitial;
        static INativeTempCreate(id: string, interval: number, centerOffset?: number): {
            isShow: () => boolean;
            show: () => Promise<unknown>;
            hide: () => Promise<unknown>;
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onHide: (cb: (res: any) => void) => void;
            onClose: (cb: (res: any) => void) => void;
            destroy: () => void;
        };
        static IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        static IBlockOnceCreate(id: string): TBlockOnce.Ad;
        reportEvent(key: string, obj: Object): void;
        /**
       * 登陆接口 获取 js-code ，5分钟后失效
       * 用作获取 openid
       * @param {(code: string) => void} cb
       */
        static login(cb?: (code: string) => void): void;
        static IRewardedVideoCreate(id: string): TRewardedVideo;
        static IShare(): TShare.Share;
        static getSystemInfoSync(): TSystemInfo;
        static getLaunchOptionsSync(): TSystemInfo;
        static IVibrate(): TVibrate;
        static getUserInfo(cb: (value: TUserInfo) => void): void;
        /**平台接口名 */
        root: any;
        protected shareAppMessageCallBack: (success: boolean) => void;
        login(cb?: (code: any) => void): void;
        IRewardedVideoCreate(id: string): TRewardedVideo;
        IRecordMgr(): TRecord;
        INativeTempCreate(id: string, interval: number, centerOffset?: number): TNativeTemp.Ad;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IInterstitialCreate(id: string): TInterstitial;
        IShare(): TShare.Share;
        IVibrate(): TVibrate;
        IBlockOnceCreate(id: string): TBlockOnce.Ad;
        reStart(): void;
        getSystemInfoSync(): TSystemInfo;
        getUserInfo(cb: (value: TUserInfo) => void): void;
        getLaunchOptionsSync(): Object;
        payShow(count: number, cb: (state: "success" | "fail") => void): void;
        /**
         * 保存成图片
         * @param width
         * @param height
         * @param buffer
         * @param cb
         * @param saveLocal 保存到本地相册，默认 false
         */
        saveImg(width: number, height: number, buffer: any, cb: (url: string) => void, saveLocal?: boolean): void;
        protected getSaveImgName(): string;
        privacyConfirm(complete: () => void): void;
        IOpenDataContext(): TOpenDataContext.I;
        onShow(cb: (param?: any) => void): void;
        onHide(cb: (param?: any) => void): void;
        killGame(): void;
        /**获取设备唯一标识码 */
        getSystemId(cb: (code: string) => void): void;
        getSetting(cb: (value: any) => void): void;
    }
}
 namespace apeng {
    class BaseMingamePlatform extends BasePlatform {
        root: any;
        IRecordMgr(): any;
        IRewardedVideoCreate(id: string): any;
        IInterstitialCreate(id: string): any;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IVibrate(): {
            short: () => void;
            long: () => void;
        };
        reportEvent(key: string, obj: Object): void;
        getLaunchOptionsSync(): Object;
        protected loadShareImg(path: string, complete: () => void, delay?: number): void;
        protected isLoadShareCache(): boolean;
        getSystemInfoSync(): TSystemInfo;
        login(cb?: (code: string) => void): void;
        onShow(cb: (obj?: any) => void): void;
        onHide(cb: (obj?: any) => void): void;
        reStart(): void;
        killGame(): void;
    }
}
 namespace apeng {
    class A360Platform extends BaseMingamePlatform {
        root: any;
        private testId;
        IRewardedVideoCreate(id: string): TRewardedVideo;
        IBlockOnceCreate(id: string): TBlockOnce.Ad;
        IInterstitialCreate(id: string): TInterstitial;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
    }
}
 namespace apeng {
    class BaseAndroidPlatform extends BasePlatform {
        static IVibrate(): TVibrate;
        static privacyConfirm(complete: () => void): void;
        static saveImg(width: number, height: number, buffer: any, cb: (url: string) => void, saveLocal?: boolean): void;
        IVibrate(): TVibrate;
        privacyConfirm(complete: () => void): void;
        saveImg(width: number, height: number, buffer: any, cb: (url: string) => void, saveLocal?: boolean): void;
        IRewardedVideoCreate(id: string): {
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onClose: (cb: (res: {
                isEnded: boolean;
            }) => void) => void;
            load: () => Promise<unknown>;
            show: () => Promise<unknown>;
        };
        IInterstitialCreate(id: string): {
            onLoad: (cb: (res: any) => void) => void;
            onError: (cb: (res: any) => void) => void;
            onClose: (cb: (res: any) => void) => void;
            load: () => Promise<unknown>;
            show: () => Promise<unknown>;
            destroy: () => void;
        };
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IShare(): TShare.Share;
        loginWx(cb: (data: {
            /**1成功 2失败 */
            result: 1 | 2;
            code: string;
        }) => void): void;
        loginTaptap(cb: (data: IAndroidPlatformLoginTapTap) => void): void;
        taptapAntiAddiction(cb: (data: any) => void): void;
        payShow(count: number, cb: (state: "success" | "fail") => void): void;
    }
}
 namespace apeng {
    class KsPlatform extends BaseMingamePlatform {
        root: any;
    }
}
 namespace apeng {
    class KsWaiPlatform extends BaseMingamePlatform {
        root: any;
    }
}
 namespace apeng {
    class OppoPlatform extends BaseMingamePlatform {
        root: any;
        INativeTempCreate(id: string, interval: number, centerOffset?: number): TNativeTemp.Ad;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IShare(): {
            onShareAppMessage: () => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        };
    }
}
 namespace apeng {
    class OverseasAndroidXgamePlatform extends BaseAndroidPlatform {
    }
}
 namespace apeng {
    class QQPlatform extends BaseMingamePlatform {
        root: any;
        IBlockOnceCreate(id: string): TBlockOnce.Ad;
        IShare(): TShare.Share;
    }
}
 namespace apeng {
    class TTPlatform extends BaseMingamePlatform {
        root: any;
        onInstance(): void;
        IShare(): {
            onShareAppMessage: () => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        };
        shareAppMessage(videoTopics?: string[], callback?: (success: boolean) => void, message?: TShare.shareMessage): void;
        reportEvent(key: string, obj: Object): void;
        private _loginSuccess;
        login(cb?: (code: string) => void): void;
        setImRankData(value: number): void;
        private _rankLogin;
        getImRankList(suffix?: string): void;
        /**
         * 侧边栏功能
         */
        readonly sidebar: {
            /**功能可用 */
            isEnable: boolean;
            /**可领取奖励 */
            isReward: boolean;
            EventType: {
                /**打开奖励弹窗 */
                REWARD_CHANGE: string;
            };
            init: (complete: () => void) => void;
            /**能领取奖励 */
            checkReward: () => boolean;
            /**领取奖励 */
            reward: () => void;
            /**跳转侧边栏 */
            to: () => void;
        };
    }
}
 namespace apeng {
    class VivoPlatform extends BaseMingamePlatform {
        root: any;
        INativeTempCreate(id: string, interval: number, centerOffset?: number): TNativeTemp.Ad;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IShare(): {
            onShareAppMessage: () => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        };
    }
}
 namespace apeng {
    class WebPlatform extends BasePlatform {
        private static setSize;
        static getChildrenByComponent(node: any, comp: any): any;
        private static getNodeParent;
        private static getPrefabByNode;
        static IRewardedVideoCreate(id: string): TRewardedVideo;
        static IRecordMgr(): TRecord;
        static IInterstitialCreate(id: string): TInterstitial;
        static INativeTempCreate(id: string, interval: number): TNativeTemp.Ad;
        static IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        IRewardedVideoCreate(id: string): TRewardedVideo;
        IRecordMgr(): TRecord;
        IInterstitialCreate(id: string): TInterstitial;
        INativeTempCreate(id: string, interval: number): TNativeTemp.Ad;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
        static IShare(): {
            onShareAppMessage: () => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
            circleFriends: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        };
        IShare(): {
            onShareAppMessage: () => void;
            show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
            circleFriends: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        };
        reStart(): void;
        saveImg(width: number, height: number, buffer: any, cb: (url: string) => void, saveLocal?: boolean): void;
    }
}
 namespace apeng {
    class WxPlatform extends BaseMingamePlatform {
        root: any;
        INativeTempCreate(id: string, interval: number): TNativeTemp.Ad;
        IBlockOnceCreate(id: string): TBlockOnce.Ad;
        IShare(): TShare.Share;
        IOpenDataContext(): TOpenDataContext.I;
        getSetting(cb: (value: any) => void): void;
        authorizeWxFriendInteraction(cb: (state: "authSuccess" | "authFail" | "none") => void): void;
        authorizeWxFriendInteractionSync(): boolean;
        getUserInfo(cb: (value: TUserInfo) => void): void;
        private _userInfoBtn;
        private isBtnShow;
        showUserInfoBtn(node: _cc_.Node, cb: (value: TUserInfo) => void): void;
        hideUserInfoBtn(): void;
        private _getUserInfo;
    }
}
 namespace apeng {
    class XiaoMiPlatform extends BaseMingamePlatform {
        root: any;
        INativeTempCreate(id: string, interval: number): TNativeTemp.Ad;
        IBannerCreate(id: string, style: TBanner.Style): TBanner.Ad;
    }
}
 namespace apeng {
    function AndroidFBShare(): {
        show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        circleFriends: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        onShareAppMessage: (cb?: (success: boolean) => void) => void;
    };
}
 namespace apeng {
    function AndroidWxAndroidShare(): {
        show: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        circleFriends: (value: TShare.Param, cb?: (success: boolean) => void, query?: string) => void;
        onShareAppMessage: (cb?: (success: boolean) => void) => void;
    };
}
 namespace apeng {
    class BaseScene extends BaseComponent {
        CLOSE_ON_CC: boolean;
        backupDescribe: string;
        openUIUrl: string;
        loadUrl: string;
        /**由mgr传入进来 */
        _changeData: any;
        get enterCount(): number;
        get isPause(): boolean;
        private _isOnCreate;
        private _onCreateByUpdateCb;
        isUpdate: boolean;
        _onCreate(): void;
        private _onCreateByUpdate;
        _onDispose(): void;
        pause(): void;
        run(...args: any[]): void;
        resume(): void;
        preLoadScene(cb: () => void): void;
        /**进入场景时 子节点生命周期执行后 */
        protected onCreate?(): void;
        /**退出场景时 */
        protected onDispose?(): void;
        /**每帧执行 */
        protected onUpdate?(): void;
        /**暂停场景时 */
        protected onPause?(): void;
        /**恢复场景时 */
        protected onResume?(): void;
        /**开始跑逻辑 */
        protected onRun?(...args: any[]): void;
    }
}
 namespace apeng {
    module si {
        /**唯一标识 写入获取*/
        type TKey = string;
        type TeGet = any[];
        function _eGet<T>(type: number): (data: TeGet) => T;
        function DateNow(): number;
        const ErrorCodeMap: {
            2000: string;
            2001: string;
            2002: string;
            2003: string;
            2004: string;
            2005: string;
        };
        enum EPlatformType {
            web = 99,
            wx = 1,
            qq = 2,
            tt = 3,
            vivo = 4,
            oppo = 5,
            /**华为 */
            hbs = 7,
            xiaomi = 8,
            /**海外xgame */
            overseas_android_xgame = 10,
            a360 = 11,
            /**快手海外 */
            overseas_kwai = 12,
            /**微游h5 */
            overseas_weiyou = 13,
            /**国内快手 */
            ks = 14,
            ios = 15
        }
        type TPlatformType = keyof typeof si.EPlatformType;
        class SCSendDataBase {
        }
        class ApiSCSendBase {
            static error(code: keyof typeof ErrorCodeMap, msg?: string): ApiSCSendBase;
            static data(data: SCSendDataBase): ApiSCSendBase;
            static serializeData(data: SCSendDataBase, source: Object): ApiSCSendBase;
            /**时间戳 */
            timeTemp: number;
            /**成功时接口返回的值 */
            data: SCSendDataBase;
            /**错误码 */
            errorCode: keyof typeof ErrorCodeMap;
        }
        class ParamBase {
        }
        class ParamData<T> extends ParamBase {
            data: T;
            constructor(data: T);
        }
        class ParamGame extends ParamBase {
            /**游戏id */
            game_id: string;
            /**用户id */
            user_id: string;
        }
        class ParamKeyCount extends ParamGame {
            /**配置config时的key */
            key: string;
            /**数值 */
            count: number;
            constructor(
            /**配置config时的key */
            key: string, 
            /**数值 */
            count: number);
        }
        class ParamGameData<T> extends ParamGame {
            data: T;
            constructor(data: T);
        }
        module User {
            class CSLogin extends ParamGame {
                /**获取到的jscode 服务器获取openid */
                jscode: string;
                /**appid */
                appid: string;
                /**直接使用此值创建用户 */
                openid: string;
                /**平台 */
                platform: TPlatformType;
                constructor(
                /**获取到的jscode 服务器获取openid */
                jscode: string, 
                /**appid */
                appid: string, 
                /**直接使用此值创建用户 */
                openid: string, 
                /**平台 */
                platform: TPlatformType);
            }
            class CSInfo extends ParamGame {
                /**昵称 */
                name: string;
                /**头像 */
                img_url: string;
                constructor(
                /**昵称 */
                name: string, 
                /**头像 */
                img_url: string);
            }
            class SCLogin extends SCSendDataBase {
                /**昵称 */
                name: string;
                /**头像 */
                img_url: string;
                /**当前的uid */
                uid: number;
                /**用户id */
                user_id: string;
            }
        }
        module Rank {
            enum ESCList {
                /**数值 */
                count = 0,
                /**排名 */
                index = 1,
                /**名字 */
                name = 2,
                /**头像地址 */
                img_url = 3
            }
            const eGet: {
                name: (data: TeGet) => string;
                count: (data: TeGet) => number;
                index: (data: TeGet) => number;
                img_url: (data: TeGet) => string;
            };
            type TSCSelf = TeGet;
            type TSCSelfAll = Record<TKey, TSCSelf>;
            class SCData extends SCSendDataBase {
                /**全部数据 */
                all: TSCSelf[];
                /**自己数据 */
                self: TSCSelf;
            }
            type TSCDataAll = Record<TKey, SCData>;
            enum ESCProvince {
                /**配置表index索引 */
                index = 0,
                /**数值 */
                count = 1
            }
            const eGetProvince: {
                index: (data: TeGet) => number;
                count: (data: TeGet) => number;
            };
            type TSCProvince = [number, number][];
            type TSCProvinceAll = Record<TKey, TSCProvince>;
        }
        module Custom {
            enum ESCList {
                /**实体id */
                id = 0,
                /**编号id */
                id_num = 1,
                /**玩的次数 */
                play_count = 2,
                /**通过次数 */
                play_success_count = 3,
                /**点赞次数 */
                like_count = 4,
                /**关卡数据 */
                data = 5,
                /**名字 */
                name = 6,
                /**头像地址 */
                img_url = 7,
                /**上传时间 */
                create_time = 8
            }
            const eGet: {
                id: (data: TeGet) => string;
                id_num: (data: TeGet) => number;
                play_count: (data: TeGet) => number;
                play_success_count: (data: TeGet) => number;
                like_count: (data: TeGet) => number;
                data: (data: TeGet) => TeGet;
                name: (data: TeGet) => string;
                img_url: (data: TeGet) => string;
                create_time: (data: TeGet) => number;
            };
            type TSCItem = TeGet;
            class SCListAll extends SCSendDataBase {
                /**全部数据 */
                datas: TSCItem[];
                /**受欢迎 玩的总次数排序 */
                play: number[];
                /**最新 发布时间排序 */
                new: number[];
                /**今日热门 热度值排序 */
                daylike: number[];
            }
        }
    }
}
 namespace apeng {
    class BaseUI extends BaseComponent {
        CLOSE_ON_CC: boolean;
        backupDescribe: string;
        /** 所在舞台下的层级 拥有先后顺序  ui所属层级*/
        layerType: EUILayer;
        /**默认展示在界面最底部的广告，设计时留出位置 */
        bottomAdType: EBottomAdType;
        /**右上角积木广告 */
        blockOnceAdType: EBlockOnceAdType;
        isEventBlock: boolean;
        clickCloseUI: boolean;
        set maskOpacityUI(value: number);
        get maskOpacityUI(): number;
        lockUIMgrAll: boolean;
        disposeByRelease: boolean;
        stageUp: boolean;
        private delayNodes;
        private autoPlayAnim;
        private _maskOpacityUI;
        /**open时 预加载音效 */
        protected openByAudioUrls: (string[]) | (() => string[]);
        /**真正加载的音效 */
        protected audioUrls: string[];
        /**打开ui时的url */
        url: string;
        /**打开ui时 传入的数据 */
        _openData: any;
        /**关闭ui时 给UImgr关闭回调 传入的数据 */
        _closeData: any;
        /**只是预加载ui 位置移到屏幕以外 */
        __openShow: any;
        private _isOnCreate;
        private _onCreateByUpdateCb;
        onLoad(): void;
        _onCreate(): void;
        private _onCreateByUpdate;
        updateOpenShow(): void;
        _onOpen(): void;
        private onDelayLoadAudios;
        _onClose(): void;
        _onDispose(): void;
        onClickCloseUI(e?: _cc_.EventTouch, param?: "destroy" | ""): void;
        private onClickCloseUI2;
        closeUI(destroy?: boolean): void;
        getMaskOpacityUI(): _cc_.Node;
        /**当前进入次数 */
        getOpenCount(): number;
        /**第一次创建ui时 添加到场景后 onLoad之后 */
        protected onCreate?(): void;
        /**显示在界面上时 onEnable之后 */
        protected onOpen?(): void;
        /**隐藏和销毁时 清理数据 onDisable之前 */
        onBeforeClose?(): void;
        /**隐藏和销毁时 清理数据 onDisable之后 */
        protected onClose?(): void;
        /**销毁 从场景移除时 */
        protected onDispose?(): void;
        /**每帧执行 */
        protected onUpdate?(): void;
        /**编辑器 onLoad时执行 */
        protected onEditorByOnLoad?(): void;
        /**自带关闭 按下之前 */
        protected onCloseUIClickBefore?(): void;
    }
}
 namespace apeng {
    interface IDialogueBtn {
        /**按钮文字 */
        text: string;
        /**默认黑色 black */
        color?: "red" | "black" | "darkBlue";
        onClick?: () => void;
    }
    class Dialogue extends BaseComponent {
        private cLabelContent;
        private cLabelLeft;
        private cLabelRight;
        private cLabelCenter;
        private btn;
        private rightBtn;
        onLoad(): void;
        init(content: string, btn: IDialogueBtn, rightBtn?: IDialogueBtn): void;
        private setBtnData;
        private onClickLeft;
        protected onClick(): void;
        private onClickRight;
        private onClickCenter;
    }
}
 namespace apeng {
    class FlyEffect extends BaseComponent {
        private cAItems;
        private loadDir;
        init(start: IVector2, end: IVector2, iconUrl: string, itemUrl: string, itemCount?: number | (number[]), cb?: () => void): void;
    }
}
 namespace apeng {
    class FlyEffectItem extends BaseComponent {
        private cb;
        private count;
        private v3T2;
        init(iconUrl: string, end: IVector2, cb: () => void, count: number): void;
    }
}
 namespace apeng {
    class LoadingScreen extends BaseComponent {
        private _isVisible;
        state: ETipWhiteState;
        showCb: () => void;
        onLoad(): void;
        onUpdate(): void;
        init(visible: boolean): void;
    }
}
 namespace apeng {
    class LoadingWait extends BaseComponent {
        private isScene;
        private clickClose;
        private cLabelTip;
        private tipIndex;
        state: ETipWaitState;
        completeCb: () => void;
        onLoad(): void;
        onUpdate(): void;
        /**
         *
         * @param clickClose
         * @param progress
         * @param duration 持续的时间
         */
        init(visible: boolean, clickClose?: boolean, progress?: () => number, duration?: number): void;
        protected setNodeActive(visible: boolean): void;
        protected onClick(): void;
    }
}
 namespace apeng {
    class MoveUpItem extends BaseComponent {
        init(startWorldPosition: IVector2, text: string, iconUrl?: string, complete?: () => void): void;
    }
}
 namespace apeng {
    class Tip extends BaseComponent {
        private cb;
        onLoad(): void;
        init(str: string, closeCb?: () => void): void;
        put(): void;
        private onLabelSize;
    }
}
 namespace apeng {
    class TipClick extends BaseComponent {
        private cb;
        onLoad(): void;
        init(str: string, closeCb?: () => void): void;
        onClick(): void;
    }
}
 namespace apeng {
    class TipTitleClick extends BaseComponent {
        private cLabel_downTip;
        private cb;
        private get spriteEnableFadeInCC();
        onLoad(): void;
        init(datas: (ITipTitleClickItemRight | string)[], title?: string, closeCb?: () => void, showDot?: boolean, autoClose?: boolean, downTip?: string): void;
        onClick(): void;
    }
}
 namespace apeng {
    interface ITipTitleClickItemRight {
        curStrColor?: _cc_.Color;
        curStr: string;
        rightColor?: _cc_.Color;
        rightStr: string;
    }
    class TipTitleClickItem extends BaseComponent {
        private cLabel_right;
        init(data: ITipTitleClickItemRight | string, dotVisible: boolean, horizontalCenter: boolean): void;
    }
}
 namespace apeng {
    enum EP2ShapeTypeCC {
        None = 0,
        Circle = 1,
        Point = 2,
        /**只能是凸多边形 */
        Polygon = 3,
        Box = 4,
        Plane = 5,
        Line = 6,
        Heightfield = 7
    }
    export class P2ShapeEditorCC extends BaseComponent {
        readonly EventType: {
            LERP_POS_COMPLETE: string;
        };
        backupDescribe: string;
        /**开启碰撞框调试 */
        static debug: boolean;
        mass: number;
        trigger: boolean;
        velocity: _cc_.math.Vec2;
        velocityScale: number;
        damping: number;
        fixedX: boolean;
        fixedY: boolean;
        fixedRotation: boolean;
        angularVelocity: number;
        angularDamping: number;
        editorColor: _cc_.math.Color;
        editorLineWidth: number;
        runEditorShow: boolean;
        tag: string;
        set shapeType(value: EP2ShapeTypeCC);
        get shapeType(): EP2ShapeTypeCC;
        set heightfieldLength(value: number);
        get heightfieldLength(): number;
        set heightfields(value: number[]);
        get heightfields(): number[];
        shapePanle: string;
        set lineLength(value: number);
        get lineLength(): number;
        set circleRadius(value: number);
        get circleRadius(): number;
        set circleLength(value: number);
        get circleLength(): number;
        set boxSize(value: _cc_.math.Size);
        get boxSize(): _cc_.math.Size;
        set poygonPoints(value: _cc_.math.Vec2[]);
        get poygonPoints(): _cc_.math.Vec2[];
        set shapeOffset(value: _cc_.math.Vec2);
        get shapeOffset(): _cc_.math.Vec2;
        set useNodeSize(value: boolean);
        get useNodeSize(): boolean;
        private bodyNodeOffset;
        private syncNodePosition;
        private syncNodePositionLerp;
        private syncNodeAngle;
        receiveMaterial: boolean;
        openMaterial: boolean;
        private materialFriction;
        private materialFrictionRelaxation;
        private materialFrictionStiffness;
        private materialRelaxation;
        private materialRestitution;
        private materialStiffness;
        private materialSurfaceVelocity;
        private materialContactSkinSize;
        private _shapeType;
        private _useNodeSize;
        private _circleRadius;
        private _lineLength;
        private _heightfieldLength;
        private _circleLength;
        private _boxSize;
        private _shapeOffset;
        private _poygonPoints;
        private _heightfields;
        protected onEditorUpdateData: () => void;
        shape: p2.Shape;
        body: P2Body;
        _lerpBodyPos: Vector2;
        /**形状宽度 */
        areaWidth: number;
        lerpBodyPosLowRatio: number;
        /**很慢的插值跟随点 */
        lerpBodyPosLow: Vector2;
        isCreateBody: boolean;
        private lastBodyAngle;
        /**开启的所有 材质实例 */
        openMaterials: P2ContactMaterial[];
        onLoad(): void;
        private updateNodeSize;
        onFocusInEditor(): void;
        onLostFocusInEditor(): void;
        onEnable(): void;
        protected onUpdate(): void;
        updateCCGraphics(): void;
        private getGraphics;
        createBody<T extends number>(p2Group: P2Group<T>, type: T): P2Body;
        private groupParam;
        updateOffset(x: number, y: number): void;
        updateTransform(isPos: boolean, isScale: boolean, isAngle: boolean, scaleRatio?: number): void;
        getCurPos(): IVector2;
        lerpBodyPos(ratio: number): Vector2;
        setBodyVelocity(x: number, y: number): void;
        setBodyPos(x: number, y: number): void;
        setBodyAngle(angle: number): void;
        createContackMaterial(receive: P2ShapeEditorCC): P2ContactMaterial;
    }
    export {};
}
 namespace apeng {
    /**约束类型 */
    enum EP2ConstraintType {
        None = 0,
        /**旋转(围绕瞄点旋转)*/
        Revolute = 1,
        /**距离(保持固定距离) */
        Distance = 2,
        /**齿轮(使B同步A的角度) */
        Gear = 3,
        /**锁定(锁定AB的位置旋转) */
        Lock = 4,
        /**滑块(延直线移动) */
        Prismatic = 5,
        /**弹簧(直线) */
        SpringLinear = 6,
        /**弹簧(扭力) */
        SpringRotate = 7
    }
    /**
     * 关节
     */
    class P2ConstraintEditorCC extends BaseComponent {
        backupDescribe: string;
        shapeA: P2ShapeEditorCC;
        shapeB: P2ShapeEditorCC;
        set type(value: EP2ConstraintType);
        get type(): EP2ConstraintType;
        collideConnected: boolean;
        revolutePivot: _cc_.Node;
        distanceLength: number;
        gearAgnle: number;
        gearBMul: number;
        lockOffsetAngle: number;
        lockOffsetPosition: _cc_.math.Vec2;
        prismaticBRotate: boolean;
        prismaticMax: number;
        prismaticMin: number;
        springLength: number;
        springRotate: number;
        springStiffness: number;
        springDamping: number;
        private _type;
        body: P2Constraint | P2Spring;
        get spring(): P2Spring;
        get constraint(): P2Constraint;
        createBodyAfter(): void;
        /**创建约束 */
        createBody(): P2Constraint | P2Spring;
        private constraintParam;
        private springParam;
    }
}
 namespace apeng {
    class P2Group<T extends number> {
        private _enum;
        private config;
        private collider;
        constructor(_enum: any, config: {
            [type: number]: T[];
        });
        getGroup(type: T): {
            [type: number]: number;
        }[T];
        getMask(type: T): {
            [type: number]: number;
        }[T];
        getShapeParam<V>(type: T, obj: V): V;
        private parseCollider;
    }
}
 namespace apeng {
    interface IP2Data {
        _data_?: any;
    }
    interface P2Constraint extends p2.Constraint, IP2Data {
    }
    interface P2ContactMaterial extends p2.ContactMaterial, IP2Data {
        comp: P2ShapeEditorCC;
    }
    interface P2Spring extends p2.Spring, IP2Data {
    }
    interface P2Body extends p2.Body, IP2Data {
        comp: P2ShapeEditorCC;
        /**进入碰撞时 */
        enterCollider?: (other: P2Body) => void;
        /**回调一次就清除 */
        enterOnceCollider?: (other: P2Body) => void;
        /**结束碰撞时 */
        endCollider?: (other: P2Body) => void;
        endOnceCollider?: (other: P2Body) => void;
    }
    class P2World<T extends number> {
        readonly data: {
            /**重力 */
            gravity: [number, number];
            /**分组 */
            group: P2Group<T>;
            /**1秒 执行多少次 */
            fps: number;
            /**使用弹簧 */
            isSpringForces: boolean;
            /**使用阻力(衰减速度) */
            isDamping: boolean;
            /**使用重力 */
            isGravity: boolean;
            /**使用约束 */
            isSolveConstraints: boolean;
            /**摩擦力常数 默认使用重力长度 */
            frictionGravity?: number;
            /**接触摩擦力0~1 默认.5 */
            friction?: number;
            /**接触弹性0~1 默认0（光滑表面），1(相同速度反弹) */
            restitution?: number;
            /**松弛度(接触重合度) */
            relaxation?: number;
            /**触点硬度(刚度越小，物体的穿透力越大，接触的作用更像弹簧，而不是接触力) */
            stiffness?: number;
            /**摩擦刚度(产生摩擦力的刚度。在大多数情况下，此属性的值应该是一个大数字) */
            frictionStuffness?: number;
            /**摩擦松弛(由此产生的摩擦力的松弛。默认值应适用于大多数模拟) */
            frictionRelaxation?: number;
            /**接触偏移大小(堆叠渗透) */
            contactSkinSize?: number;
        };
        private static _idCounter;
        private id;
        _root: p2.World;
        private receiveMaterials;
        private openMaterials;
        private updateKey;
        private updateFps;
        constructor(data: {
            /**重力 */
            gravity: [number, number];
            /**分组 */
            group: P2Group<T>;
            /**1秒 执行多少次 */
            fps: number;
            /**使用弹簧 */
            isSpringForces: boolean;
            /**使用阻力(衰减速度) */
            isDamping: boolean;
            /**使用重力 */
            isGravity: boolean;
            /**使用约束 */
            isSolveConstraints: boolean;
            /**摩擦力常数 默认使用重力长度 */
            frictionGravity?: number;
            /**接触摩擦力0~1 默认.5 */
            friction?: number;
            /**接触弹性0~1 默认0（光滑表面），1(相同速度反弹) */
            restitution?: number;
            /**松弛度(接触重合度) */
            relaxation?: number;
            /**触点硬度(刚度越小，物体的穿透力越大，接触的作用更像弹簧，而不是接触力) */
            stiffness?: number;
            /**摩擦刚度(产生摩擦力的刚度。在大多数情况下，此属性的值应该是一个大数字) */
            frictionStuffness?: number;
            /**摩擦松弛(由此产生的摩擦力的松弛。默认值应适用于大多数模拟) */
            frictionRelaxation?: number;
            /**接触偏移大小(堆叠渗透) */
            contactSkinSize?: number;
        });
        onUpdate(): void;
        private colliderCall;
        setFps(fps: number): void;
        aabbQuery(out: P2Body[], aabb: p2.AABB, exclude?: (body: P2Body) => boolean): P2Body[];
        /**
         * 所有在圆形中的形状
         * @param out
         * @param circle
         * @returns
         */
        circleQuery(out: P2Body[], circle: ICircle, exclude?: (body: P2Body) => boolean): P2Body[];
        createBody(comp: P2ShapeEditorCC, type: T): P2Body;
        addBody(comp: P2ShapeEditorCC): void;
        removeBody(comp: P2ShapeEditorCC): void;
        createConstraint(comp: P2ConstraintEditorCC, typeA: T, typeB: T): P2Constraint | P2Spring;
        addConstraint(comp: P2ConstraintEditorCC): void;
        removeConstraint(comp: P2ConstraintEditorCC): void;
        createEditor(comp: BaseComponent, type: T): void;
        addEditor(comp: BaseComponent): void;
        removeEditor(comp: BaseComponent): void;
    }
}
 namespace apeng {
    export interface ICircle {
        x: number;
        y: number;
        radius: number;
    }
    type TCircleSet = ICircle | number;
    export class Circle implements ICircle {
        static TEMP: Circle;
        static set(self: Circle, x?: TCircleSet, y?: number, radius?: number): Circle;
        static create(x?: TCircleSet, y?: number, radius?: number): Circle;
        static clone(orgin: ICircle): Circle;
        /**判断当前园是否包含指定的点 */
        static contains(self: ICircle, point: IVector2): boolean;
        static intersectRect(circle: ICircle, rect: Rectangle): void;
        static intersectAABB(circle: ICircle, x1: number, y1: number, x2: number, y2: number): boolean;
        /**判断当前园是否与指定矩形相交 */
        static intersects(self: ICircle, other: ICircle): boolean;
        /**距中心点 */
        static mul(out: Circle, value: Circle, mul: number): Circle;
        x: number;
        y: number;
        radius: number;
        private _position;
        get position(): Vector2;
        set position(value: Vector2);
        constructor(x?: TCircleSet, y?: number, radius?: number);
        set(x?: TCircleSet, y?: number, radius?: number): this;
        intersects(other: ICircle): boolean;
        contains(point: IVector2): boolean;
        clone(): Circle;
        mul(out: Circle, mul: number): Circle;
        mulSelf(mul: number): Circle;
    }
    export {};
}
 namespace apeng {
    /**曲线 */
    class Curve {
        /**贝塞尔 */
        static readonly Bezier: {
            /**一维算法 */
            readonly vec1: {
                /**
                 * n-1阶贝塞尔
                 * @public	static
                 * @memberof Bezier
                 */
                gets(values: number[], ratio: number): number;
                /**
                 * 处理后半段值的缩放，
                 * 作用是 比率由大慢慢趋近于1
                 * @private
                 * @public	static
                 * @param {number} start
                 * @param {number} end
                 * @returns {number}
                 * @memberof Bezier
                 */
                erxiangshi(start: number, end: number): number;
                /**
                 * 二阶
                 * 公式算法 获取曲线上的点
                 * @param end1 第一个端点
                 * @param end2 第二个端点
                 * @param control 控制点
                 * @param time 0~1 运行的速率
                 */
                getControlByCurve(start: number, end: number, control: number, ratio: number): number;
                /**
                 * 公式 通过曲线上的点获取控制点
                 * 二阶
                 * @param end1
                 * @param end2
                 * @param curve
                 */
                getCurveByControl(start: number, end: number, curve: number, ratio: number): number;
                /**
                 * 三阶
                 * 公式算法 获取曲线上的点
                 * @param end1 第一个端点
                 * @param end2 第二个端点
                 * @param control 控制点
                 * @param control2 控制点2
                 * @param time 0~1 运行的速率
                 */
                getControlByCurve3(end1: number, end2: number, control: number, control2: number, time: number): number;
                /**
                 * 三阶
                 * 公式 通过曲线上的点获取第一个控制点
                 * @param end1
                 * @param end2
                 * @param curve
                 * @param control2 第二个控制点
                 */
                getCurveByControl3(end1: number, end2: number, curve: number, control2: number, time: number): number;
                /**
                 * 三阶
                 * 公式 通过曲线上的点获取第二个控制点
                 * @param end1
                 * @param end2
                 * @param curve
                 * @param control 第一个控制点
                 */
                get3CurveByControl2(end1: number, end2: number, curve: number, control1: number, time: number): number;
            };
            /**二维 */
            readonly vec2: {
                gets(out: IVector2, values: IVector2[], ratio: number): IVector2;
                getControlByCurve<T extends IVector2>(start: T, end: T, control: T, ratio: number, curve: T): T;
                getCurveByControl<T_1 extends IVector2>(start: T_1, end: T_1, curve: T_1, time: number, control: T_1): T_1;
                /**3阶贝塞尔 */
                getControlByCurve3<T_2 extends IVector2>(start: T_2, end: T_2, control: T_2, control2: T_2, ratio: number, curve: T_2): T_2;
                getCurveByControl3<T_3 extends IVector2>(start: T_3, end: T_3, curve: T_3, control2: T_3, time: number, control: T_3): T_3;
            };
            /**三维 */
            readonly vec3: {
                gets(out: IVector3, values: IVector3[], ratio: number): IVector3;
                getControlByCurve<T_4 extends IVector3>(start: T_4, end: T_4, control: T_4, ratio: number, curve: T_4): T_4;
                getCurveByControl<T_5 extends IVector3>(start: T_5, end: T_5, curve: T_5, time: number, control: T_5): T_5;
                /**3阶贝塞尔 */
                getControlByCurve3<T_6 extends IVector3>(start: T_6, end: T_6, control: T_6, control2: T_6, ratio: number, curve: T_6): T_6;
                getCurveByControl3<T_7 extends IVector3>(start: T_7, end: T_7, curve: T_7, control2: T_7, time: number, control: T_7): T_7;
            };
        };
        /**样条 */
        static readonly Spline: {
            /**一维算法 */
            readonly vec1: {
                /**
                 * 公式算法 需4个点
                 * @param p0
                 * @param p1
                 * @param p2
                 * @param p3
                 * @param tension 弹性弯曲弧度 0（正常）， 小于0（趋紧于直线）
                 * @param ratio 0～1比率
                 * @returns
                 */
                get(p0: number, p1: number, p2: number, p3: number, tension: number, ratio: number): number;
            };
            readonly vec2: {
                get<T extends IVector2>(p0: T, p1: T, p2: T, p3: T, tension: number, ratio: number, out: T): T;
            };
            readonly vec3: {
                get<T_1 extends IVector3>(p0: T_1, p1: T_1, p2: T_1, p3: T_1, tension: number, ratio: number, out: T_1): T_1;
            };
        };
    }
}
 namespace apeng {
    /**
     *  XMLHttpRequest 不可复用， hander重复叠加
     */
    class HttpRequest extends EventDispatcher {
        ip: string;
        path: string;
        private type;
        /**每次发送创建新的http */
        private sendCreateHttp;
        private encodeData?;
        private decodeData?;
        static readonly EventType: {
            /**请求进度 */
            PROGRESS: string;
            /**请求出错时 */
            ERROR: string;
            /**完成时 */
            COMPLETE: string;
            COMPLETE2: string;
            /**校验是否派发 COMPLETE  return false 不派发*/
            HAS_COMPLETE: string;
            /**校验是否派发 ERROR return false 不派发*/
            HAS_ERROR: string;
            /**开始请求 */
            START: string;
            /**服务器无响应 地址无效 */
            NONE: string;
        };
        private http;
        /**请求已完成 */
        isComplete: boolean;
        private data;
        private header;
        sendTime: number;
        version: string;
        get status(): number;
        constructor(ip: string, path: string, type: "POST" | "GET", 
        /**每次发送创建新的http */
        sendCreateHttp?: boolean, encodeData?: (obj: Object) => string, decodeData?: (value: string) => Object);
        send(data?: {
            [key: string]: any;
        }, header?: {
            [key: string]: string;
        }): void;
        /**使用上一次发送数据 重新请求 */
        reSend(): void;
        /**
         * @private
         * 请求错误的处理函数。
         * @param	message 错误信息。
         */
        protected error(message: string): void;
        /**
         * @private
         * 请求成功完成的处理函数。
         */
        protected complete(): void;
        dispose(): void;
        /**
         * @private
         * 清除当前请求
         */
        clearHttp(): void;
        private initHttp;
    }
}
 namespace apeng {
    class IntervalAnim {
        datas: number[];
        isAnim: boolean;
        private cb;
        private loopCb;
        private loop;
        loopCur: number;
        curIndex: number;
        private _dt;
        init(datas: number[], cb: (index: number, loopIndex: number) => void, loopCb: () => void): void;
        /**
         * 开启
         * @param loop 0循环，大于0指定次数
         * @param startIndex 开始索引
         */
        run(loop?: number, startIndex?: number): void;
        stop(): void;
        onUpdate(dt: number): void;
    }
}
 namespace apeng {
    class JumpBy {
        private node;
        private start;
        private position;
        private duration;
        private height;
        private jumps;
        private easeType;
        isAnim: boolean;
        private _dt;
        init(node: _cc_.Node): void;
        run(position: IVector2, duration: number, height: number, jumps: number, easeType?: EEaseType): void;
        onUpdate(dt: number): void;
    }
}
 namespace apeng {
    /**多边形 */
    class Polygon {
        /**
         * 获取多边形内的某一点
         * @param polygon 多边形
         * @param angle 角度
         * @param ratio 比率
         * @param maxDis 线段最大值
         */
        static getDot(polygon: Vector2[], dir: Vector2, ratio: number, maxDis: number): Vector2;
        /**转换为椭圆 求交 */
        static elliptic(rect: Rectangle, circle: Circle): boolean;
        /**
         * 矩形与圆是否相交
         * @param rect
         * @param circle
         */
        static rectCircle(rect: Rectangle, circle: Circle): boolean;
        /**
         * 一维空间中 两条线段是否相交
         * @param min1
         * @param max1
         * @param min2
         * @param max2
         */
        static oneLineLine(min1: number, max1: number, min2: number, max2: number): boolean;
        /**
          * 线段与线段是否相交
          * @param a1 第一条线段起点
          * @param a2 第一条线段终点
          * @param b1
          * @param b2
          */
        static lineLine(a1: IVector2, a2: IVector2, b1: IVector2, b2: IVector2): boolean;
        /**
     * 线段与矩形是否相交
     * @param a1 第一条线段起点
     * @param a2 第一条线段终点
     * @param b 矩形块
     */
        static lineRect(a1: Vector2, a2: Vector2, b: Rectangle): boolean;
        /**
         * 线段与多边形是否相交
         * @param a1
         * @param a2
         * @param b
         */
        static linePolygon(a1: IVector2, a2: IVector2, b: IVector2[]): boolean;
        /**
         * 矩形是否与线段相交
         * @param a
         * @param b
         */
        static rectPolygon(a: Rectangle, b: Vector2[]): boolean;
        /**
         * 多边形与多边形相交
         * @param a
         * @param b
         */
        static polygonPolygon(a: Vector2[], b: Vector2[]): boolean;
        /**
     * 多边形与圆形是否相交
     * @param polygon
     * @param circle
     */
        static polygonCircle(polygon: IVector2[], circle: Circle): boolean;
        /**线段与原相交 */
        static lineCircle(start: IVector2, end: IVector2, circle: Circle): boolean;
        /**
         * 点是否在多边形中
         * @param point
         * @param polygon
         */
        static pointInPolygon(point: IVector2, polygon: IVector2[]): boolean;
        /**
         * 计算点到直线的距离。如果这是一条线段并且垂足不在线段内，则会计算点到线段端点的距离
         * @param point 点
         * @param start 线段起点
         * @param end 线段终点
         * @param isSegment 是否为线段
         */
        static pointLineDistance(point: IVector2, start: IVector2, end: IVector2, isSegment: boolean): number;
        /**旋转矩形与旋转矩形 */
        static rectByAngle(a: Rectangle, b: Rectangle): boolean;
    }
}
 namespace apeng {
    /**进度合并 整理为1个 */
    class ProgressDir {
        /**当前进度 */
        private ratio;
        private ratioAll;
        private progressLength;
        private onProgress;
        constructor(onProgress: (ratio: number) => void);
        progress(url: string): (ratio: number, cocosRatio?: number) => void;
        getCurRatio(): number;
    }
}
 namespace apeng {
    class RandomSeed {
        static readonly pool: PoolOnce<RandomSeed>;
        private _data;
        private id;
        init(id: number): this;
        clear(): this;
        run(): number;
    }
}
 namespace apeng {
    /**
     * 动画转向 解决0~360度动画问题
     */
    class Rotate360Anim extends EventDispatcher {
        setAngle: (angle: number) => void;
        getAngle: () => number;
        static readonly EventType: {
            START: string;
            COMPLETE: string;
        };
        private _start;
        private _move;
        private _moveCur;
        isAnim: boolean;
        private lerpRatio;
        constructor(setAngle: (angle: number) => void, getAngle: () => number);
        /**由快到慢 插值动画 */
        lerpRun(to: number, ratio: number, cur?: number): void;
        stop(cur?: number): void;
        onUpdate(): void;
    }
}
 namespace apeng {
    class ScaleAnim extends EventDispatcher {
        static readonly EventType: {
            START: string;
            COMPLETE: string;
        };
        private node;
        private _to;
        isAnim: boolean;
        private lerpRatio;
        init(node: _cc_.Node): void;
        /**由快到慢 插值动画 */
        lerpRun(to: IVector3, ratio: number, cur?: IVector3): void;
        stop(cur?: IVector3): void;
        onUpdate(): void;
    }
}
 namespace apeng {
    interface IStateMackine<T> {
        data?: any;
        type: T;
        isLog?: boolean;
        onEnter?: (...value: any[]) => void;
        onUpdate?: () => void;
        onExit?: (...value: any[]) => void;
    }
    class StateMackine<T> extends EventDispatcher {
        static readonly EventType: {
            /**进入状态 回调前 state */
            ENTER_BEFORE: string;
            /**进入状态 回调后 state */
            ENTER_AFTER: string;
            /**进入状态 回调后 state 防止顺序执行*/
            ENTER_AFTER2: string;
            /**退出状态 回调前 state */
            EXIT_BEFORE: string;
            /**退出状态 回调后 state */
            EXIT_AFTER: string;
            /**清除状态机 */
            CLEAR: string;
        };
        /**外部存储数据 */
        data: any;
        /**当前状态 */
        state: T;
        /**上一个状态 */
        lastState: T;
        /**保存得状态 */
        _saveState: T;
        /**保存得上一次状态 */
        _saveLastState: T;
        /**已添加的所有状态 */
        private states;
        /**打印日志 */
        logPrefix: string;
        /**函数派发时得作用域 */
        caller: any;
        /**枚举对象 */
        enum: any;
        /**状态机的onUpdate执行时 会调用此update */
        update: () => void;
        isUpdate: boolean;
        constructor(values?: {
            _enum?: any;
            caller?: any;
            state?: T;
            logPrefix?: string;
            update?: () => void;
            states?: IStateMackine<T>[];
        });
        /**
         * 添加状态机
         * @param value
         */
        addState(value: IStateMackine<T>): this;
        getState<A extends IStateMackine<T>>(state: T): A;
        getCurState<A extends IStateMackine<T>>(): A;
        /**重置数据 */
        clear(): void;
        /**
         * 切换一个状态
         * @param state
         * @param args
         * @param emitEvent 默认派发事件
         * @param checkCur 当前状态不派发
         */
        change(state: T, args?: any[], emitEvent?: boolean, checkCur?: boolean): void;
        /**
         * 外部update接口调用
         * @param dt
         */
        onUpdate(): void;
        private converEnumK;
        private isValid;
        /**派发进入事件 */
        onEnter(args?: any[]): void;
        /**派发退出事件 */
        onExit(args?: any[]): void;
    }
}
 namespace apeng {
    class Strings {
        static indexOf(value: string, str: string, start?: number): number;
        static lastIndexOf(value: string, str: string): number;
        static after(value: string, find: string): string;
        static last(value: string, find: string): string;
        static converText(text: string): {
            after: string;
            last: string;
        };
        /**
         * 计算中文字符长度
         * 中文2个长度，英文1个长度
         * @param chars
         * @returns
         */
        static chinaLength(chars: string): number;
        /**截取中文字符的长度 */
        static chinaSub(chars: string, length: number): string;
        /**使用*号代替后面字符 */
        static blur(value: string, hideCount: number): string;
        /**
         * 替换字符
         * @param value
         * @param orgin 想要替换的
         * @param now 替换成
         * @param all 全部替换，反之第一个替换
         */
        static replace(value: string, orgin: string, now: string, all: boolean): void;
        /**
         * 创建加密的 key
         * @param value 0~9可乱序排列，一般 使用当前毫秒时间
         * @returns
         */
        static createCodeByKey(value: string): string;
        /**加密 */
        static encode(str: string, key: string): string;
        /**解密 */
        static decode(str: string, key: string): any;
        static compress(strNormalString: string): string;
        static decompress(strCompressedString: string): string;
    }
}
 namespace apeng {
    /**
     * 时间处理类
     *
     * @export
     * @class Times
     */
    class Times {
        static texts: {
            10001: string;
            10002: string;
            10003: string;
            10004: string;
            10005: string;
            10006: string;
            10007: string;
        };
        /**一天的总时间 毫秒 */
        static dayOnce: number;
        /**获取当前时间戳 外面赋值*/
        static get now(): number;
        static getDayOfYear(time: number): number;
        /**
         * 格式化时间
         * 2012/2/3 00:22:33
         * @param now
         * @returns
         */
        static toLocaleString(now?: number, hour?: boolean, interval?: string): string;
        /**
         * 格式化时间
         * 2012年2月3日 00:22:33
         * @param now
         * @returns
         */
        static toLocaleStringChina(now?: number): string;
        static getMonthOfYear(now?: number): number;
        static getDayOfMonth(now?: number): number;
        private static _console;
        static console(key: string): void;
        static consoleEnd(key: string, ...args: any[]): void;
        static get Date(): {
            /**获取年 */
            getFullYear(): number;
            /**月 */
            getMonth(): number;
            /**一月的第几天 */
            getDate(): number;
            /**一周的第几天 */
            getDay(): number;
            /**时 */
            getHours(): number;
            /**分 */
            getMinutes(): number;
            /**秒 */
            getSeconds(): number;
            /**获取本地时间 2017-01-10 22:52:37 */
            toLocaleString(): string;
            /**22:52:37 */
            toLocaleTimeString(): string;
            /**22:52:37 GMT+0800 (中国标准时间) */
            toTimeString(): string;
            setTime(time: number): number;
        };
        /**获取本月一共有多少天 */
        static getMontyByDay(): number;
        /**转换时间戳 utc 天 */
        static day(time?: number): number;
        /**转换时间戳 时 */
        static hour(time?: number): number;
        /**转换时间戳 分 */
        static minute(time?: number): number;
        static _secondCache: number;
        /**转换时间戳 秒 */
        static second(time?: number): number;
        /**
         * 格式化时间戳 utc时间 数字显示
         * @param time
         * @param hour 当小于 1小时时，显示 00:59:12 反之 59:12
         * @returns 00:00:00
         */
        static numHour(time?: number, hour?: boolean): string;
        /**一天中的第几小时 */
        static dayByHour(time?: number): number;
        /**
         * 格式化时间戳 数字显示(无转换)适用于倒计时
         * @param time
         * @returns 00:00:00
         */
        static numHourCountDown(time?: number, hour?: boolean): string;
        /**
         * 格式化时间戳 中文显示(无转换)适用于倒计时
         * @param time
         * @returns 1小时10分3秒
         */
        static chinaHourCountDown(time?: number, hour?: boolean): string;
        /**格式化时间戳 数字显示 @requires 00:00 */
        static numMinute(time?: number): string;
        /**格式化时间戳 数字显示 @requires 00 */
        static numSecond(time?: number): string;
        /** 格式化时间戳 中文显示 @requires 09时02分03秒 */
        static chinaHour(time?: number): string;
        /** 格式化时间戳 中文显示 @requires 09时02分*/
        static numHourAndMinute(time?: number): string;
        /** 格式化时间戳 中文显示 @requires 09时02分*/
        static chinaHourAndMinute(time?: number): string;
        /** 格式化时间戳 中文显示 @requires 02分03秒 */
        static chinaMinute(time?: number): string;
        /** 格式化时间戳 中文显示 @requires 03秒 */
        static chinaSecond(time?: number): string;
        /**小于10的数字加 0 */
        static converMinTen(num: number): string;
        /**获取当前天已过的时间 utc时间 */
        static getToDayNow(): number;
        /**当前天还剩余的 时间 毫秒 */
        static getToDayLeave(): number;
        /**获取时间戳的时间 到现在过了的天数 */
        static getToNowDay(lastTime: number): number;
        /**返回一天中剩余的时间 单位 秒 */
        static getOneDayLeftTime(): number;
        /**返回 当前周 是一年中的第几周 */
        static getWeekOfTheYear(): number;
        /**时间戳是当年的第几天  */
        static getDayOfTheYear(time: number): number;
        /**类时间戳 */
        private time;
        /**
         * 可传入时间戳，默认取当前时间戳
         * @param {number} [time]
         * @memberof Times
         */
        constructor(time?: number);
        /**
         * 相加
         * @param {number} time 毫秒
         * @memberof Times
         */
        add(time: number): Times;
        sub(time: number): Times;
        get now(): number;
        /**转换时间戳 天 */
        get day(): number;
        /**转换时间戳 时 */
        get hour(): number;
        /**转换时间戳 分 */
        get minute(): number;
        /**转换时间戳 秒 */
        get second(): number;
        get numHour(): string;
        get numMinute(): string;
        get numSecond(): string;
        get chinaHour(): string;
        get chinaMinute(): string;
        get chinaSecond(): string;
        converMinTen(): string;
    }
}
}