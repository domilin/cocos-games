const fs = require('fs');
const path = require('path');

const { join } = require('path');
const { run, parse } = require("./csv")

module.exports = {
    // 监听面板事件
    listeners: {
        // 面板显示的时候触发的钩子
        show() {
            console.log("文件：")
        },
        // 面板隐藏的时候触发的钩子
        hide() {
        }
    },
    // 面板上的方法
    methods: {

    },
    // 面板的内容
    template: fs.readFileSync(join(__dirname, './index.html'), 'utf8'),
    // 面板上的样式
    // style: readFileSync(join(__dirname, './index.css'), 'utf8'),
    // 快捷选择器
    $: {
        csvDir: ".csvDir",
        jsonOutDir: ".jsonOutDir",
        btnGen: ".blue",

        csvDir2: ".csvDir2",
        jsonOutDir2: ".jsonOutDir2",
        btnGen2: ".blue2",

        csvDir3: ".csvDir3",
        jsonOutDir3: ".jsonOutDir3",
        btnGen3: ".blue3",
    },
    // 面板启动后触发的钩子函数
    ready() {
        console.log("打开 csv_to_json 插件成功")

        // let outPutConfig = parse(Editor.Project.path, "导表输出配置")

        this.$.jsonOutDir.value = Editor.Project.path + "/assets/main/config"
        this.$.csvDir.value = Editor.Project.path + "/config"
        
        this.$.jsonOutDir2.value = Editor.Project.path + "/assets/main/config"
        this.$.csvDir2.value = Editor.Project.path + "/config2"

        this.$.jsonOutDir3.value = Editor.Project.path + "/assets/main/config"
        this.$.csvDir3.value = Editor.Project.path + "/config3"

        let click = (csvDir, configName) => {
            let jsonDir =  this.$.jsonOutDir.value
            console.log("点击生成按钮")
            if (!csvDir
                || !jsonDir
                || (jsonDir == csvDir)
            )
                return
            console.log(`${csvDir} 开始生成`)
            let outPath = run("", csvDir, jsonDir,undefined,configName)
            let outPath2 = path.relative(Editor.Project.path, outPath)
            console.log("导出配置成功 " + outPath + "----" + outPath2)
            if (!outPath2.startsWith('..'))
                Editor.Message.request('asset-db', 'refresh-asset', `db://${outPath2}`)
        }

        this.$.btnGen.addEventListener('confirm', () => {
            click(this.$.csvDir.value, "configs")
        })
        this.$.btnGen2.addEventListener('confirm', () => {
            click(this.$.csvDir2.value, "configs2")
        })

        this.$.btnGen3.addEventListener('confirm', () => {
            click(this.$.csvDir3.value, "configs3")
        })
    },
    // 面板准备关闭的时候会触发的函数，return false 的话，会终止关闭面板
    beforeClose() {
    },
    // 面板关闭后的钩子函数
    close() {
        console.log("关闭 csv_to_json 插件窗口")
    },


}
