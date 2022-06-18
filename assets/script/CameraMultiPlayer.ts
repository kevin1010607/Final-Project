// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraMultiPlayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(Player)
    player1: Player = null;
    
    @property(Player)
    player2: Player = null;

    start () {

    }

    update (dt) {
         console.log(this.player2.node.x);
        this.node.x = this.node.x + dt*160; 
        if(this.player1.node.x <= this.node.x + cc.find("Canvas/Main Camera/Spikes_0001").x){
            this.player1.getComponent("Player").playerDead();
        }

        if(this.player2.node.x <= this.node.x + cc.find("Canvas/Main Camera/Spikes_0001").x){
            this.player2.getComponent("Player").playerDead();
        }
    }
}
