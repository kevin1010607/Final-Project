// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Elevator extends cc.Component {


    @property(cc.AudioClip)
    open_effect: cc.AudioClip = null;

    // 門離按鈕越遠聲音要越小
    @property
    volume: number = 0.3;

    /// 門移動的距離
    @property
    move_amount: number = 600;

    /// 
    @property
    duration: number = 2;

    is_moveing: boolean = false;
    is_lock: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if(cc.find("Canvas/box_carrier").x <= 21540 && cc.find("Canvas/box_carrier").x >= 21538){
            cc.find("Canvas/box_carrier").getComponent(cc.RigidBody).linearVelocity.x = 0;
            cc.find("Canvas/box_carrier").getComponent(cc.RigidBody).type = 1;
            this.is_lock = true;
        }

    }

    up () {
        if(this.is_moveing == true){
            return;
        }
        this.is_moveing = true;

        let finished = cc.callFunc(function(){
            this.is_moveing = false;
        }, this);

        let action = cc.sequence(cc.moveBy(this.duration, 0, this.move_amount), finished);
        this.node.runAction(action);
        if(this.is_lock){
            cc.find("Canvas/box_carrier").runAction(cc.moveBy(this.duration, 0, this.move_amount));
        }
        // let id = cc.audioEngine.playEffect(this.open_effect, false);
        // cc.audioEngine.setVolume(id, this.volume);
    }
    
    down () {
        if(this.is_moveing == true){
            return;
        }

        this.is_moveing = true;

        let finished = cc.callFunc(function(){
            this.is_moveing = false;
        }, this);

        let action = cc.sequence(cc.moveBy(this.duration, 0, -this.move_amount), finished);
        this.node.runAction(action);
        if(this.is_lock){
            cc.find("Canvas/box_carrier").runAction(cc.moveBy(this.duration, 0, -this.move_amount));
        }
    }
    
}
