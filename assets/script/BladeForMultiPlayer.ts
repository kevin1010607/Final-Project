// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BladeForMultiPlayer extends cc.Component {
    
    @property
    move_dir: number = 0;
    @property
    move_amount: number = 1200;
    @property
    move_interval: number = 0.6;

    // LIFE-CYCLE CALLBACKS:
    onLoad(){
        
    }

    start(){
        // for editor
    }
    
    update(dt){
        
    }

    trigger(){
        
        let action1;
        if(this.move_dir == 0){
            action1 = cc.repeatForever(cc.sequence(cc.moveBy(this.move_interval, -this.move_amount, 0), cc.delayTime(1), cc.moveBy(this.move_interval, this.move_amount, 0), cc.delayTime(1)));
        }
        
        else{
            action1 = cc.repeatForever(cc.sequence(cc.moveBy(this.move_interval, this.move_amount, 0), cc.delayTime(1), cc.moveBy(this.move_interval, -this.move_amount, 0), cc.delayTime(1)));
        }
        
        let action2 = cc.repeatForever(cc.rotateBy(1,270));
        this.node.runAction(action1);
        this.node.runAction(action2);
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player" && Math.abs(Manifold.normal.y) >= 0.5){
            this.scheduleOnce(function(){other.node.getComponent("Player").playerDead();}, 0.05);
        }
    }
}
