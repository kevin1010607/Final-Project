// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blade extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var action1 = cc.repeatForever(cc.sequence(cc.moveBy(0.5, -400, 0), cc.delayTime(1), cc.moveBy(0.5, 400, 0), cc.delayTime(1)));
        var action2 = cc.repeatForever(cc.rotateBy(1,240));
        this.node.runAction(action1);
        this.node.runAction(action2);

    }

    // update (dt) {}
}
