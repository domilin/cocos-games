/*
import { js, VERSION } from 'cc';

if (VERSION === '3.8.0') {
    const PlayMotionNode = js.getClassById('cc.animation.PoseNodePlayMotion');
    PlayMotionNode.prototype.__callOnAfterDeserializeRecursive = function (this: { motion?: { callOnAfterDeserializeRecursive (): void; } }) {
        this.motion?.__callOnAfterDeserializeRecursive();
    };
}
*/