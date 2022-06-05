// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SearchLight extends cc.Component {

    private light: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.move();
        this.light = this.node.getChildByName('light');
    }

    // update (dt) {}

    move(){
        let action: cc.Action = cc.sequence(cc.moveBy(3, 600, 0), cc.moveBy(3, -600, 0)).repeatForever();
        this.node.runAction(action);
    }

    detectInLight(x: number, y: number){
        let light_x = this.node.x, light_y = this.node.y+this.light.y-this.light.height/2;
        let light_left_x = this.node.x-this.light.width/2, light_left_y = light_y+this.light.height;
        let light_right_x = this.node.x+this.light.width/2, light_right_y = light_left_y;
        let left_slope = (light_left_y-light_y)/(light_left_x-light_x);
        let right_slope = (light_right_y-light_y)/(light_right_x-light_x);
        let slope = (y-light_y)/(x-light_x);
        if(slope > left_slope && x > light_left_x) return true;
        if(slope < right_slope && x < light_right_x) return true;
        return false;
    }
}
