import { _decorator, Component, Node, find, Label } from 'cc';
import { Const } from '../../../config/Const';
import { GGridType } from '../../../config/global';
import { comm } from '../../../easyFramework/mgr/comm';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
const { ccclass, property } = _decorator;

@ccclass('grid_wall')
export class grid_wall extends comm {

    x:number=0
    y:number=0
    gridType: GGridType=GGridType.green;

    get green(){return find("green", this.node)!}
    get red(){return find("red", this.node)!}
    get shadow(){return find("shadow", this.node)!}
    get label(){return find("label", this.node)!.getComponent(Label)!}

    init(x:number, y:number, gridType:GGridType=GGridType.green){
        this.x = x
        this.y = y
        this.gridType = gridType
        this.node.children.forEach(item=>{
            item.active = (item.name==this.gridType)
        })
        this.label.string = (this.x-Const.OriOffset.x)+","+(this.y-Const.OriOffset.y) 
        this.label.node.active = Const.isDebug
        
    }

    start() {
        if(Const.isDebug){
            // this.bindButton(this.node, this.clickGrid)
        }
    }

    clickGrid() {
        UtilPub.log("------点击grid_wall格子-- x:", this.x, " y:", this.y)
    }
}


