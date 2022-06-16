// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class HammerForMenu extends cc.Component {

    @property(cc.AudioClip)
    hammer: cc.AudioClip = null;
    hammer_audioID: number = null;

    // cool down time
    @property
    duration: number = 2;

    volumn: number = 0;
    action: cc.Action = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        var sequence1 = cc.sequence(cc.moveBy(1, 0, 125), cc.moveBy(0.2, 0, -125));
        var action = cc.repeatForever(sequence1);
        this.node.runAction(action);
        this.schedule(() => {
            //cc.audioEngine.playEffect(this.hammer, false);
            cc.audioEngine.setVolume(cc.audioEngine.playEffect(this.hammer, false), 0.15);
        }, 1.2);
    }

}
