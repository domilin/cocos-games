import { Vec2 } from "cc";

export class AStarNode {
    private _x: number = 0;
    private _y: number = 0;
    get x() {return this._x;}
    get y() {return this._y;}
    /**
     * @param x 节点横坐标
     * @param y 节点纵坐标
     */
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    priority = 0;
}

export class Frontier {
    private arr: AStarNode[] = [];
    put(node: AStarNode, priority: number) {
        node.priority = priority;
        this.arr.push(node);
        this.arr.sort((a,b)=>b.priority - a.priority);
    }
    get() {
        return this.arr.pop();
    }

    get size() {
        return this.arr.length;
    }
}

export default class AStar {

    private mSize: Vec2 = null!; // 寻路地图大小
    private mStart: Vec2 = null!; // 寻路起始点坐标
    private mEnd: Vec2 = null!; // 寻路目标点坐标

    private mStartNode: AStarNode = null!; // 起始点
    private mEndNode: AStarNode = null!; // 目标点
    /**
     * 设置地图横纵最大值
     * @param size 地图大小
     * @param start 寻路起始点
     * @param end 寻路目标点
     * @param obstacles 障碍物
     */
    public init(size: Vec2, start: Vec2, end: Vec2, obstacles: Vec2[] = []) {
        this.mSize = size;
        this.mStart = start;
        this.mEnd = end;
        this.obstacles = {};
        obstacles.forEach((ele) => {
            this.setObstacles(ele.x, ele.y);
        });

        this.nodePool = {};

        this.mStartNode  = this.createNode(this.mStart.x, this.mStart.y);
        this.mEndNode    = this.createNode(this.mEnd.x, this.mEnd.y);
    }

    public clean() {
        this.mStartNode = null!;
        this.mEndNode = null!;
    }
    
    private obstacles: {[x_y: string]: boolean} = {};
    /**
     * 设置障碍物
     * @param x 障碍物横坐标
     * @param y 障碍物纵坐标
     */
    public setObstacles(x: number, y: number) {
        if (!this.checkNode(x, y)) return;
        this.obstacles[`${x}_${y}`] = true;
    }
    /**
     * 清除障碍物
     * @param x 障碍物横坐标
     * @param y 障碍物纵坐标
     */
    public clearObstacles(x: number, y: number) {
        delete this.obstacles[`${x}_${y}`];
    }
    /**
     * 检查是否有障碍物
     * @param x 障碍物横坐标
     * @param y 障碍物纵坐标
     */
    public checkObstacles(x: number, y: number) {
        return this.obstacles[`${x}_${y}`];
    }

    /**
     * 检查节点是否在地图内
     * @param x 节点横坐标
     * @param y 节点纵坐标
     */
    public checkNode(x: number, y: number) {
        return x >= 0 && y >= 0 && x <= this.mSize.x && y <= this.mSize.y;
    }

 
    ///////////////////////////// 寻路开始 ////////////////////
    // 节点池
    private nodePool: {[x_y: string]: AStarNode} = {};
    // 探索边界
    private frontier: Frontier = null!;
    // 节点来向
    private cameForm: Map<AStarNode, AStarNode> = new Map();
    // 节点当前代价
    private costSoFar: Map<AStarNode, number> = new Map();
    // 寻路类型(4方向或8方向)
    private mType: 4|8  =4;

    /**
     * 开始寻路
     * @param type 寻路类型，4方向或8方向
     */
    public run(type: 4|8 = 4) {
        this.mType = type;

        // console.log('##### 寻路开始 #####');

        // console.log('地图大小:', this.mSize);
        // console.log('寻路类型:', this.mType + '方向');
        // console.log('出发点:', this.mStart);
        // console.log('目标点:', this.mEnd);
        // console.log('障碍物:', this.obstacles);


        const start = this.mStartNode;
        const goal = this.mEndNode;
        this.frontier = new Frontier();

        this.frontier.put(start, 0);

        this.cameForm.set(start, null!);
        this.costSoFar.set(start, 0);

        while (this.frontier.size > 0) {
            let curr = this.frontier.get()!;
            if (curr === goal) {
                break;
            }
            for (let next of this.getNeighbors(curr)) {
                const nextCost = this.costSoFar.get(curr)! + this.getCost(curr, next);
                if (!this.costSoFar.has(next) || nextCost < this.costSoFar.get(next)!) {
                    this.costSoFar.set(next, nextCost);
                    const preCost = this.getCost(next, goal);
                    this.frontier.put(next, nextCost + preCost);
                    this.cameForm.set(next, curr);
                }
            }
        }
        // console.log('结束');
    }

    /**
     * 无路可走时，会返回终点1个点的数组
     * @returns 
     */
    getPath() {
        const arr = [];
        let node = this.mEndNode;
        arr.push(node);
        while (this.cameForm.has(node)) {
            node = this.cameForm.get(node)!;
            node && arr.push(node);
        }
        return arr;
    }

    getNeighbors(node: AStarNode) {
        const neighbors = [];

        if (this.mType === 8) {
            const upright = this.getNode(node.x + 1, node.y + 1);
            upright && neighbors.push(upright);
            
            const upleft = this.getNode(node.x - 1, node.y + 1);
            upleft && neighbors.push(upleft);
    
            const downleft = this.getNode(node.x - 1, node.y - 1);
            downleft && neighbors.push(downleft);
    
            const downright = this.getNode(node.x + 1, node.y - 1);
            downright && neighbors.push(downright);
        }

        const up = this.getNode(node.x, node.y + 1);
        up && neighbors.push(up);
        
        const down = this.getNode(node.x, node.y - 1);
        down && neighbors.push(down);
        
        const left = this.getNode(node.x - 1, node.y);
        left && neighbors.push(left);
        
        const right = this.getNode(node.x + 1, node.y);
        right && neighbors.push(right);

        return neighbors;
    }

    getCost(node1: AStarNode, node2: AStarNode) {
        return Vec2.distance(new Vec2(node1.x, node1.y), new Vec2(node2.x, node2.y));
    }

    // 寻找下一个点
    public next() {
        
    }

    private getNode(x: number, y: number): AStarNode {
        if (!this.checkNode(x, y)) return null!;
        if (this.checkObstacles(x, y)) return null!;
        const key = this.getNodeKey(x, y);
        return this.nodePool[key] || this.createNode(x, y); 
    }
    private createNode(x: number, y: number) {
        const key = this.getNodeKey(x, y);
        this.nodePool[key] = new AStarNode(x, y);
        return this.nodePool[key];
    }

    private getNodeKey(x: number, y: number) {
        return `${x}_${y}`;
    }
}
