
const fs = require('fs');
const path = require('path');

function loadCsv(csvPath, fileName) {
    try {
        let fileUrl = path.join(csvPath, fileName) + ".csv"
        let data = fs.readFileSync(fileUrl, "utf8")
        // // 转为中文编码
        data = data.toString("gb2312")
        data = data.replace(/\r/g, '')
        return data
    } catch (error) {
        console.log("读取错误", csvPath, fileName, error)
        return ""
    }

}

function parse(csvPath, fileName, englishName) {
    let csvData = loadCsv(csvPath, fileName)
    let lines = csvData.split('\n')
    let titles = lines[1].split(',').filter(it => it.length > 0)
    lines = lines.slice(2)
    lines = lines.filter(it => it.length > 0 && it.split(',')[0].length > 0)

    let isLanguage = englishName && englishName.indexOf("language") != -1

    let outs = {}

    let col = -1
    for (let it of lines) {
        col++
        let ret = {}
        let datas = it.split(',')
        titles.forEach((title, tidx) => {
            if (title.length > 0) {
                let value = datas[tidx]

                if (isNaN(value)) {
                    if (!value)
                        console.error("失败 表名:" + fileName + ", 列:" + col + ", 行:" + tidx)
                    if (value.indexOf(";") != -1) {
                        value = value.split(";")
                        for (let i = 0; i < value.length; i++) {
                            let _value = Number(value[i])
                            if (!isNaN(_value))
                                value[i] = _value
                        }
                        ret[title] = value
                    }
                    else {
                        // 多语言 解析英文 替换符号
                        if (isLanguage) {
                            if (title === "english") {
                                value = value.replace(/，/g, ",")
                                value = value.replace(/；/g, ";")
                            }
                        }

                        ret[title] = value
                    }
                }
                else {
                    if (value !== "")
                        ret[title] = Number(value)
                    else
                        ret[title] = ""
                }
            }
        })
        outs[ret.id] = ret
        delete ret.id
    }
    return outs
}
function run(encodeKey, csvPath, jsonPath, createNoRepeatStr,confgiName="configs") {

    let map = parse(csvPath, "A数值表中英文对照")
    console.log(map)
    let datas = {}
    for (let key in map) {
        let chineseName = map[key].chinese
        let englishName = map[key].english
        if (chineseName && englishName) {
            englishName = encode(englishName, encodeKey)
            datas[englishName] = compress(parse(csvPath, chineseName, englishName), encodeKey)
        }
    }
    // datas = deParse(datas, encodeKey)
    let outPath = jsonPath + "/"+confgiName+".txt"
    let str = JSON.stringify(datas)

    str = JSON.stringify(JSON.parse(str))

    // 生成不重复的文本文件 方便生成字体文件
    if (createNoRepeatStr) {

        let _text = ""
        let otherStr = loadCsv(csvPath, "A字体文本配置")
        for (let i = 0, length = otherStr.length; i < length; i++) {
            let _t = otherStr[i]
            if (_text.indexOf(_t) == -1)
                _text += _t
        }

        for (let i = 0, length = str.length; i < length; i++) {
            let _t = str[i]
            if (_text.indexOf(_t) == -1)
                _text += _t
        }
        fs.writeFileSync(jsonPath + "default.txt", _text)
    }

    fs.writeFileSync(outPath, str)

    return outPath
}


// 压缩
function compress(sources, encodeKey) {
    let obj = []
    // key
    let k = obj[0] = []
    let v = obj[1] = {}
    for (let key in sources) {
        let _v = sources[key]
        if (k.length == 0) {
            for (let _key in _v)
                // 加密key
                k.push(encode(_key, encodeKey))
        }

        v[key] = []
        for (let _key in _v) {
            v[key].push(_v[_key])
        }
    }
    return obj
}

/**
 * 创建加密的 key
 * @param value 0~9可乱序排列，一般 使用当前毫秒时间
 * @returns 
 */
function createCodeByKey(value) {
    let nums = []
    let arr = (value + "").split("")
    for (let _arr of arr) {
        let __arr = Number(_arr)
        if (nums.indexOf(__arr) == -1)
            nums.push(__arr)
    }
    for (let i = 0; i < 10; i++)
        if (nums.indexOf(i) == -1)
            nums.push(i)

    //定义密钥，36个字母和数字
    return "AECDHFIJKLQMNOBPRXSTUVZWYG" + nums.join("")
}

/**加密 */
function encode(str, key) {
    if (!key)
        return str
    key = createCodeByKey(key)
    //定义密钥，36个字母和数字
    let len = key.length  //获取密钥的长度
    let a = key.split("")  //把密钥字符串转换为字符数组
    let s = "", b, b1, b2, b3  //定义临时变量
    for (let i = 0, strLen = str.length; i < strLen; i++) {  //遍历字符串
        b = str.charCodeAt(i)  //逐个提取每个字符，并获取Unicode编码值
        b1 = b % len  //求Unicode编码值得余数
        b = (b - b1) / len  //求最大倍数
        b2 = b % len  //求最大倍数的于是
        b = (b - b2) / len  //求最大倍数
        b3 = b % len  //求最大倍数的余数
        s += a[b3] + a[b2] + a[b1]  //根据余数值映射到密钥中对应下标位置的字符
    }
    return s //返回这些映射的字符
}

/**解密 */
function decode(str, key) {
    if (!key)
        return str
    key = createCodeByKey(key)
    //定义密钥，36个字母和数字
    let len = key.length  //获取密钥的长度
    let b, b1, b2, b3, d = 0, s  //定义临时变量
    b = Math.floor(str.length / 3)  //获取数组的长度
    s = new Array(b)  //计算加密字符串包含的字符数，并定义数组
    for (let i = 0; i < b; i++) {  //以数组的长度循环次数，遍历加密字符串
        b1 = key.indexOf(str.charAt(d))  //截取周期内第一个字符串，计算在密钥中的下标值
        d++
        b2 = key.indexOf(str.charAt(d))  //截取周期内第二个字符串，计算在密钥中的下标值
        d++
        b3 = key.indexOf(str.charAt(d))  //截取周期内第三个字符串，计算在密钥中的下标值
        d++
        s[i] = b1 * len * len + b2 * len + b3  //利用下标值，反推被加密字符的Unicode编码值
    }
    b = String.fromCharCode(...s) // 用fromCharCode()算出字符串
    return b;  //返回被解密的字符串
}
// 解压缩
function deParse(sources, encodeKey) {
    let obj = {}
    for (let key in sources) {
        let value = null
        if (key.indexOf("language") != -1) {
            value = sources[key][1]
            for (let _k in value) {
                for (let i = 0; i < value[_k].length; i++) {
                    let v = value[_k][i]
                    if (v && typeof v == "string")
                        value[_k][i] = (v).replaceAll('\\n', '\n')
                    else
                        value[_k][i] = v + ""
                }
            }
        }
        else {
            value = {}
            let k = []
            for (let _k of sources[key][0])
                k.push(decode(_k, encodeKey))
            let v = sources[key][1]
            for (let _k in v) {
                value[_k] = {}
                for (let i = 0; i < k.length; i++)
                    value[_k][k[i]] = v[_k][i]
            }
        }
        obj[decode(key, encodeKey)] = value
    }
    return obj
}

module.exports = { run, parse }