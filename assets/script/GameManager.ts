// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Player from "./Player";
declare const firebase: any

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.AudioClip)
    background_music: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameover_Music: cc.AudioClip = null;

    @property
    volumn: number = 0.4;
    audioID: number = null;

    is_paused: boolean = false;
    is_dead: boolean = false;
    score: number = 0;

    pause_btn: cc.Button = null;
    resume_btn: cc.Button = null;
    restart_btn: cc.Button = null;
    menu_btn: cc.Button = null;
    game_over_scene: cc.Node = null;

    score_label: cc.Label = null;
    player: Player = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // UI components in game
        this.pause_btn = cc.find("Canvas/Main Camera/pause_btn").getComponent(cc.Button);
        this.resume_btn = cc.find("Canvas/Main Camera/resume_btn").getComponent(cc.Button);
        this.score_label = cc.find("Canvas/Main Camera/score_label").getComponent(cc.Label);
        this.player = cc.find("Canvas/player").getComponent(Player);

        // UI components in game over scene
        this.game_over_scene = cc.find("Canvas/Main Camera/game_over");
        this.restart_btn = cc.find("Canvas/Main Camera/restart_btn").getComponent(cc.Button);
        this.menu_btn = cc.find("Canvas/Main Camera/menu_btn").getComponent(cc.Button);
    }

    start () {
        this.audioID = cc.audioEngine.playMusic(this.background_music, true);
        cc.audioEngine.setVolume(this.audioID, this.volumn);
        this.pause_btn.node.active = true;
        this.resume_btn.node.active = false;
        this.restart_btn.node.active = false;
        this.menu_btn.node.active = false;
        this.game_over_scene.active = false;

        let pause_event = new cc.Component.EventHandler();
        pause_event.target = this.node;
        pause_event.component = "GameManager";
        pause_event.handler = "gamePause";
        this.pause_btn.clickEvents.push(pause_event);

        let resume_event = new cc.Component.EventHandler();
        resume_event.target = this.node;
        resume_event.component = "GameManager";
        resume_event.handler = "gameResume";
        this.resume_btn.clickEvents.push(resume_event);

        let restart_event = new cc.Component.EventHandler();
        restart_event.target = this.node;
        restart_event.component = "GameManager";
        restart_event.handler = "gameRestart";
        this.restart_btn.clickEvents.push(restart_event);

        let menu_event = new cc.Component.EventHandler();
        menu_event.target = this.node;
        menu_event.component = "GameManager";
        menu_event.handler = "gameQuit";
        this.menu_btn.clickEvents.push(menu_event);
    }

    update(dt){
        this.scoreUpdate();
        if (this.player.is_Dead && !this.is_dead) this.gameOver();
    }

    gamePause (){
        this.is_paused = true;
        cc.director.getPhysicsManager().enabled = false;
        cc.director.pause();
        cc.audioEngine.pauseAllEffects();
        cc.audioEngine.pauseMusic();
        this.pause_btn.node.active = false;
        this.resume_btn.node.active = true;
        this.restart_btn.node.active = true;
        this.menu_btn.node.active = true;
    }

    gameResume (){
        this.is_paused = false;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.resume();
        cc.audioEngine.resumeAllEffects();
        cc.audioEngine.resumeMusic();
        this.pause_btn.node.active = true;
        this.resume_btn.node.active = false;
        this.restart_btn.node.active = false;
        this.menu_btn.node.active = false;
    }
    
    gameOver(){
        this.is_dead = true;
        this.game_over_scene.active = true;
        this.pause_btn.node.active = false;
        this.resume_btn.node.active = false;
        let num = this.volumn;
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.setEffectsVolume(0);

        let restart_event = new cc.Component.EventHandler();
        restart_event.target = this.node;
        restart_event.component = "GameManager";
        restart_event.handler = "gameRestart";
        this.game_over_scene.getChildByName("restart_btn").getComponent(cc.Button).clickEvents.push(restart_event);

        let menu_event = new cc.Component.EventHandler();
        menu_event.target = this.node;
        menu_event.component = "GameManager";
        menu_event.handler = "gameQuit";
        this.menu_btn.clickEvents.push(menu_event);
        this.game_over_scene.getChildByName("menu_btn").getComponent(cc.Button).clickEvents.push(menu_event);

        let fade_out = function(){
            cc.audioEngine.setVolume(this.audioID, num);
            num -= 0.05;
            if (num <= 0) {
                cc.audioEngine.stopMusic();
                this.unschedule(fade_out);
                let action = cc.fadeTo(0.5, 255);
                this.game_over_scene.runAction(action);
                cc.audioEngine.playMusic(this.gameover_Music, false);

                let score_action = cc.spawn(cc.moveTo(0.7, -this.score_label.node.width/2, -220), cc.scaleTo(0.7, 1.2));
                this.scheduleOnce(function(){
                    this.score_label.node.runAction(score_action);
                }, 0.5);
            }
        };
        this.schedule(fade_out, 0.1);

        if (firebase.auth() == null) return;
        let user_uid = firebase.auth().currentUser.uid;
        cc.log(user_uid);
        let score = this.score;
        firebase.database().ref("user/" + user_uid).once("value", (data)=>{
            let past_score = data.val().score;
            if (score > past_score) {
                firebase.database().ref("user/" + user_uid).update({score: score});
            } 
        });

    }

    gameQuit(){
        cc.director.resume();
        cc.audioEngine.stopMusic();
        cc.director.loadScene("menu");
    }

    gameRestart(){
        this.score = 0;
        cc.director.resume();
        cc.audioEngine.stopMusic();
        let scene = cc.director.getScene().name;
        cc.director.loadScene(scene);
    }

    scoreUpdate(){
        if(this.player.is_Dead) return;
        this.score = Math.max(Math.round(this.player.node.x - this.player.reborn_position.x), this.score);
        if (this.score < 0) this.score = 0;
        this.score_label.string = this.score.toString();
    }
}
