
const jsb = (<any>window).jsb;

import { Asset, director, game, Label, Node, ProgressBar, _decorator } from 'cc';
import { Const } from '../../config/Const';
import { localText } from '../../config/localText';
import BaseView from '../../easyFramework/mgr/BaseView';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { RechargeManager } from '../../Util/RechargeManager';
const { ccclass, property } = _decorator;

enum HintBtnStatus {
    update,
    error,
}

@ccclass('HotUpdate')
export class HotUpdate extends BaseView {

    @property(Node)
    btnEnterGame: Node = null!;
    @property(Node)
    btnCheck: Node = null!;

    @property(Node)
    hintLayer: Node = null!;
    @property(Label)
    hintLayerMsgLabel: Label = null!;
    @property(Node)
    btnUpdate: Node = null!;
    @property(Label)
    btnUpdateLabel: Label = null!;

    @property(Label)
    infoLabel: Label = null!;
    @property(Label)
    versionLabel: Label = null!;

    @property(ProgressBar)
    sizeProgress: ProgressBar = null!;
    @property(Label)
    sizeLabel: Label = null!;
    @property(ProgressBar)
    fileProgress: ProgressBar = null!;
    @property(Label)
    fileLabel: Label = null!;

    @property(Asset)
    manifestUrl: Asset = null!;

    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';
    private _am: jsb.AssetsManager = null!;
    private _checkListener = null;
    private _updateListener = null;
    private _failCount = 0;
    private versionCompareHandle: (versionA: string, versionB: string) => number = null!;

    btnUpdateStatus: HintBtnStatus = HintBtnStatus.error;

