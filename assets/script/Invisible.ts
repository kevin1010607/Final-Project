// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Invisible extends cc.Component {

    no_detection: boolean = false; // for search_light.ts
    
    /// for font
    
    font_up_amount: number = 60;
    
    @property(cc.Prefab)
    inivisible_prefab: cc.Prefab = null

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
    
    ///

    @property(cc.Sprite)
    skill:cc.Sprite = null; //技能圖

    @property(cc.Label)
    time_label:cc.Label = null;//顯示技能冷卻剩餘時間的文字

    @property
    time:number = 30; //技能冷卻時間

    @property
    can_show_label:boolean = true;//是否顯示文字

    onLoad(){
        this.skill.fillRange = 1;//遊戲開始的時候技能的填充範圍是1
    }

    update(dt:number){

        if(this.skill.fillRange != 1){//如果技能的填充不為1 也就是說已經使用了技能
            this.skill.fillRange += dt / this.time;//恢復技能   每幀恢復的值為影格率 / 技能冷卻時間
            this.time_label.string = Math.floor(((1 - this.skill.fillRange) * this.time)).toString();//每幀更新技能剩餘時間
            //技能剩餘時間首先 1 - 技能圖示的填充度再 * 技能冷卻時間，最後Math.floor取整

            if(this.can_show_label == true){//如果可以顯示文字
                this.time_label.node.active = true;//顯示技能冷卻剩餘時間
            }        
        }
        
        if(this.skill.fillRange == 1){//如果技能圖示的填充為1 也就是說技能還沒被使用
            this.skill.getComponent(cc.Button).interactable = true;//啟動按鈕
            this.time_label.node.active = false; //隱藏技能冷卻剩餘時間
        }
    }

    click_callback(){ //按下技能按鈕時的事件
        this.skill.fillRange = 0;//技能填充設定為0
        this.skill.getComponent(cc.Button).interactable = false; //禁用按鈕
        cc.find("Canvas/player").opacity = 100;
        this.no_detection = true;
        // console.log(cc.find("Canvas/player").getComponent("Player").is_hidden);
        
        this.scheduleOnce(this.gen_inivisible_prefab, 0);
        this.scheduleOnce(this.gen_5_prefab, 0);
        this.scheduleOnce(this.gen_4_prefab, 1);
        this.scheduleOnce(this.gen_3_prefab, 2);
        this.scheduleOnce(this.gen_2_prefab, 3);
        this.scheduleOnce(this.gen_1_prefab, 4);
        this.scheduleOnce(() =>{ // skill end
            cc.find("Canvas/Main Camera/invisible").destroy();
            cc.find("Canvas/player").opacity = 255;
            this.no_detection = false;
        }, 5);
    }

    gen_5_prefab(){
        let five = cc.instantiate(this.five_prefab);
        five.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(five);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        five.runAction(action);
    }

    gen_4_prefab(){
        let four = cc.instantiate(this.four_prefab);
        four.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(four);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        four.runAction(action);
    }

    gen_3_prefab(){
        let three = cc.instantiate(this.three_prefab);
        three.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(three);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        three.runAction(action);
    }

    gen_2_prefab(){
        let two = cc.instantiate(this.two_prefab);
        two.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(two);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        two.runAction(action);
    }

    gen_1_prefab(){
        let one = cc.instantiate(this.one_prefab);
        one.setPosition(cc.find("Canvas/player").x, cc.find("Canvas/player").y + this.font_up_amount);
        cc.find("Canvas").addChild(one);
        let action = cc.spawn(cc.moveBy(1, 0, 20), cc.scaleBy(1, 0.25, 0.25) , cc.fadeOut(1));
        one.runAction(action);
    }

    gen_inivisible_prefab(){
        var inivisible = cc.instantiate(this.inivisible_prefab);
        inivisible.setPosition(0, 200);
        cc.find("Canvas/Main Camera").addChild(inivisible);
    }
}
