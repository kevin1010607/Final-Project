// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StaticSpike extends cc.Component {

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player"){
            if(Manifold.normal.y <= -0.9 ||  Manifold.normal.y >= 0.9){
                other.node.getComponent("Player").playerDead();
            }
        }
    }
}
