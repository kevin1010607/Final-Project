// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwapMap extends cc.Component {

    per_map_length: number = 5000;

    swap_point: number = null;
    
    left_most_map: number = 1; // [1, 2, 3]

    lock: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    
    start () {
        this.swap_point = cc.find("Canvas/map3").x; 
    }

    update (dt) {
        var player_x = cc.find("Canvas/player").x ;

        if(player_x >= this.swap_point && this.lock){ // move the left most map to right most
            this.lock = false;
            switch(this.left_most_map){
                case 1:
                    this.swap_point = this.swap_point + this.per_map_length; // next swap point
                    cc.find("Canvas/map1").x = this.swap_point;
                    // console.log(cc.find("Canvas/map1/wall").x);
                    this.left_most_map = 2;
                    break;
                case 2:
                    this.swap_point = this.swap_point + this.per_map_length;
                    cc.find("Canvas/map2").x = this.swap_point;
                    this.left_most_map = 3;
                    break;
                case 3:
                    this.swap_point = this.swap_point + this.per_map_length;
                    cc.find("Canvas/map3").x = this.swap_point;
                    this.left_most_map= 1;
                    break;
            }
            this.lock = true;
        }

    }
}
