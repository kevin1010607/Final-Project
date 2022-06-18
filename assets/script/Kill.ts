// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Kill extends cc.Component {

    is_kill: boolean = false;

    @property(cc.Sprite)
    skill:cc.Sprite = null;  // 技能圖

    @property(cc.Label)
    time_label:cc.Label = null; // 顯示技能冷卻剩餘時間的文字

    @property
    time:number = 30;  // 技能冷卻時間

    @property
    can_show_label:boolean = true; // 是否顯示文字

    onLoad(){
        this.skill.fillRange = 1; // 遊戲開始的時候技能的填充範圍是 1
    }

    update(dt:number){

        if(this.skill.fillRange != 1){ // 如果技能的填充不為1 也就是說已經使用了技能
            this.skill.fillRange += dt / this.time; // 恢復技能   每幀恢復的值為影格率 / 技能冷卻時間
            this.time_label.string = Math.floor(((1 - this.skill.fillRange) * this.time)).toString();//每幀更新技能剩餘時間
            // 技能剩餘時間首先 1 - 技能精靈的填充度再 * 技能冷卻時間，最後Math.floor取整

            if(this.can_show_label == true){ // 如果可以顯示文字
                this.time_label.node.active = true; // 顯示技能冷卻剩餘時間
            }        
        }
        
        if(this.skill.fillRange == 1){ // 如果技能圖示的填充為1 也就是說技能還沒被使用
            this.skill.getComponent(cc.Button).interactable = true;  // 啟動按鈕
            this.time_label.node.active = false; // 隱藏技能冷卻剩餘時間
        }
    }

    click_callback(){ //按下技能按鈕時的事件
        this.skill.fillRange = 0;// 技能填充設為 0
        this.skill.getComponent(cc.Button).interactable = false; // 禁用按鈕
        this.is_kill = true;
        this.scheduleOnce(()=>{
            this.is_kill = false;
        }, 1);
    }
}
