import { _decorator, Component, Node,AudioSource,assert,game, director } from 'cc';
import { audioManager } from '../../easyFramework/mgr/audioManager';
const { ccclass, property } = _decorator;


@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(AudioSource)
    private _audioSource: AudioSource = null!;

    onLoad () {
        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        director.addPersistRootNode(this.node);
        this._audioSource = audioSource;
        audioManager.instance.init(this._audioSource);
    }

    onEnable () {
        // NOTE: 常驻节点在切场景时会暂停音乐，需要在 onEnable 继续播放
        // 之后需要在引擎侧解决这个问题
        // audioManager.instance.playMusicInit(true);

    }

}
