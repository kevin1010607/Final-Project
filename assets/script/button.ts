// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Button extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private is_push: boolean = false;
    onLoad () {

    }

    start () {

    }

    onBeginContact(contact, self, other){
        if(other.node.name == "player" && contact.getWorldManifold().normal.x == 0 && contact.getWorldManifold().normal.y == 1){
            if(this.is_push == true){
                return;
            }
            
            this.is_push = true;
            let finished = cc.callFunc(function() {
                console.log(this.node.getChildByName("door").getComponent("door"));   
                this.node.getChildByName("door").getComponent("door").open(); 
            }, this);
        
            let action = cc.sequence(cc.moveBy(0.3, 0, -15), finished);
            this.node.runAction(action);  
                   
        }

    }


    update (dt) {

    }
}
