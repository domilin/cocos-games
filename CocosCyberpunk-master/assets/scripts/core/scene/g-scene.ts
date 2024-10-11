import { Director, director, find, instantiate, Node, Prefab, resources, Scene } from "cc";
import { Msg } from "../msg/msg";
import { ILoadMsg } from "../../logic/ui/ui-loading";
import { ResCache } from "../res/res-cache";
import { HrefSetting } from "../../../../extensions/pipeline/pipeline/settings/href-setting";

export class GScene {

    public static isLoadScene = false;

    public static isPreload = false;

    public static msg: ILoadMsg = {
        id: 100,
        action: 'load scene',
        current: '',
        wait_count: 1,
        count: 1,
    }


    public static Load (name: string, onload: () => void) {
        GScene.isLoadScene = true;
        /*
        this.msg.current = name;
        this.msg.wait_count = 1;
        this.msg.count = 1;
        Msg.emit('msg_loading',this.msg);
        */

        director.loadScene(name, async (error: Error | null, scene?: Scene) => {
            if (error) {
                throw new Error(`Load Scene Error.`);
            }
            if (scene) {
                if (HrefSetting.fullScene) {
                    await new Promise(resolve => {
                        resources.load(['prefabs/mesh-details'], (err, prefabs) => {
                            let detail = instantiate(prefabs[0] as Prefab)
                            let root = find('scene-root/mesh-root')
                            detail.parent = root

                            let manager = root.getComponent('NodeIDManager') as any
                            manager.registerRoot(detail);

                            resolve(null)
                        })
                    })
                }

                onload();
                GScene.isLoadScene = false;
                ResCache.Instance.removeLoad();

                //this.msg.count--;
            } else {
                console.warn('Can not load scene. - ' + name);
            }
        });
    }

}