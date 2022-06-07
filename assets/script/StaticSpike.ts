// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StaticSpike extends cc.Component {

    // [Down Up Left Right] = [0 1 2 3]
    @property
    direction: number = 1;

    // onLoad () {}

    start () {

    }
    // update (dt) {}

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if (other.node.name == "player"){

            if (this.direction == 0 && Manifold.normal.y <= -0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 1 && Manifold.normal.y >= 0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 2 && Manifold.normal.x <= -0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 3 && Manifold.normal.x >= 0.9) other.node.getComponent("Player").playerDead();
        }
    }

    onPreSolve(contact, self, other){
        var Manifold = contact.getWorldManifold();
        if (other.node.name == "player"){
            if (this.direction == 0 && Manifold.normal.y <= -0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 1 && Manifold.normal.y >= 0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 2 && Manifold.normal.x <= -0.9) other.node.getComponent("Player").playerDead();
            if (this.direction == 3 && Manifold.normal.x >= 0.9) other.node.getComponent("Player").playerDead();
        }
    }
}
