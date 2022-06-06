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

    @property(cc.AudioClip)
    search: cc.AudioClip = null;

    in_range: boolean = false;
    max_volumn: number = 0.6;
    volume: number = 0;
    search_audioID: number = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.move();
        this.light = this.node.getChildByName('light');

        let changeVoumnCallback = function(){
            let camera = cc.find("Canvas/Main Camera");
            if (this.search_audioID != null){
                if(cc.audioEngine.getState(this.search_audioID) == cc.audioEngine.AudioState.PLAYING){
                    cc.audioEngine.setVolume(this.search_audioID, this.volume);
                }
            }
            if (Math.abs(this.node.x - camera.x)<= 1000 && this.in_range == false){
                this.in_range = true;
                this.search_audioID = cc.audioEngine.playEffect(this.search, true);
                cc.audioEngine.setVolume(this.search_audioID, this.volume);
            }
            else if(Math.abs(this.node.x - camera.x) >= 1000 && this.in_range == true){
                this.in_range = false;
                cc.audioEngine.stopEffect(this.search_audioID);
            }
        }
        this.schedule(changeVoumnCallback, 0.8);
    }

    update (dt) {
        this.detectPlayer();
        this.detectInRange();
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

    detectPlayer(){
        let x = this.player.node.x;
        let y = this.player.node.y;
        if (this.detectInLight(x, y) && !this.player.is_hidden) this.player.playerDead();
    }

    detectInRange(){
        let camera = cc.find("Canvas/Main Camera");
        let distance = Math.abs(this.node.x - camera.x);
        if (distance <= 600) this.volume = 0.5;
        else if (distance <= 700) this.volume = 0.4;
        else if (distance <= 800) this.volume = 0.3;
        else if (distance <= 900) this.volume = 0.2;
        else if (distance <= 1000) this.volume = 0.1;
        // else this.volumn = 0;
    }
}
