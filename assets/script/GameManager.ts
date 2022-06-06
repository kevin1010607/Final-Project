// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.AudioClip)
    background_music = null;

    @property
    volumn: number = 0.4;
    audioID: number = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.audioID = cc.audioEngine.playMusic(this.background_music, true);
        cc.audioEngine.setVolume(this.audioID, this.volumn);
    }

    // update (dt) {}
}
