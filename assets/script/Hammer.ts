// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hammer extends cc.Component {

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        var sequence1 = cc.sequence(cc.moveBy(1, 0, 125), cc.moveBy(0.5, 0, -125));
        var action = cc.repeatForever(sequence1);
        this.node.runAction(action);
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player" && Manifold.normal.y >= 0.9){
            other.node.getComponent("Player").playerDead();
        }
    }
}
