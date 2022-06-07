// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Button extends cc.Component {

    // 按鈕移動的方向 ==> [Down Up] = [0 1]
    @property
    move_direction: number = 0  

    /// 按鈕移動的距離
    @property
    move_amount: number = 15;

    // LIFE-CYCLE CALLBACKS:
    private is_push: boolean = false;
    onLoad () {

    }

    start () {

    }

    onBeginContact(contact, self, other){
        console.log(contact.getWorldManifold().normal.x, contact.getWorldManifold().normal.y);
        if(other.node.name == "player" && Math.abs(contact.getWorldManifold().normal.y) > 0.9){ // contact.getWorldManifold().normal.x == 0 有時會按不到按鈕
            if(this.is_push == true){
                return;
            }
            this.is_push = true;
            let finished = cc.callFunc(function() {
                this.node.getChildByName("door").getComponent("Door").open(); 
            }, this);
        
            let action;
            if (this.move_direction == 0) action = cc.sequence(cc.moveBy(0.3, 0, -this.move_amount), finished);
            if (this.move_direction == 1) action = cc.sequence(cc.moveBy(0.3, 0, this.move_amount), finished);
    
            this.node.runAction(action);
        }

    }
    
    // update (dt) {

    // }
}
