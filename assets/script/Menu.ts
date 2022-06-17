// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
declare const firebase: any

@ccclass
export default class Menu extends cc.Component {

    @property(cc.Sprite)
    board: cc.Sprite = null;

    @property(cc.Sprite)
    leaderboard: cc.Sprite = null;

    @property(cc.Sprite)
    questionBoard: cc.Sprite = null;

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Sprite)
    selectionBoard: cc.Sprite = null;

    @property(cc.Button)
    selectionBoardCancelButton: cc.Button = null;

    @property(cc.Button)
    enterButtonNormal: cc.Button = null;

    @property(cc.Button)
    enterButtonUnder: cc.Button = null;

    @property(cc.Button)
    enterButtonEdit: cc.Button = null;

    @property(cc.Sprite)
    underBoard: cc.Sprite = null;

    @property(cc.Sprite)
    normalBoard: cc.Sprite = null;

    @property(cc.Button)
    level1ButtonNormal: cc.Button = null;
    @property(cc.Button)
    level2ButtonNormal: cc.Button = null;
    @property(cc.Button)
    level3ButtonNormal: cc.Button = null;
    @property(cc.Button)
    endlessButtonNormal: cc.Button = null;
    @property(cc.Button)
    cancelButtonNormal: cc.Button = null;

    @property(cc.Button)
    level1ButtonUnder: cc.Button = null;
    @property(cc.Button)
    level2ButtonUnder: cc.Button = null;
    @property(cc.Button)
    level3ButtonUnder: cc.Button = null;
    @property(cc.Button)
    endlessButtonUnder: cc.Button = null;
    @property(cc.Button)
    cancelButtonUnder: cc.Button = null;

    @property(cc.AudioClip)
    button_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    button2_effect: cc.AudioClip = null;

    private userName: string = null;
    private highScore: number = null;

    loadLeaderboard() {
        let action = cc.sequence(cc.moveBy(0.3, 192.5, 0), cc.moveBy(0.3, 192.5, 0));
        this.leaderboard.node.runAction(action);
        let action1 = cc.sequence(cc.moveBy(0.3, 275, 0), cc.moveBy(0.3, 275, 0));
        this.board.node.runAction(action1);
    }

    closeLeaderboard() {
        let action = cc.sequence(cc.moveBy(0.3, -192.5, 0), cc.moveBy(0.3, -192.5, 0));
        this.leaderboard.node.runAction(action);
        let action1 = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action1);
    }


    loadQuestionBoard() {
        let action1 = cc.sequence(cc.moveBy(0.3, 275, 0), cc.moveBy(0.3, 275, 0));
        this.board.node.runAction(action1);
        this.questionBoard.node.active = true;
        this.questionBoard.node.scale = 0;
        let scaleTo = cc.scaleTo(0.5, 1);
        this.questionBoard.node.runAction(scaleTo);
    }

    closeQuestionBoard() {
        // let action = cc.sequence(cc.moveBy(0.3, -450, 0), cc.moveBy(0.3, -450, 0));
        // this.questionBoard.node.runAction(action);
        let action1 = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action1);
        let scaleTo = cc.scaleTo(0.5, 0);
        this.questionBoard.node.runAction(scaleTo);
        this.scheduleOnce(() => {
            this.questionBoard.node.active = false;
        }, 0.5);
    }

    signOut() {
        var CC = cc;
        firebase.auth().signOut().then(
            () => {
                alert("Sign out sucessfully\n");
                CC.director.loadScene("main");
            }
        ).catch(
            (error) => {
                alert("error");
            }
        );
    }

    loadUserData() {
        let user = firebase.auth().currentUser;
        let email = user.email;
        let uid = user.uid;
        cc.log(email);
        //this.userName = user.substr(0, email.indexOf('@'));
        var THIS = this;
        var CC = cc;
        firebase.database().ref('user/' + uid).once('value').then((snapshot) => {
            console.log(snapshot.val());
            THIS.highScore = Number(snapshot.val().score);
            THIS.score.getComponent(cc.Label).string = THIS.highScore.toString();
        });

        firebase.database().ref('leaderboard').once('value').then((snapshot) => {
            // console.log(snapshot.val());
            var data = snapshot.val();
            var sorted = Object.keys(data).sort((a, b) => {
                return data[b].highest_score - data[a].highest_score;
            });
            CC.log(sorted.length);
            for (var i = 0; i < sorted.length; i++) {
                CC.find("Canvas/leaderboard/name_" + String(i + 1)).getComponent(cc.Label).string = String(data[sorted[i]].name.toUpperCase());
                CC.find("Canvas/leaderboard/score_" + String(i + 1)).getComponent(cc.Label).string = String(data[sorted[i]].highest_score);
            }

        });
    }

    closeSelection() {
        let action1 = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action1);
        //cc.audioEngine.stopMusic();

        let scaleTo = cc.scaleTo(0.5, 0);
        this.selectionBoard.node.runAction(scaleTo);
        this.scheduleOnce(() => {
            this.selectionBoard.node.active = false;
        }, 0.5);
    }

    loadGame() {
        let action1 = cc.sequence(cc.moveBy(0.3, 275, 0), cc.moveBy(0.3, 275, 0));
        this.board.node.runAction(action1);

        this.selectionBoard.node.active = true;
        this.selectionBoard.node.scale = 0;
        let scaleTo = cc.scaleTo(0.5, 1);
        this.selectionBoard.node.runAction(scaleTo);

        //cc.director.loadScene("logIn");
    }

    enterNormal() {
        let action = cc.fadeTo(0.5, 0);
        this.selectionBoard.node.runAction(action);
        this.scheduleOnce(() => {
            this.selectionBoard.node.active = false;
        }, 0.5);

        this.normalBoard.node.active = true;
        this.normalBoard.node.scale = 0;
        let scaleTo = cc.scaleTo(0.5, 1);
        this.normalBoard.node.runAction(scaleTo);
    }


    enterUnder() {
        let action = cc.fadeTo(0.5, 0);
        this.selectionBoard.node.runAction(action);
        this.scheduleOnce(() => {
            this.selectionBoard.node.active = false;
        }, 0.5);

        this.underBoard.node.active = true;
        this.underBoard.node.scale = 0;
        let scaleTo = cc.scaleTo(0.5, 1);
        this.underBoard.node.runAction(scaleTo);
    }

    closeNormal() {
        this.selectionBoard.node.active = true;
        let action = cc.fadeTo(0.5, 255);
        this.selectionBoard.node.runAction(action);

        let scaleTo = cc.scaleTo(0.5, 0);
        this.normalBoard.node.runAction(scaleTo);
        this.scheduleOnce(() => {
            this.normalBoard.node.active = false;
        }, 0.5);
    }


    closeUnder() {
        this.selectionBoard.node.active = true;
        let action = cc.fadeTo(0.5, 255);
        this.selectionBoard.node.runAction(action);

        let scaleTo = cc.scaleTo(0.5, 0);
        this.underBoard.node.runAction(scaleTo);
        this.scheduleOnce(() => {
            this.underBoard.node.active = false;
        }, 0.5);
    }

    enterEdit() {
        // cc.director.loadScene("editor");
    }

    start() {
        let action = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action);
        this.loadUserData();

        cc.find("Canvas/board/run").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.loadGame();
        }, this);

        cc.find("Canvas/board/leaderBoard").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.loadLeaderboard();
        }, this);

        cc.find("Canvas/board/question").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.loadQuestionBoard();
        }, this);

        cc.find("Canvas/board/signOut").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.signOut();
        }, this);

        cc.find("Canvas/questionBoard/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.closeQuestionBoard();
        }, this);

        cc.find("Canvas/leaderboard/closeButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.closeLeaderboard();
        }, this);

        this.selectionBoardCancelButton.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.closeSelection();
        }, this);

        this.enterButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.enterNormal();
        }, this);

        this.enterButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.enterUnder();
        }, this);

        this.enterButtonEdit.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.enterEdit();
        }, this);

        this.level1ButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("normal_01");
            cc.audioEngine.stopMusic();
        }, this);
        this.level2ButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("normal_02");
            cc.audioEngine.stopMusic();
        }, this);
        this.level3ButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("normal_03");
            cc.audioEngine.stopMusic();
        }, this);
        this.endlessButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("normal_endless");
            cc.audioEngine.stopMusic();
        }, this);
        this.cancelButtonNormal.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.closeNormal();
        }, this);


        this.level1ButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("underworld_01");
            cc.audioEngine.stopMusic();
        }, this);
        this.level2ButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("underworld_02");
            cc.audioEngine.stopMusic();
        }, this);
        this.level3ButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("underworld_03");
            cc.audioEngine.stopMusic();
        }, this);
        this.endlessButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            cc.director.loadScene("underworld_endless");
        }, this);
        this.cancelButtonUnder.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.closeUnder();
        }, this);

    }


    // map_name: map1, map2, map3, map4

    enterToEditMap(map_name: string){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + uid + '/current_editor').set(map_name);
        firebase.database().ref('user/' + uid + '/' + map_name).once('value').then((snapshot) => {
            if(snapshot.val() == null){
                let data = {
                    floors: [{x: -133.2, y: -252}],
                    walls: [{x: -415, y: 88}]
                };
                firebase.database().ref('user/' + uid + '/' + map_name).set(data);
            }
            this.scheduleOnce(() => {
                cc.director.loadScene("editor");
            }, 0.5);
        });
    }

    enterToPlayMap(map_name: string){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + uid + '/current_editor').set(map_name);
        firebase.database().ref('user/' + uid + '/' + map_name).once('value').then((snapshot) => {
            if(snapshot.val() == null){
                let data = {
                    floors: [{x: -133.2, y: -252}],
                    walls: [{x: -415, y: 88}]
                };
                firebase.database().ref('user/' + uid + '/' + map_name).set(data);
            }
            this.scheduleOnce(() => {
                cc.director.loadScene("editor_play");
            }, 0.5);
        });
    }
}
