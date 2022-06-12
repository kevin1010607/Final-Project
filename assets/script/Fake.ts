// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fake extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    
    @property(cc.Prefab)
    private broken_particle: cc.Prefab = null;
    
    private shake_action = null    
    private is_touched: boolean = false;
    
    onLoad () {
        let shake = cc.repeat(cc.sequence(cc.moveBy(0.09, -10, 0), cc.moveBy(0.09, 10, 0)), 3);
            
        let finished = cc.callFunc(() => {
            let broken = cc.instantiate(this.broken_particle);
            broken.setPosition(this.node.position);
            console.log(this.node.position);
            cc.find("Canvas").addChild(broken);
            this.node.destroy();
        }, this);
            
        this.shake_action = cc.sequence(shake, finished);
    }
    //start () {}

    onBeginContact(contact, selfCollider, otherCollider){
        if(this.is_touched == true){
            return;
        }
        else if (otherCollider.node.name == "player" && contact.getWorldManifold().normal.y > 0.9){
            this.is_touched = true;
            this.node.runAction(this.shake_action);
        }
    }
    
    // update (dt) {}
}
