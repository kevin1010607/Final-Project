// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Door extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

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
    move_amount: number = 600

    // 最好界在 1-2秒之間不然 audio 長度會不合
    @property
    duration: number = 1.5;

    onLoad () {
        
    }

    start () {

    }

    update (dt) {

    }

    open(){
        let action;
        if (this.move_direction == 0) action = cc.moveBy(this.duration, 0, -this.move_amount);
        if (this.move_direction == 1) action = cc.moveBy(this.duration, 0, this.move_amount);
        if (this.move_direction == 2) action = cc.moveBy(this.duration, -this.move_amount, 0);
        if (this.move_direction == 3) action = cc.moveBy(this.duration, this.move_amount, 0);

        this.node.runAction(action);
        let id = cc.audioEngine.playEffect(this.open_effect, false);
        cc.audioEngine.setVolume(id, this.volume);
    }
}
