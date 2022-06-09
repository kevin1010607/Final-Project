// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

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

    loadSignUp() {
        let action = cc.sequence(cc.moveBy(0.4, 350, 0), cc.moveBy(0.4, 350, 0));
        this.board.node.runAction(action);
        let action2 = cc.sequence(cc.moveBy(0.4, -350, 0), cc.moveBy(0.4, -350, 0));
        this.boardSignUp.node.runAction(action2);

        // cc.director.loadScene("signUp");
    }

    loadLogIn() {
        let action = cc.sequence(cc.moveBy(0.4, 350, 0), cc.moveBy(0.4, 350, 0));
        this.board.node.runAction(action);
        let action2 = cc.sequence(cc.moveBy(0.4, -350, 0), cc.moveBy(0.4, -350, 0));
        this.boardLogIn.node.runAction(action2);
        //cc.director.loadScene("logIn");
    }

    //返回首頁
    loadboard(who: number) {
        cc.log(this.board.node.position.x);
        let action = cc.sequence(cc.moveBy(0.4, -350, 0), cc.moveBy(0.4, -350, 0));
        this.board.node.runAction(action);
        if (who == 0) {
            let action2 = cc.sequence(cc.moveBy(0.4, 350, 0), cc.moveBy(0.4, 350, 0));
            this.boardSignUp.node.runAction(action2);
        } else {
            let action2 = cc.sequence(cc.moveBy(0.4, 350, 0), cc.moveBy(0.4, 350, 0));
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
                    alert("成功登入\n");
                    CC.director.loadScene("menu");
                }
            )
            .catch(
                function (error) {
                    alert(error.message);
                }
            );

    }

    signUP() {
        let action = cc.sequence(cc.moveBy(0.4, 350, 0), cc.moveBy(0.4, 350, 0));
        let action2 = cc.sequence(cc.moveBy(0.4, -350, 0), cc.moveBy(0.4, -350, 0));
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
        })
            .then(() => {
                var user_name = Email.substr(0, Email.indexOf('@'));
                var user_name = user_name.toLowerCase();
                firebase.database().ref('user/' + user_name)
                    .set({ name: user_name, email: Email, score: 0 });

                // 
                firebase.database().ref('leaderboard/' + user_name)
                    .set({ name: user_name, highest_score: 0 });
            })
            .catch((e) => {
                alert(e.message);
            });
    }

    start() {
        let action = cc.sequence(cc.moveBy(0.4, -350, 0), cc.moveBy(0.4, -350, 0));
        this.board.node.runAction(action);

        cc.find("Canvas/board/logIn").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadLogIn();
        }, this);

        cc.find("Canvas/board/signUp").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadSignUp();
        }, this);

        cc.find("Canvas/boardSignUp/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadboard(0);
        }, this);

        cc.find("Canvas/boardSignUp/signUp").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.signUP();
        }, this);

        cc.find("Canvas/boardLogIn/cancelButton").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.loadboard(1);
        }, this);

        cc.find("Canvas/boardLogIn/logIn").on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.logIn();
        }, this);

    }
}
