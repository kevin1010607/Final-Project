// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Circle extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property
    move_dir: number = 0; // 0: right, 1: left

    move_time: number = 0.6; // circle

    @property
    font_size: number = 160;

    font_up_amount: number = 120;

    @property(cc.Prefab)
    five_prefab: cc.Prefab = null

    @property(cc.Prefab)
    four_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    three_prefab: cc.Prefab = null

    @property(cc.Prefab)
    two_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    one_prefab: cc.Prefab = null

    start () {
        /*
        if(cc.find("Canvas/player").x < 1500){
            this.schedule(()=>{
                this.scheduleOnce(this.gen_5_prefab, 0);
                this.scheduleOnce(this.gen_4_prefab, 1);
                this.scheduleOnce(this.gen_3_prefab, 2);
                this.scheduleOnce(this.gen_2_prefab, 3);
                this.scheduleOnce(this.gen_1_prefab, 4);
                this.scheduleOnce(this.trigger, 5);
            }, 5 + this.move_time, cc.macro.REPEAT_FOREVER, 0);
        }
        */
    }
    
    trigger () { 
        var move_right = cc.rotateBy(this.move_time, -150);
        var move_left = cc.rotateBy(this.move_time, 150)
        if(this.move_dir == 0){
            this.node.runAction(move_right);
            this.move_dir = 1;
        }
        else{
            this.node.runAction(move_left);
            this.move_dir = 0;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.name == "player"){
            otherCollider.node.getComponent("Player").playerDead();
        }
    }

    update (dt) {
       
    }

    gen_5_prefab(){
        let five = cc.instantiate(this.five_prefab);
        five.color = new cc.Color(194, 3, 3, 255);
        five.getComponent(cc.Label).fontSize = this.font_size;
        five.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(five);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        five.runAction(action);
    }

    gen_4_prefab(){
        let four = cc.instantiate(this.four_prefab);
        four.color = new cc.Color(194, 3, 3, 255);
        four.getComponent(cc.Label).fontSize = this.font_size;
        four.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(four);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        four.runAction(action);
    }

    gen_3_prefab(){
        let three = cc.instantiate(this.three_prefab);
        three.color = new cc.Color(194, 3, 3, 255);
        three.getComponent(cc.Label).fontSize = this.font_size;
        three.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(three);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        three.runAction(action);
    }

    gen_2_prefab(){
        let two = cc.instantiate(this.two_prefab);
        two.color = new cc.Color(194, 3, 3, 255);
        two.getComponent(cc.Label).fontSize = this.font_size;
        two.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(two);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        two.runAction(action);
    }

    gen_1_prefab(){
        let one = cc.instantiate(this.one_prefab);
        one.color = new cc.Color(194, 3, 3, 255);
        one.getComponent(cc.Label).fontSize = this.font_size;
        one.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(one);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        one.runAction(action);
    }
}
