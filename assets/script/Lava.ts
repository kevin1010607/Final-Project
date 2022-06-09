// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Player from "./Player";

@ccclass
export default class Lava extends cc.Component {

    @property(cc.AudioClip)
    lava_effect: cc.AudioClip = null;

    lava_audioID: number = null;
    volume: number = 0;
    in_range: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let player = cc.find("Canvas/player").getComponent(Player);

        let changeVolumeCallback = function(){
            if (player.is_Dead) return;
            let camera = cc.find("Canvas/Main Camera");
            if (this.lava_audioID != null){
                if(cc.audioEngine.getState(this.lava_audioID) == cc.audioEngine.AudioState.PLAYING){
                    cc.audioEngine.setVolume(this.lava_audioID, this.volume);
                }
            }
            if (Math.abs(this.node.x - camera.x)<= 1000 && this.in_range == false){
                this.in_range = true;
                this.lava_audioID = cc.audioEngine.playEffect(this.lava_effect, true);
                cc.audioEngine.setVolume(this.lava_audioID, this.volume);
            }
            else if(Math.abs(this.node.x - camera.x) >= 1000 && this.in_range == true){
                this.in_range = false;
                cc.audioEngine.stopEffect(this.lava_audioID);
            }
        }
        this.schedule(changeVolumeCallback, 0.15);
    }

    update (dt) {
        this.detectInRange();
    }

    detectInRange(){
        let camera = cc.find("Canvas/Main Camera");
        let distance = Math.abs(this.node.x - camera.x);
        if (distance <= 500) this.volume = 0.4;
        else if (distance <= 550) this.volume = 0.37;
        else if (distance <= 600) this.volume = 0.34;
        else if (distance <= 700) this.volume = 0.31;
        else if (distance <= 750) this.volume = 0.28;
        else if (distance <= 800) this.volume = 0.25;
        else this.volume = 0;
    }

    onBeginContact(contact, self, other){
        if(other.node.name == "player"){
            this.scheduleOnce(function(){other.node.getComponent("Player").playerDead();}, 0.05);
        }
    }

}
