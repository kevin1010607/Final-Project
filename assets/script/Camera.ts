// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update(dt){
        if(cc.find("Canvas/player").getComponent("Player").is_Dead == false){
            let target_positon = cc.find("Canvas/player").getPosition();
            let cur_position = this.node.getPosition();
            cur_position.lerp(target_positon, 0.1, cur_position);
            this.node.setPosition(cur_position);
        }
    }
}
