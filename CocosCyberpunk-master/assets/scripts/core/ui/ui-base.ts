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

import { Node } from 'cc';
import { UICom } from './ui-com';
import { UIBind } from './ui-bind';

export class UIBase {

    public node: Node;

    public isOn = false;

    public _map: UICom[] = Object.create(null);

    constructor (node: Node) {
        this.node = node;
        this._map = UIBind.get(this.node);
    }

    public refresh (): void {
        if (!this.isOn) return;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].refresh();
    }

    public on (): void {
        this.isOn = true;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].on();
        this.node.active = true;
    }

    public off (): void {
        this.isOn = false;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].off();
        this.node.active = false;
    }

    public destroy (): void { }
}