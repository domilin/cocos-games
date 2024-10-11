import { v3 } from "cc";

const sceneBuildIds = {
    cashDesk: 10015,
};

const handIndexs = {
    goCompose: 1,
    firstCompose: 2,
    secondCompose: 3,
    thirdCompose: 4,
    composeGetNew: 5,
    clickRoomNew: 6,
    clickRoomNew2: 7,
    composeMittens: 8,
    composeMittens2: 9,
    taskMittens: 10,
    btnBuild: 11,
    goBuildScene: 12,
    buildCashDesk: 13,
    buyCashDesk: 14,
    putCashDesk: 15,
    btnLvUp: 16,
    lvUpStart: 17,
    backComposeLayer: 18,
    composeCardLayer: 19,

    btnLvUp2: 20,
    btnLvUp3: 21,

    lvUpStart2: 22,
    shopOpen: 23,
    shopbuy: 24,
};

const handData: any = [
    null,
    {
        id: 1,
        content: "店长大人，这里还都乱糟糟的，快跟到这边来~",
    },
    {
        id: 2,
        content: "拖拽一个元素到相同元素身上，就能合成高级元素！我们来拖拽这个<color=#d7555a>【把手】</color>",
        dialogPos: v3(0, 300),
    },
    {
        id: 3,
        content: "再来试试<color=#d7555a>【箱盖】~</color>",
        dialogPos: v3(0, 300),
    },
    {
        id: 4,
        content: "有蜘蛛网的元素是不能移动的，但可以用来合成！",
        dialogPos: v3(0, 300),
    },
    {
        id: 5,
        content: "恭喜你获得了第一个发射器<color=#d7555a>【简单五金盒】</color>，点击发射器，合成任务所需物品吧！",
        // dialogBottom: 1,
    },
    {
        id: 6,
        content: "出现了带有闪电符号的工具箱，戳戳看里面有什么？",
        dialogPos: v3(0, -400),
    },
    {
        id: 7,
        content: "原来是<color=#d7555a>【螺丝刀】</color>，我们再试一次吧~",
        dialogPos: v3(0, -400),
    },
    {
        id: 8,
        content: "拖拽手套继续合成",
        dialogPos: v3(0, -400),
    },
    {
        id: 9,
        content: "接下来合成订单所需的手套！",
        dialogPos: v3(0, -400),
    },
    {
        id: 10,
        content: "合成了需要的手套，点击<color=#d7555a>【完成】</color>订单吧！",
        dialogBottom: 1,
    },
    {
        id: 11,
        content: "收集了我们需要的星星，点击左上角的清单~",
        dialogBottom: 1,
    },
    {
        id: 12,
        content: "我们先前往主界面，用星星购买<color=#d7555a>【前台】</color>吧！",
        dialogBottom: 1,
    },
    {
        id: 13,
        content: "点击<color=#d7555a>【气泡】</color>",
        dialogBottom: 1,
    },
    {
        id: 14,
        content: "来购买<color=#d7555a>【前台】</color>吧",
        dialogBottom: 1,
    },
    {
        id: 15,
        content: "点击<color=#d7555a>【绿色对钩】</color>，放置前台",
        dialogBottom: 1,
    },
    {
        id: 16,
        content: "哇塞，店长大人，我们升级了~快点点击<color=#d7555a>【等级按钮】！</color>",
        dialogBottom: 1,
    },
    {
        id: 17,
        content: "购买装饰物可获得经验，我们手动升级，获得奖励~",
        dialogBottom: 1,
    },
    {
        id: 18,
        content: "奖励去哪了？店长一起来看看吧",
    },
    {
        id: 19,
        content: "奖励领取到了<color=#d7555a>【棋盘通道】</color>里，点击放到棋盘里吧",
        dialogBottom: 1,
    },
    {
        id: 20,
        content: "",
        dialogBottom: 1,
    },

    {
        id: 21,
        content: "哇塞，店长大人，我们升级了~快点点击<color=#d7555a>【等级按钮】！</color>",
        dialogBottom: 1,
    },
    {
        id: 22,
        content: "购买装饰物可获得经验，我们手动升级，获得奖励~",
        dialogBottom: 1,
    },

    {
        id: 23,
        content: "店长大人，商店功能开启了",
        dialogBottom: 1,
        dialogPos: v3(0, -350),
    },

    {
        id: 24,
        content: "当棋盘上可合成的物品不足时，店长大人可以到<color=#d7555a>【商店】</color>里寻找哦！",
        dialogBottom: 1,
    },
];

export { handData, handIndexs, sceneBuildIds };

