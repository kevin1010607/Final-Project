// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gear extends cc.Component {

    @property
    move_direction: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if(this.move_direction == 0){
            var action = cc.repeatForever(cc.rotateBy(1, 90));
            this.node.runAction(action);
        }
        else{
            var action = cc.repeatForever(cc.rotateBy(1, -90));
            this.node.runAction(action);
        }
    }
    
    update (dt) {

    }
}
