// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DynamicSpike extends cc.Component {

    @property(cc.AudioClip)
    spike_up: cc.AudioClip = null;

    @property(cc.AudioClip)
    spike_down: cc.AudioClip = null;

    spikeup_audioID: number = 0;
    spikedown_audioID: number = 0;
    action: cc.Action = null;
    volumn: number = 0;

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;

    onLoad(){
        
    }
    
    start(){
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;

        let player = cc.find("Canvas/player").getComponent("Player");
        this.action = cc.sequence(cc.moveBy(0.2, 0, 25), cc.delayTime(1.5), cc.moveBy(0.2, 0, -25));
        this.detectInRange();

        var moveup_callback = function(){
            if (player.is_Dead && cc.director.getScene().name != "editor") return;
            this.spikeup_audioID = cc.audioEngine.playEffect(this.spike_up, false);
            cc.audioEngine.setVolume(this.spikeup_audioID, this.volumn);
            this.node.runAction(this.action);
            this.scheduleOnce(movedown_callback, 1.7);
        };
        var movedown_callback = function(){
            if (player.is_Dead && cc.director.getScene().name != "editor") return;
            this.spikedown_audioID = cc.audioEngine.playEffect(this.spike_down, false);
            cc.audioEngine.setVolume(this.spikedown_audioID, this.volumn);
        };

        // ******* execute one time in the beginning ********//
        this.spikeup_audioID = cc.audioEngine.playEffect(this.spike_up, false);
            cc.audioEngine.setVolume(this.spikeup_audioID, this.volumn);
            this.node.runAction(this.action);
            this.scheduleOnce(movedown_callback, 1.7);
        // **************************************************//

        this.schedule(moveup_callback, 4);
    }
    
    update(dt){
        this.detectInRange();
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player" && Manifold.normal.y >= 0.5){
            this.scheduleOnce(function(){other.node.getComponent("Player").playerDead();}, 0.05);
        }
    }

    detectInRange(){
        let camera = cc.find("Canvas/Main Camera");
        let distance = Math.abs(this.node.x - camera.x);
        if (this.node.name == "dynamic_spike_1") cc.log(distance)

        if (distance <= 450) {
            this.volumn = 0.5;
        }
        else if (distance <= 550) this.volumn = 0.35;
        else if (distance <= 700) this.volumn = 0.2;
        else this.volumn = 0;
    }

    // update (dt) {}
}
