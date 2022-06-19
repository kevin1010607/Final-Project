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

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;

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
