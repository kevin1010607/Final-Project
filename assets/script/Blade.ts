// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blade extends cc.Component {

    @property
    move_amount: number = 400;
    @property
    move_interval: number = 0.6;

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;

        var action1 = cc.repeatForever(cc.sequence(cc.moveBy(this.move_interval, -this.move_amount, 0), cc.delayTime(1), cc.moveBy(this.move_interval, this.move_amount, 0), cc.delayTime(1)));
        var action2 = cc.repeatForever(cc.rotateBy(1,270));
        this.node.runAction(action1);
        this.node.runAction(action2);

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.name == "player"){
            otherCollider.node.getComponent("Player").playerDead();
        }
    }
    // update (dt) {}
}
