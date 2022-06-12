// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Missile extends cc.Component {

    @property(cc.Prefab)
    private exp_particle: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, selfCollider, otherCollider) {
        let exp = cc.instantiate(this.exp_particle);
        exp.setPosition(this.node.position);
        cc.find("Canvas").addChild(exp);
        if(otherCollider.node.name == "player"){
            otherCollider.node.getComponent("Player").playerDead();
        }
        this.node.destroy();
    }
}
