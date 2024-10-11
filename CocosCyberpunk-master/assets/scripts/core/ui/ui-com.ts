/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Button, Label, Node, Slider, Sprite, SpriteFrame, Toggle } from "cc";
import { Bind } from "../../logic/data/bind";
import { Sound } from "../audio/sound";
import { UtilNode } from "../util/util";
import { GMath } from "../util/g-math";
import { Msg } from "../msg/msg";
import { FilSmooth } from "./fil-smooth";
import { UIBind } from "./ui-bind";

UIBind.on('btn', (node: Node) => new BtnBase(node));
UIBind.on('txt', (node: Node) => new TxtBase(node));
UIBind.on('grp', (node: Node) => new GrpBase(node));
UIBind.on('spr', (node: Node) => new SprBase(node));
UIBind.on('sli', (node: Node) => new SliBase(node));
UIBind.on('tgl', (node: Node) => new TglBase(node));
UIBind.on('fil', (node: Node) => new FilBase(node));

export class UICom {

    protected _node: Node;

    constructor (node: Node) {
        this._node = node;
    }

    public on (): void { }

    public off (): void { }

    public refresh (): void { }

}

export class BtnBase extends UICom {
    private _name: string = '';
    private _btn: Button | null | undefined;
    constructor (node: Node) {
        super(node);
        let self = this;
        this._name = node.name;
        this._btn = self._node?.getComponent(Button);
        this._node?.on(Button.EventType.CLICK, () => {
            Bind.Instance.on(self._name);
            Sound.on('sfx_click');
        }, this);
    }
}

export class TxtBase extends UICom {
    text: Label;
    constructor (node: Node) {
        super(node);
        this.text = UtilNode.getComponent(this._node, Label);
        this.text.string = Bind.Instance.get(this._node?.name);
    }

    public on (): void {
        super.on();
        this.refresh();
    }

    public refresh (): void {
        super.refresh();
        this.text!.string = Bind.Instance.get(this._node!.name);
    }
}

export class SliBase extends UICom {
    slider: Slider;
    fill: Sprite;
    constructor (node: Node) {
        super(node);
        this.slider = UtilNode.getComponent(this._node, Slider);
        this.fill = UtilNode.getChildComponent(this._node, 'fill', Sprite);
        if (this.fill.type !== Sprite.Type.FILLED) throw new Error(`${this._node.name} node Sprite not set Sprite.Type.FILLED`);
        var defaultValue = Bind.Instance.get(this._node.name);
        this.slider.progress = defaultValue;
        this.fill!.fillRange = defaultValue;
        this.slider?.node.on('slide', () => {
            this.fill!.fillRange = GMath.range(1, 0, this.slider!.progress);
            Msg.emit(this._node.name, this.slider?.progress);
        }, this);
    }

    public on (): void {
        super.on();
        var defaultValue = Bind.Instance.get(this._node.name);
        this.slider!.progress = defaultValue;
        this.fill!.fillRange = defaultValue;
    }
}

export class FilBase extends UICom {
    fil_value: Sprite;
    fil_smooth: FilSmooth;
    constructor (node: Node) {
        super(node);
        this.fil_value = UtilNode.getComponent(this._node, Sprite);
        this.fil_value.fillRange = 0;
        this.fil_smooth = this._node.addComponent(FilSmooth);
        Msg.on(this._node.name, (value: number) => {
            this.fil_smooth.setValue(value);
        });
    }

    public on (): void {
        this.fil_value!.fillRange = 0;
    }
}

export class SprBase extends UICom {
    sprite: Sprite;
    constructor (node: Node) {
        super(node);
        this.sprite = UtilNode.getComponent(this._node, Sprite);
        Msg.on(this._node.name, (value: SpriteFrame) => {
            this.sprite!.spriteFrame = value;
        })
    }

    public on (): void {
        super.on();
        const src = Bind.Instance.get(this._node.name);
        this.sprite.spriteFrame = src;
    }
}

export class GrpBase extends UICom {
    constructor (node: Node) {
        super(node);
    }
}

export class TglBase extends UICom {
    private _toggle: Toggle;
    constructor (node: Node) {
        super(node);
        this._toggle = UtilNode.getComponent(this._node, Toggle);
        this._node.on(Toggle.EventType.TOGGLE, () => {

            Bind.Instance.on(this._node.name);
        })
    }
}