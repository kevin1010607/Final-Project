// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Transmission extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Prefab)
    private particle: cc.Prefab = null;

    @property(cc.AudioClip)
    open_effect: cc.AudioClip = null;

    // 門離按鈕越遠聲音要越小
    @property
    volume: number = 0.3;

    // 門移動的方向 ==> [Down Up Left Right] = [0 1 2 3]
    @property
    move_direction: number = 0

    /// 門移動的距離
    @property
    move_amount: number = 600;

    // 最好界在 1-2秒之間不然 audio 長度會不合
    @property
    duration: number = 1.5;

    is_used: boolean = true;

    onLoad () {
        cc.find("Canvas/button_transimission/transmission/transmission_particle").active = false;
        cc.find("Canvas/player/eddy").active = false;
    }

    start () {

    }

    update (dt) {
        
        if(cc.find("Canvas/player").x >= 5114 && cc.find("Canvas/player").x <= 5200 && this.is_used){
            this.is_used = false;
            cc.find("Canvas/button_transimission/transmission/transmission_particle").active = false;
            cc.find("Canvas/player/eddy").active = true;
            this.scheduleOnce(()=>{
                cc.find("Canvas/player/eddy").active = false;
                cc.find("Canvas/player").setPosition(14010, -219);
            }, 1.5);
        }
    }

    open(){
        let action;
        
        let finished = cc.callFunc(function(){
            cc.find("Canvas/button_transimission/transmission/transmission_particle").active = true;
            this.node.getChildByName("Wall_Trap_L_0001").getComponent("Left").open(); 
            this.node.getChildByName("Wall_Trap_R_0001").getComponent("Right").open(); 

        }, this);
        
        action = cc.sequence(cc.moveBy(this.duration, 0, this.move_amount), cc.delayTime(1), finished);
        this.node.runAction(action);
        let id = cc.audioEngine.playEffect(this.open_effect, false);
        cc.audioEngine.setVolume(id, this.volume);
        

        /*
        let particle = cc.instantiate(this.particle);
        particle.setPosition(this.node.position);
        cc.find("Canvas").addChild(particle);
        */
    }
}
