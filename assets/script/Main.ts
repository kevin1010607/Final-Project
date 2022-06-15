// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
declare const firebase: any

@ccclass
export default class Main extends cc.Component {

    @property(cc.Sprite)
    board: cc.Sprite = null;

    @property(cc.Sprite)
    boardSignUp: cc.Sprite = null;

    @property(cc.Sprite)
    boardLogIn: cc.Sprite = null;

    @property(cc.EditBox)
    emailEditBoxSignUp: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBoxSignUp: cc.EditBox = null;

    @property(cc.EditBox)
    emailEditBoxLogIn: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBoxLogIn: cc.EditBox = null;

    @property(cc.AudioClip)
    background_music: cc.AudioClip = null;

    @property(cc.AudioClip)
    button_effect: cc.AudioClip = null;

    @property(cc.AudioClip)
    button2_effect: cc.AudioClip = null;

    moving_distance: number = 230;

    loadSignUp() {
        let action = cc.sequence(cc.moveBy(0.4, this.moving_distance + 50, 0), cc.moveBy(0.4, this.moving_distance + 50, 0));
        this.board.node.runAction(action);
        let action2 = cc.sequence(cc.moveBy(0.4, -this.moving_distance, 0), cc.moveBy(0.4, -this.moving_distance, 0));
        this.boardSignUp.node.runAction(action2);

        // cc.director.loadScene("signUp");
    }

    loadLogIn() {
        let action = cc.sequence(cc.moveBy(0.4, this.moving_distance + 50, 0), cc.moveBy(0.4, this.moving_distance + 50, 0));
        this.board.node.runAction(action);
        let action2 = cc.sequence(cc.moveBy(0.4, -this.moving_distance, 0), cc.moveBy(0.4, -this.moving_distance, 0));
        this.boardLogIn.node.runAction(action2);
        //cc.director.loadScene("logIn");
    }

    //返回首頁
    loadboard(who: number) {
        let action = cc.sequence(cc.moveBy(0.4, -this.moving_distance - 50, 0), cc.moveBy(0.4, -this.moving_distance - 50, 0));
        this.board.node.runAction(action);
        if (who == 0) {
            let action2 = cc.sequence(cc.moveBy(0.4, this.moving_distance, 0), cc.moveBy(0.4, this.moving_distance, 0));
            this.boardSignUp.node.runAction(action2);
        } else {
            let action2 = cc.sequence(cc.moveBy(0.4, this.moving_distance, 0), cc.moveBy(0.4, this.moving_distance, 0));
            this.boardLogIn.node.runAction(action2);
        }
    }

    logIn() {
        var Email = this.emailEditBoxLogIn.string;
        let Password = this.passwordEditBoxLogIn.string;
        let CC = cc;
        firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then(
                function (error) {
                    alert("Log in sucessfully\n");
                    CC.director.loadScene("menu");
                    //CC.audioEngine.stopMusic();
                }
            )
            .catch(
                function (error) {
                    alert(error.message);
                }
            );

    }

    signUP() {
        let action = cc.sequence(cc.moveBy(0.4, this.moving_distance, 0), cc.moveBy(0.4, this.moving_distance, 0));
        let action2 = cc.sequence(cc.moveBy(0.4, -this.moving_distance, 0), cc.moveBy(0.4, -this.moving_distance, 0));
        var Email = this.emailEditBoxSignUp.string;
        let Password = this.passwordEditBoxSignUp.string;
        let THIS = this;
        // cc.director.loadScene("log");
        firebase.auth().createUserWithEmailAndPassword(Email, Password).then((result) => {
            // cc.find("Canvas/Main Camera/menu_bg/button_orange/Email").getComponent(cc.EditBox).string = "";
            // cc.find("Canvas/Main Camera/menu_bg/button_orange/Password").getComponent(cc.EditBox).string = "";
            THIS.boardSignUp.node.runAction(action);
            THIS.boardLogIn.node.runAction(action2);
            alert("Sign up successfully!");

        }).then(() => {
            let user = firebase.auth().currentUser;
            let uid = user.uid;
            var user_name = Email.substr(0, Email.indexOf('@'));
            user_name = user_name.toLowerCase();
            firebase.database().ref('user/' + uid).set({ name: user_name, email: Email, score: 0 });
            firebase.database().ref('leaderboard/' + uid).set({ name: user_name, highest_score: 0 });

        }).catch((e) => {
            alert(e.message);
        });
    }

    start() {
        let action = cc.sequence(cc.moveBy(0.4, -this.moving_distance - 20, 0), cc.moveBy(0.4, -this.moving_distance - 20, 0)).easing(cc.easeOut(1.5));
        this.board.node.runAction(action);
        cc.audioEngine.playMusic(this.background_music, true);
        cc.audioEngine.setMusicVolume(0.8);

        cc.find("Canvas/board/logIn").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.loadLogIn();
        }, this);

        cc.find("Canvas/board/signUp").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.loadSignUp();
        }, this);

        cc.find("Canvas/boardSignUp/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.loadboard(0);
        }, this);

        cc.find("Canvas/boardSignUp/signUp").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.signUP();
        }, this);

        cc.find("Canvas/boardLogIn/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button2_effect, false);
            this.loadboard(1);
        }, this);

        cc.find("Canvas/boardLogIn/logIn").on(cc.Node.EventType.MOUSE_DOWN, () => {
            cc.audioEngine.playEffect(this.button_effect, false);
            this.logIn();
        }, this);

    }
}
