// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {

    @property(cc.Prefab)
    private bulletPrefab: cc.Prefab = null;

    private canCreateBullet: boolean = true;

    private bulletInterval: number = 1.0;

    private moveX: number = -480;

    private moveY: number = -320;

    private edgeX: number = 320; // 左到右的扇形面積
    private edgeY: number = 320; // 上到下的扇形面積

    onLoad() {
        // this.moveX = -this.edgeX - this.node.position.x;
        // this.moveY = -this.edgeY - this.node.position.y;
        this.moveX = -320;
        this.moveY = -320;
    }


    start() {
    }


    private findPlayer(dt) {
        // a bullet can be created only when canCreateBullet is True
        if (this.canCreateBullet) {
            this.createBullet();
        }
    }


    private createBullet() {
        this.canCreateBullet = false;
        //let bullet = null;
        this.scheduleOnce(function () {
            this.canCreateBullet = true;
        }, this.bulletInterval);

        // down
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.getComponent('Bullet').init(this.node, this.moveX, -320); // -480, -320

        // up
        let bulletUp = cc.instantiate(this.bulletPrefab);
        bulletUp.getComponent('Bullet').init(this.node, -this.moveX, 320); // 480, 32

        // left
        let bulletLeft = cc.instantiate(this.bulletPrefab);
        bulletLeft.getComponent('Bullet').init(this.node, 320, this.moveY); // 480, -320

        // right
        let bulletRight = cc.instantiate(this.bulletPrefab);
        bulletRight.getComponent('Bullet').init(this.node, -320, -this.moveY); // -480, 320

        this.moveX += 80; // 移動多少
        cc.log(this.moveX);
        if (this.moveX == this.edgeX)
            this.moveX = -320;

        this.moveY += 80; // 移動多少
        if (this.moveY == this.edgeY)
            this.moveY = -320;

    }

    update(dt) {
        this.findPlayer(dt);
    }
}
