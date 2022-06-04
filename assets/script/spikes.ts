// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class spikes extends cc.Component {

    onLoad(){
        
    }
    
    start(){
        let action = cc.repeatForever(cc.sequence(cc.moveBy(0.2, 0, 25), cc.delayTime(1.5), cc.moveBy(0.2, 0, -25), cc.delayTime(3)));
        this.node.runAction(action);
    }
    
    update(dt){
        
    }

    // update (dt) {}
}