    checkCb(event: any) {
        console.log('Code: ' + event.getEventCode());

        this._am.setEventCallback(null!);
        this._checkListener = null;
        this._updating = false;

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showHintLayer(localText.hotupdate.noLocalManifest);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showHintLayer(localText.hotupdate.remoteManifestError);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.infoLabel.string = localText.hotupdate.alreadyNew;
                // 自动进入初始场景
                this.onClickBtnEnterGame();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // let size = this.getSizeKB(this._am.getTotalBytes());
                // let msg = localText.hotupdate.newVersionHint.format(this._am.getRemoteManifest().getVersion(), size);
                // this.showHintLayer(msg, HintBtnStatus.update);
                this.infoLabel.string = localText.hotupdate.updating;
                // 直接更新
                this.hotUpdate();
                break;
            default:
                return;
        }

    }

    getSizeKB(bytes: number) {
        return Math.ceil(bytes / 1024);
    }

    updateCb(event: any) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showHintLayer(localText.hotupdate.noLocalManifest);
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.sizeProgress.progress = event.getPercent();
                this.fileProgress.progress = event.getPercentByFile();

                this.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.sizeLabel.string = this.getSizeKB(event.getDownloadedBytes()) + ' / ' + this.getSizeKB(event.getTotalBytes()) + "KB";

                this.sizeLabel.string = Math.floor(event.getPercent() * 1000) / 10 + "%";

                var msg = event.getMessage();
                if (msg) {
                    // this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showHintLayer(localText.hotupdate.remoteManifestError);
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.infoLabel.string = localText.hotupdate.alreadyNew;
                // 自动进入初始场景
                this.onClickBtnEnterGame();
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.infoLabel.string = localText.hotupdate.updateEnd;
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.showHintLayer(localText.hotupdate.updateFail.format(event.getMessage()));
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.showHintLayer(localText.hotupdate.updateFail.format(event.getAssetId() + "," + event.getMessage()));
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.infoLabel.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();

            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log("manifest search paths:" + JSON.stringify(newPaths));

            // 前置路径并去重
            searchPaths = newPaths.concat(searchPaths);
            let arr = [];
            for (let i in searchPaths) {
                let path = searchPaths[i];
                if (arr.indexOf(path) == -1) {
                    arr.push(path);
                }
            }
            searchPaths = arr;

            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            console.log("HotUpdateSearchPaths:" + JSON.stringify(searchPaths));

            this.infoLabel.string = localText.hotupdate.autoRestart;
            // 全部更新完毕，自动重启游戏
            this.scheduleOnce(() => {
                game.restart();
            }, 0.5);
        }
    }

    retry() {
        if (!this._updating && this._canRetry) {
            // this.panel.retryBtn.active = false;
            this._canRetry = false;

            // this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    }

    checkUpdate() {
        if (this._updating) {
            console.log("已检查更新，或者正在更新中...");
            return;
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.showHintLayer(localText.hotupdate.noLocalManifest);
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();
        this._updating = true;
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this.infoLabel.string = localText.hotupdate.updating;
            this._am.setEventCallback(this.updateCb.bind(this));

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    }

    showHintLayer(msg: string, status: HintBtnStatus = HintBtnStatus.error) {
        this.btnUpdateStatus = status;
        this.hintLayer.active = true;
        this.hintLayerMsgLabel.string = msg;
        switch (status) {
            case HintBtnStatus.update:
                this.btnUpdateLabel.string = localText.hotupdate.sureUpdate;
                break;
            case HintBtnStatus.error:
                this.btnUpdateLabel.string = localText.hotupdate.exitGame;
                break;
            default:
                break;
        }
    }

    show() {

    }

    onLoad() {
        // // test
        console.log("hotupdate 1")
        // this.scheduleOnce(() => {
        //     this.infoLabel.string = "调用充值接口";
        //     RechargeManager.RechargeTest();
        // }, 3);
        // return;
        director.loadScene("loading");
        return

        console.log("hotupdate 2")

        let appBuildVersion: any = localStorage.getItem('appBuildVersion');
        if (appBuildVersion) {
            Const.appBuildVersion = parseInt(appBuildVersion);
        }

        this.infoLabel.string = localText.hotupdate.checking;
        this.versionLabel.string = "";

        this.sizeLabel.string = "";
        this.fileLabel.string = "";
        this.sizeProgress.progress = 0;
        this.fileProgress.progress = 0;

        this.hintLayer.active = false;
        this.bindButton(this.btnUpdate, this.onClickBtnUpdate);

        this.bindButton(this.btnCheck, this.onClickBtnCheck);
        this.bindButton(this.btnEnterGame, this.onClickBtnEnterGame);

        if (!jsb) {
            this.node.active = false;
            director.loadScene("loading");
            return;
        }

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'jsf-remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        this.versionCompareHandle = function (versionA: string, versionB: string) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || '0');
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        this._am.setVerifyCallback(function (path: string, asset: any) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;

            let fileData = jsb.fileUtils.getDataFromFile(path);
            let md5Str = UtilPub.md5(fileData);
            // console.log("file  md5:" + expectedMD5);
            // console.log("check md5:" + md5Str);
            if (md5Str != expectedMD5) {
                // md5验证失败
                console.log("file  md5:" + expectedMD5);
                console.log("check md5:" + md5Str);
                console.log(relativePath + " md5 check fail.");
                return false;
            }

            return true;
        });

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            this._am.loadLocalManifest(url);
        }

        this.versionLabel.string = this._am.getLocalManifest().getVersion();
        Const.hotupdateVersion = this._am.getLocalManifest().getVersion();

        this.onClickBtnCheck();
    }

    onDestroy() {
        if (this._updateListener) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
        }
    }

    onClickBtnUpdate() {
        director.loadScene("loading");
        return
        switch (this.btnUpdateStatus) {
            case HintBtnStatus.update:
                this.hotUpdate();
                break;
            case HintBtnStatus.error:
                //game.end();
                director.loadScene("loading");
                break;
            default:
                break;
        }
        this.hintLayer.active = false;
    }

    onClickBtnCheck() {
        this.checkUpdate();
    }

    onClickBtnEnterGame() {
        director.loadScene("loading");
    }

}
