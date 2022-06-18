// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // 按鈕移動的方向 ==> [Down Up Left Right] = [0 1 2 3]
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
        if(other.node.name == "player" || other.node.name == "box"){ // contact.getWorldManifold().normal.x == 0 有時會按不到按鈕
            if(this.is_push == true){
                return;
            }
    
            let finished = cc.callFunc(function(){
                let blade = this.node.getChildByName("blade");
                let action1 = cc.repeatForever(cc.sequence(cc.moveBy(this.move_interval, -this.move_amount, 0), cc.delayTime(1), cc.moveBy(this.move_interval, this.move_amount, 0), cc.delayTime(1)));
                let action2 = cc.repeatForever(cc.rotateBy(1,270));
                blade.runAction(action1);
                blade.runAction(action2); 
            }, this);
        
            let action;
            if(this.move_direction == 0 && contact.getWorldManifold().normal.y >= 0.9){
                action = cc.sequence(cc.moveBy(0.3, 0, -this.move_amount), finished);
                this.node.runAction(action);
                this.is_push = true;
            }
            if(this.move_direction == 1 && contact.getWorldManifold().normal.y <= -0.9){
                action = cc.sequence(cc.moveBy(0.3, 0, this.move_amount), finished);
                this.node.runAction(action);
                this.is_push = true;
            }
            if(this.move_direction == 2 && contact.getWorldManifold().normal.x >= 0.9){
                action = cc.sequence(cc.moveBy(0.3, -this.move_amount, 0), finished);
                this.node.runAction(action);
                this.is_push = true;
            } 
            
            
        }

    }
    
    // update (dt) {

    // }
}
