// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Carrier extends cc.Component {

    @property
    move_amount: number = 200;
    @property
    move_interval: number = 0.5;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var action1 = cc.repeatForever(cc.sequence(cc.moveBy(this.move_interval, -this.move_amount, 0), cc.delayTime(1), cc.moveBy(this.move_interval, this.move_amount, 0), cc.delayTime(1)));
        this.node.runAction(action1);

    }

    onPreSolve(contact, self, other){
        if(other.node.name == "player"){
            other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.node.getComponent(cc.RigidBody).linearVelocity, 0);
          }
        }
      }

    // update (dt) {}

