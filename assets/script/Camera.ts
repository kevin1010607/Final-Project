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

    // start () {}

    update(dt){
        // for the editor scene
        let player_node = cc.find("Canvas/player");
        if(player_node == null) return;

        if(player_node.getComponent("Player").is_Dead == false){
            let target_positon = player_node.getPosition();
            let cur_position = this.node.getPosition();
            cur_position.lerp(target_positon, 0.1, cur_position);
            this.node.setPosition(cur_position);
        }
        // if(cc.director.getScene().name == "example" || cc.director.getScene().name == "normal_01" || cc.director.getScene().name == "normal_02"|| cc.director.getScene().name == "normal_03"|| cc.director.getScene().name == "normal_endless") this.node.y = 0;
    }
}
