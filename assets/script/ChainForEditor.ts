// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChainForEditor extends cc.Component {

    move_time: number = 0.6; // circle

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;

        let action = cc.sequence(cc.rotateBy(this.move_time, -150), cc.moveBy(2, 0, 0), cc.rotateBy(this.move_time, 150), cc.moveBy(2, 0, 0)).repeatForever();
        this.node.runAction(action);
    }

    // update (dt) {}

    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.name == "player"){
            otherCollider.node.getComponent("Player").playerDead();
        }
    }
}
