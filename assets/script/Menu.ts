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

    private userName: string = null;
    private highScore: number = null;

    loadGame() {
        let action = cc.sequence(cc.moveBy(0.3, 275, 0), cc.moveBy(0.3, 275, 0));
        this.board.node.runAction(action);
        cc.audioEngine.stopMusic();
        //cc.director.loadScene("logIn");
    }

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
        let action = cc.sequence(cc.moveBy(0.3, 450, 0), cc.moveBy(0.3, 450, 0));
        this.questionBoard.node.runAction(action);
        let action1 = cc.sequence(cc.moveBy(0.3, 275, 0), cc.moveBy(0.3, 275, 0));
        this.board.node.runAction(action1);
    }

    closeQuestionBoard() {
        let action = cc.sequence(cc.moveBy(0.3, -450, 0), cc.moveBy(0.3, -450, 0));
        this.questionBoard.node.runAction(action);
        let action1 = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action1);
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

    start() {
        let action = cc.sequence(cc.moveBy(0.3, -275, 0), cc.moveBy(0.3, -275, 0));
        this.board.node.runAction(action);
        this.loadUserData();

        cc.find("Canvas/board/run").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadGame();
        }, this);

        cc.find("Canvas/board/leaderBoard").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadLeaderboard();
        }, this);

        cc.find("Canvas/board/question").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadQuestionBoard();
        }, this);

        cc.find("Canvas/board/signOut").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.signOut();
        }, this);

        cc.find("Canvas/questionBoard/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.closeQuestionBoard();
        }, this);

        cc.find("Canvas/leaderboard/closeButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.closeLeaderboard();
        }, this);

    }
}
