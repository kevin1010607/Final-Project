// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Switchs extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private anim: any = null;
    
    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

    
    start () {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log(contact.getWorldManifold().normal.y);
        if(otherCollider.node.name == "player" && contact.getWorldManifold().normal.y >= 0.9){
            this.anim.play("switch_down");
            this.node.getChildByName("elevator").getComponent("Elevator").down(); 
            
        }

        if(otherCollider.node.name == "player" && contact.getWorldManifold().normal.y <= -0.9){
            this.anim.play("switch_up");
            this.node.getChildByName("elevator").getComponent("Elevator").up(); 
        }
    }

    // update (dt) {}
}
