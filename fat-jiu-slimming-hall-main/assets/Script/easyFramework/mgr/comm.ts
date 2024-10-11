
import { Button, Component, instantiate, Label, Node, Prefab, ProgressBar, RichText, sp, Sprite, SpriteFrame, tween, Tween, UITransform, v3, view, _decorator } from "cc";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { WidgetType } from "../../config/global";
import { AnimationCtrl } from "../../game/comm/AnimationCtrl";
import { ScrollViewUtil } from "../../game/comm/ScrollViewUtil";
import { UtilPub } from "../utils/UtilPub";
import { audioManager } from "./audioManager";
import { Notifications } from "./notifications";
import { poolManager } from "./poolManager";
const { ccclass, property } = _decorator;

@ccclass('comm')
export class comm extends Component {
    protected _clickEnable: boolean = true; // 控制能否点击的变量
    calTime: number = 0
    aniTween: Tween<any> = new Tween()
    public _layerData: any = {};

    async delayTime(time: number) {
        return new Promise<void>(resolve => {
            tween(this.node).delay(time).call(() => {
                resolve();
            }).start();
            // this.scheduleOnce(()=>{
            // 	resolve();
            // },time)
        })
        // return new Promise(resolve=>{
        // 	this.scheduleOnce(()=>{
        // 		resolve();
        // 	},time)
        // })
    }

    gameStop() {
        //游戏暂停
    }

    gameResume() {
        //游戏继续
    }


    /**
     * 添加事件
     * @param {string} eKey     识别key
     * @param {object} eCall    回调函数
     * @param {object} self     识别对象
     */
    protected on(eKey: string, eCall: any, self?: Object | undefined) {
        Notifications.on(eKey, eCall, self ? self : this);
    }
    protected off(eKey: string, eCall: Object, self?: undefined) {
        Notifications.off(eKey, eCall);
    }
    /**
     * 通知事件
     * @param {string} eKey     识别key
     * @param parameters {}, {} 对象
     */
    protected emit(eKey: string, ...parameters: any[]) {
        let a = Notifications.emit(eKey, ...parameters);
        if (a) {
            return a;
        }
    }
    /**
     * 绑定按钮点击事件,永久监听
     * @param node 挂载了button组件的节点
     * @param callback 回调
     * @param opname 操作内容
     */
    protected bindButton(node: Node, callback: (event?: any) => void, opname?: string): void {
        let btnComp = node.getComponent(Button);
        if (!btnComp) {
            btnComp = node.addComponent(Button);
            btnComp.transition = Button.Transition.SCALE
        }
        btnComp.zoomScale = 0.9;
        let btnCb = (event: any) => {
            audioManager.instance.playSound(Const.Audio.btn)
            this.emit(GD.event.canvasTouchEvent)
            if (!this._clickEnable) return;
            this._clickEnable = false;
            this.scheduleOnce(() => {
                this._clickEnable = true;
            }, 0.3);
            callback.call(this, event);
        };
        node.on("click", btnCb, this);
    }

    /**
     * 绑定按钮点击事件,永久监听
     * @param node 挂载了button组件的节点
     * @param callback 回调
     * @param opname 操作内容
     */
    protected bindButtonNoAudio(node: Node, callback: (event?: any) => void, opname?: string): void {
        let btnComp = node.getComponent(Button);
        if (!btnComp) {
            btnComp = node.addComponent(Button);
            btnComp.transition = Button.Transition.SCALE
        }
        btnComp.zoomScale = 0.9;
        let btnCb = (event: any) => {
            // audioManager.instance.playSound(Const.Audio.btn)
            this.emit(GD.event.canvasTouchEvent)
            if (!this._clickEnable) return;
            this._clickEnable = false;
            this.scheduleOnce(() => {
                this._clickEnable = true;
            }, 0.3);
            callback.call(this, event);
        };
        node.on("click", btnCb, this);
    }

    /**
     * 绑定按钮点击事件(只监听一次)
     * @param node 挂载了button组件的节点
     * @param callback 回调
     * @param opname 操作内容
     */
    protected bindButtonOce(node: Node, callback: (event?: any) => void, opname?: string): void {
        let btnComp = node.getComponent(Button);
        if (!btnComp) {
            btnComp = node.addComponent(Button);
            btnComp.transition = Button.Transition.SCALE
        }
        btnComp.zoomScale = 0.9;
        let btnCb = (event: any) => {
            if (!this._clickEnable) return;
            this._clickEnable = false;
            this.emit(GD.event.canvasTouchEvent)
            this.scheduleOnce(() => {
                this._clickEnable = true;
            }, 0.3);
            callback.call(this, event);
        };
        node.once("click", btnCb, this);
    }

