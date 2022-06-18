// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpikeForMultiPlayer extends cc.Component {

    @property(cc.AudioClip)
    spike_up: cc.AudioClip = null;

    @property(cc.AudioClip)
    spike_down: cc.AudioClip = null;

    onLoad(){
        
    }
    
    start(){
        // for editor
    }
    
    update(dt){
        
    }

    trigger(){
        let action = cc.repeatForever(cc.sequence(cc.moveBy(0.2, 0, -75), cc.delayTime(0.8), cc.moveBy(0.2, 0, 75), cc.delayTime(2)));
        this.node.runAction(action);
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player" && Math.abs(Manifold.normal.y) >= 0.5){
            this.scheduleOnce(function(){other.node.getComponent("Player").playerDead();}, 0.05);
        }
    }

}
