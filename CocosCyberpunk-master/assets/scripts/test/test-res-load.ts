import { _decorator, Component, JsonAsset, Node, Prefab, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_res_load')
export class test_res_load extends Component {

    start () {

        resources.load('data-res-cache', JsonAsset, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('load json:', res);
        });

        resources.load('actor/actor-boss_0', Prefab, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('load actor-boss_0:', res);
        });

    }

    update (deltaTime: number) {

    }
}

