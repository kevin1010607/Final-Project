// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwapMap extends cc.Component {

    @property(cc.Node)
    map_root: cc.Node = null;

    @property([cc.Node])
    map: cc.Node[] = [];

    @property([cc.Prefab])
    map_prefab: cc.Prefab[] = [];

    @property(cc.Node)
    player: cc.Node = null;

    map_number: number = 0;

    per_map_length: number = 5000;

    swap_point: number = 0;
    
    left_most_map: number = 0; // [0, 1, 2]

    lock: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    
    start () {
        this.map_number = this.map.length;
        this.swap_point = (this.map_number-1)*this.per_map_length;
        // for debug
        this.schedule(() => {
            console.log("player(x):", Math.floor(this.player.x));
            this.map.forEach((node, idx) => {
                if(node == null) return;
                console.log("map"+idx+"(x):", node.x);
            });
        }, 3);
    }

    update (dt) {
        this.swapMap();
    }

    swapMap(){
        if(this.player.x < this.swap_point || this.lock) return;

        this.lock = true;

        this.swap_point += this.per_map_length;
        let map_idx = this.left_most_map;
        this.map[map_idx].destroy();
        this.map[map_idx] = null;
        this.scheduleOnce(() => {
            this.map[map_idx] = cc.instantiate(this.map_prefab[map_idx]);
            this.map[map_idx].setPosition(this.swap_point, 0);
            this.map_root.addChild(this.map[map_idx]);
        }, 1);
        this.left_most_map = (this.left_most_map+1)%this.map_number;

        this.lock = false;
    }
}
