// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Door extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    update (dt) {

    }

    open(){
        let action = cc.moveBy(1.2, 0, -600);
        this.node.runAction(action);
    }
}
