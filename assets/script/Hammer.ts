// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hammer extends cc.Component {

    @property(cc.AudioClip)
    hammer: cc.AudioClip = null;
    hammer_audioID: number = null;

    // cool down time
    @property
    duration: number = 2.6;

    volumn: number = 0;
    action: cc.Action = null;

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;

        let player = cc.find("Canvas/player").getComponent("Player");
        this.action = cc.sequence(cc.moveBy(1, 0, 125), cc.moveBy(0.2, 0, -125));
        var move_callback = function(){
            this.node.runAction(this.action);
            this.scheduleOnce(audio_callback, 1.2);
        };
        var audio_callback = function(){
            if(player.is_Dead && cc.director.getScene().name != "editor") return;
            this.hammer_audioID = cc.audioEngine.playEffect(this.hammer, false);
            cc.audioEngine.setVolume(this.hammer_audioID, this.volumn);
        }

        this.schedule(move_callback, this.duration);
        this.detectInRange();
    }

    update(dt) {
        this.detectInRange();
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player"){
            if (Manifold.normal.y <= -0.9) other.node.getComponent("Player").playerDead();
        }
    }

    detectInRange(){
        let camera = cc.find("Canvas/Main Camera");
        let distance = Math.abs(this.node.x + this.node.getParent().x - camera.x);

        if (distance <= 480) this.volumn = 0.6;
        else if (distance <= 550) this.volumn = 0.4;
        else if (distance <= 700) this.volumn = 0.2;
        else this.volumn = 0;
    }
}