    /**
     *
     * @param url 预制体的路径
     * @param next 回调,返回预制体的主脚本
     */
    // showUI(url, next?) {
    //     MgrView.showUI(url, next);
    // }
    // protected setBtnEnable(btnNode: Node, isEnable: boolean) {
    //     let btnComp = btnNode.getComponent(Button);
    //     if (btnComp) {
    //         btnComp.enabled = isEnable;
    //         if (isEnable) {
    //             btnNode.color = Color.WHITE;
    //         } else btnNode.color = Color.GRAY;
    //     } else console.trace("BaseView setBtnEnable, no btn comp");
    // }

    // protected closeSelf() {
    //     AD.clearBanner();
    //     AD.destroyBanner();
    //     //Public.log('关闭了什么界面',this.node.name)
    //     this.node.destroy();
    // }

    /**
     * 震动
     */
    // protected shock() {
    //     if (WD.isOpenShake() && ChannelMgr.isWechatGame()) {
    //         //Public.log('震动')
    //         ChannelMgr.vibrateLong();
    //     }
    // }

    onDestroy() {
        Notifications.offTarget(this);
    }

    /**
     * 加载预制体，UI都用这个方法
     * @param cPrefab 要生成的预制体
     * @param cNode 父节点
     * @param next 返回预制体的主脚本
     */
    showUI(cPrefab: Prefab, cNode: Node, next?: { (comp: any): void; (arg0: Node | Component | null): any; }) {
        let node: Node = instantiate(cPrefab);
        node.parent = cNode;
        next && next(node.getComponent(node.name) ? node.getComponent(node.name) : node);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    addSpine(resPath: string, parentNode: Node, cb?: (err: any, aniCtrl: AnimationCtrl) => void) {
        UtilPub.loadSpineSkeletonData(resPath, (err: any, skeletonData: sp.SkeletonData) => {
            if (err) {
                if (cb) {
                    // @ts-ignore
                    cb(err, null);
                }
                return;
            }

            let spineNode = new Node();
            let skeleton = spineNode.addComponent(sp.Skeleton);
            skeleton.premultipliedAlpha = false;
            skeleton.skeletonData = skeletonData;
            spineNode.parent = parentNode;
            let animationCtrl = spineNode.addComponent(AnimationCtrl)!;
            if (cb) {
                cb(null, animationCtrl);
            }
        });
    }

    setSpriteFrame(node: Sprite, framePath: string, cb: Function | undefined = null!, customSize: number = 0) {
        UtilPub.getPic(framePath, (sf: SpriteFrame) => {
            node.spriteFrame = sf
            if (customSize > 0) {
                this.setImageCustomSize(node.node, customSize)
            }
            cb && cb(node)
        })
    }

    setSpriteFrame2(node: Sprite, framePath: string, cb: Function = null!, customSize: number = 0) {
        UtilPub.getPic2(framePath, (sf: SpriteFrame) => {
            if (sf) {
                node.spriteFrame = sf
                cb && cb(node)

                if (customSize > 0) {
                    this.setImageCustomSize(node.node, customSize)
                }
                return;
            }
            // 重新加载默认图片
            this.setSpriteFrame(node, Const.resPath.icon + "prop_star", cb, customSize);
        })
    }

    setImageCustomSize(node: Node, size: number) {
        if (node && node.getComponent(UITransform)) {
            let width = node?.getComponent(UITransform)?.width
            let height = node?.getComponent(UITransform)?.height
            let scale = Math.min(size / width!, size / height!)
            let newWidth = width! * scale
            let newHeight = height! * scale
            node.getComponent(UITransform)!.width = newWidth
            node.getComponent(UITransform)!.height = newHeight
        }
    }

    scrollViewSetData(scrollViewNode: Node, arr: any, refreshItemFunc?: Function, data?: any, notResetPos?: boolean) {
        let scrollViewUtil = scrollViewNode.getComponent(ScrollViewUtil);
        if (!scrollViewUtil) {
            return;
        }
        scrollViewUtil.setData(arr, (itemUI: Node, item: any, index: number) => {
            if (refreshItemFunc) {
                refreshItemFunc(itemUI, item, index, data);
            }
            //  this.addButtonListener(itemUI);
        });
    }
    scrollViewRefreshList(scrollViewNode: Node) {
        let scrollViewUtil = scrollViewNode.getComponent(ScrollViewUtil);
        if (!scrollViewUtil) {
            return;
        }
        scrollViewUtil.refreshList();
    }
    scrollViewRefreshItemUI(scrollViewNode: Node, itemUI: Node, item?: any) {
        let scrollViewUtil = scrollViewNode.getComponent(ScrollViewUtil);
        if (!scrollViewUtil) {
            return;
        }
        // @ts-ignore
        scrollViewUtil.refreshIndex(itemUI.index, item);
    }
    scrollViewRefreshItemUIByIndex(scrollViewNode: Node, index: number, item?: any) {
        let scrollViewUtil = scrollViewNode.getComponent(ScrollViewUtil);
        if (!scrollViewUtil) {
            return;
        }
        scrollViewUtil.refreshIndex(index, item);
    }
    scrollViewScrollToItemUI(scrollViewNode: Node, itemUI: Node, time?: number) {
        // @ts-ignore
        this.scrollViewScrollToIndex(scrollViewNode, itemUI.index, time);
    }
    scrollViewScrollToIndex(scrollViewNode: Node, index: number, time?: number) {
        let scrollViewUtil = scrollViewNode.getComponent(ScrollViewUtil);
        if (!scrollViewUtil || index == undefined) {
            return;
        }
        scrollViewUtil.scrollToIndex(index, time);
    }

    setScrollViewData(scrollViewNode: Node, arr: any, temp: Node, refreshItemFunc?: Function, data?: any) {
        scrollViewNode.removeAllChildren()
        arr.forEach((element: any, index: number) => {
            let item = instantiate(temp)
            item.position = v3(0, 0, 0)
            scrollViewNode.addChild(item)
            if (refreshItemFunc) {
                refreshItemFunc(item, element, index, data);
            }
        });
    }

    setString(node: Node | null, str: string | number) {
        if (!node) {
            UtilPub.error("setString error:" + str);
            return;
        }
        let label: any = node.getComponent(Label);
        if (!label) {
            label = node.getComponent(RichText);
        }
        label.string = str + "";
    }

    setProgressBar(progressBar: Node | ProgressBar, percent: number) {
        if (progressBar instanceof Node) {
            progressBar = progressBar.getComponent(ProgressBar)!;
        }
        if (progressBar) {
            if (percent < 0) {
                percent = 0;
            }
            if (percent > 1) {
                percent = 1;
            }
            progressBar.progress = percent;
        }
    }

    addPrefab(prefabPath: string, parent: Node, callback: Function | undefined = null!, args: any = null!) {
        UtilPub.getPrefab(prefabPath, (p: Prefab) => {
            let node = poolManager.instance.getNode(p, parent!)!
            let script = node.getComponent(node.name) as comm
            if (script && args) {
                script!._layerData = args
            }
            if (callback)
                callback(node)
        })
    }

    fitNodeWidgetY(node: Node, type: number, posy: number) {
        let windowSize = view.getVisibleSize();
        let resolute = view.getDesignResolutionSize()
        let scale = windowSize.width / resolute.width
        // if (windowSize.width / windowSize.height <= 720 / 1280) {
        //     scale = windowSize.width / resolute.width
        // } else {
        //     scale = windowSize.height / resolute.height
        // }
        scale = windowSize.height / resolute.height
        let height = node.getComponent(UITransform)!.height!
        let width = node.getComponent(UITransform)!.width!

        let y = node.position.y
        let x = node.position.x
        if (type & WidgetType.top) {
            y = windowSize.height / scale / 2 + posy - height / 2
        } else if (type & WidgetType.bottom) {
            y = 0 - windowSize.height / scale / 2 + posy + height / 2
        }
        // if (type & Const.WidgetType.left) {
        //     x = windowSize.height / scale / 2 + posy - height / 2
        // }else if(type & Const.WidgetType.right){
        //     y =  0 - windowSize.height / scale / 2 + posy + height / 2
        // }
        node.position = v3(x, y, node.position.z)

        // console.log("fitNodeWidget " + node.name, node.position.y)
    }

    addButtonHander(btnComponent: Node | Button, target: Node, com: string, hander: string, customEventData?: any) {
        if (btnComponent instanceof Button) {
        } else {
            if (btnComponent.getComponent(Button)) {
                btnComponent = btnComponent.getComponent(Button)!
            } else {
                btnComponent = btnComponent.addComponent(Button);
                btnComponent.transition = Button.Transition.SCALE;
            }
        }
        let eventHander = new Component.EventHandler();
        eventHander.target = target;
        eventHander.component = com;
        eventHander.handler = hander;
        eventHander.customEventData = customEventData;
        btnComponent.clickEvents = [eventHander];
    }

    clearButtonHander(btnComponent: Node | Button) {
        if (btnComponent instanceof Button) {
            btnComponent.clickEvents = [];
        } else {
            if (btnComponent.getComponent(Button)) {
                btnComponent.getComponent(Button)!.clickEvents = [];
            }
        }
    }

    createSprite(imgPath: string) {
        let node = new Node()
        let sprite = node.addComponent(Sprite)
        this.setSpriteFrame(sprite, imgPath)
        return node
    }


    toast(str: string) {
        this.emit(GD.event.showTip, { msg: str })
    }
}
