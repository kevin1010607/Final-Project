// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SearchLight extends cc.Component {

    private light: cc.Node = null;

    @property(Player)
    player: Player = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.move();
        this.light = this.node.getChildByName('light');
    }

    update (dt) {
        this.detectUpdate();
    }

    move(){
        let action: cc.Action = cc.sequence(cc.moveBy(3, 600, 0), cc.moveBy(3, -600, 0)).repeatForever();
        this.node.runAction(action);
    }

    detectInLight(x: number, y: number){
        // light node width, height, x, y
        let light_w = this.light.width * this.light.scaleX * this.node.scaleX;
        let light_h = this.light.height * this.light.scaleY * this.node.scaleY;
        let light_x = this.light.x * this.light.scaleX * this.node.scaleX;
        let light_y = this.light.y * this.light.scaleY * this.node.scaleY;

        // light Triangle points (p1: top, p2: bottom left, p2: bottom right)
        let p1_x = this.node.x;
        let p1_y = this.node.y + light_y + light_h / 2;
        let p2_x = this.node.x - light_w / 2;
        let p2_y = p1_y - light_h;
        let p3_x = this.node.x + light_w / 2;
        let p3_y = p1_y - light_h;
        
        // console.log(p1_x, p1_y);
        // console.log(p2_x, p2_y);
        // console.log(p3_x, p3_y);

        // left_slope: slope of p2, p1, right_slope: slope of p3, p1, player_slope: slope of player, p1
        let left_slope = (p2_y - p1_y) / (p2_x - p1_x);
        let right_slope = (p3_y - p1_y) / (p3_x - p1_x);
        let player_slope = (y - p1_y) / (x - p1_x);

        // player in left half triangle
        if(player_slope > left_slope && x > p2_x) return true;
        // player in right half triangle
        if(player_slope < right_slope && x < p3_x) return true;
        // player not in triangle
        return false;
    }

    detectUpdate(){
        let x = this.player.node.x;
        let y = this.player.node.y;
        if (this.detectInLight(x, y) && !this.player.is_hidden) this.player.playerDead();
    }
}
