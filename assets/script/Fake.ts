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
    broken_particle: cc.Prefab = null;
    
    private shake_action = null    
    private is_touched: boolean = false;

    // for editor
    pos_x: number = 0;
    pos_y: number = 0;
    
    onLoad () {
        let shake = cc.repeat(cc.sequence(cc.moveBy(0.09, -10, 0), cc.moveBy(0.09, 10, 0)), 3);
            
        let finished = cc.callFunc(() => {
            let broken = cc.instantiate(this.broken_particle);
            broken.setPosition(0, 0);
            broken.getComponent(cc.RigidBody).destroy();
            // console.log(this.node.position);
        
            this.node.addChild(broken);
            this.getComponent(cc.Sprite).enabled = false;

            this.scheduleOnce(() => {
                this.getComponent(cc.RigidBody).active = false;
            }, 0.2);
            this.scheduleOnce(() => {
                broken.destroy();
                if(cc.director.getScene().name != "editor") this.node.destroy();
            }, 0.8);
        }, this);
            
        this.shake_action = cc.sequence(shake, finished);
    }

    start () {
        // for editor
        this.pos_x = this.node.x, this.pos_y = this.node.y;
    }

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
