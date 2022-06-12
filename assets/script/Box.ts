// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {

    underworld_bound: number = -190; // if player.y less than 190, anti-gravity
    
    // onLoad () {}

    start () {

    }

    update (dt) {
        if(this.node.y < this.underworld_bound){
            this.getComponent(cc.RigidBody).gravityScale = -5;
        }
        else{
            this.getComponent(cc.RigidBody).gravityScale = 5;
        }
    }

    onBeginContact(contact, self, other){
        if (other.node.name == "static_spike1" || other.node.name == "static_spike2" || other.node.name == "static_spike3"){
            contact.disabled = true;
            return;
        }
    }
}
