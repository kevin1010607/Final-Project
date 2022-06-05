// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    private moveX: number = -480;
    private moveY: number = -320;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    // when created, the bullet need to be placed at correct position and play animation.
    public init(node: cc.Node, X: number, Y: number) {
        //this.anim = this.getComponent(cc.Animation);

        this.moveX = X;
        this.moveY = Y;

        this.setInitPos(node);
        this.bulletMove();

    }

    private setInitPos(node: cc.Node) {
        this.node.parent = node.parent; // don't mount under the player, otherwise it will change direction when player move

        this.node.position.x = 0; // 發射器的原始位子
        this.node.position.y = 210;   // 發射器的原始位子

        this.node.position = this.node.position.addSelf(node.position); // 這裡的node 是發射器
    }

    //make the bullet move from current position
    private bulletMove() {
        let moveDir = null;

        moveDir = cc.moveBy(0.5, this.moveX, this.moveY);
        let THIS = this;

        let finished = cc.callFunc(function () {
            THIS.node.destroy();
        });

        this.scheduleOnce(() => {
            this.node.runAction(cc.sequence(moveDir, finished));
        });
    }

    //detect collision with enemies
    onBeginContact(contact, selfCollider, otherCollider) {

        // this.node.stopAllActions();

        // this.unscheduleAllCallbacks();

        // this.scheduleOnce(() => {

        //     this.anim.stop();

        //     this.bulletManager.put(this.node);
        // }, 0.1); // for better animation effect, I delay 0.1s when bullet hits the enemy

        var Manifold = contact.getWorldManifold();

        if (otherCollider.node.name == "player"){
            otherCollider.node.getComponent("Player").playerDead();
        }
        if (otherCollider.tag == 0){
            this.node.destroy();
        }
    }
}
