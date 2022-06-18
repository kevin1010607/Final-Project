// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DoorForMultiPlayer extends cc.Component {

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

    @property(cc.Prefab)
    broken: cc.Prefab = null;


    onLoad(){

    }

    start(){
        // for editor
    }
    
    update(dt){
        
    }

    open(){
        let finished = cc.callFunc(function(){
            this.node.getChildByName("broken").getComponent(cc.ParticleSystem).resetSystem();
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 1);
        }, this);
        
        let action;
        if (this.move_direction == 0) action = cc.sequence(cc.moveBy(this.duration, 0, -this.move_amount), cc.delayTime(1.2), finished);
        if (this.move_direction == 1) action = cc.sequence(cc.moveBy(this.duration, 0, this.move_amount),cc.delayTime(1.2), finished);
        if (this.move_direction == 2) action = cc.sequence(cc.moveBy(this.duration, -this.move_amount, 0),cc.delayTime(1.2), finished);
        if (this.move_direction == 3) action = cc.sequence(cc.moveBy(this.duration, this.move_amount, 0),cc.delayTime(1.2), finished);

        this.node.runAction(action);
        let id = cc.audioEngine.playEffect(this.open_effect, false);
        cc.audioEngine.setVolume(id, this.volume);
    }

}
