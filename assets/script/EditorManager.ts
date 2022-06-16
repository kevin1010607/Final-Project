// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Player from "./Player";
import SearchLight from "./SearchLight";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EditorManager extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Node)
    camera: cc.Node = null;
    @property(cc.Node)
    boundary_node: cc.Node = null;

    // prefab
    @property(cc.Prefab)
    player_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    boundary_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    floor_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    wall_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    search_light_prefab: cc.Prefab = null;

    // enemies
    private player: cc.Node = null;

    // keyboard
    private left_pressed: boolean = false;
    private right_pressed: boolean = false;
    private up_pressed: boolean = false;
    private down_pressed: boolean = false;

    // background boundary
    private left_boundary: number = -1000;
    private right_boundary: number = 17000;
    private up_boundary: number = 980;
    private down_boundary: number = -1420;

    private is_test: boolean = false;
    private is_drag: boolean = false;
    private mouse_x: number = 0;
    private mouse_y: number = 0;
    private cold_time: number = 0.5;
    private remaining_time: number = 0;

    private drag_object: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.playBGM();
        cc.find("Canvas/background").on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.placeOrCancelObject(e)}, this);
        cc.find("Canvas/underworld").on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.placeOrCancelObject(e)}, this);
        cc.find("Canvas").on(cc.Node.EventType.MOUSE_MOVE, this.updateMousePosition, this);

        let w = cc.find("Canvas/ground/wall");
        let f = cc.find("Canvas/ground/floor");
        w.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, w);});
        f.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, f);});

        for(let x = this.left_boundary+30, y = -216.25; x < this.right_boundary; x += 60){
            let boundary = cc.instantiate(this.boundary_prefab);
            boundary.setPosition(x, y);
            this.boundary_node.addChild(boundary);
        }
    }

    update (dt) {
        this.cameraFollow();
        this.updateDrag();
        this.updateColdTime(dt);
    }

    handleTestOrStopBtn(){
        if(this.is_drag || this.remaining_time != 0) return;
        this.remaining_time = this.cold_time;
        let label: cc.Label = cc.find("Canvas/Main Camera/test_or_stop/Background/Label").getComponent(cc.Label);
        if(this.is_test){
            // stop the test
            this.is_test = false;
            label.string = "test";
            this.player.getComponent(Player).playerDead();
            this.scheduleOnce(() => {
                this.player.destroy();
            }, 0.6);
            this.changeEnemyScript(false);
        }
        else{
            // start the test
            this.is_test = true;
            label.string = "stop";
            this.player = cc.instantiate(this.player_prefab);
            cc.find("Canvas").addChild(this.player);
            this.changeEnemyScript(true);
        }
    }

    handleBtn(event, prefab_name){
        if(this.is_drag) return;

        let object: cc.Node;
        if(prefab_name == "floor"){
            object = cc.instantiate(this.floor_prefab);
            cc.find("Canvas/ground").addChild(object);
            object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "wall"){
            object = cc.instantiate(this.wall_prefab);
            cc.find("Canvas/ground").addChild(object);
            object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "light" && !this.is_test){
            object = cc.instantiate(this.search_light_prefab);
            object.getComponent(SearchLight).enabled = false;
            cc.find("Canvas/enemies/search_lights").addChild(object);
        }
        else{
            return;
        }

        object.opacity = 180;
        object.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, object);});
        this.drag_object = object;
        this.scheduleOnce(() => {
            this.is_drag = true;
        }, 0.01);
    }

    placeOrCancelObject(event){
        if(!this.is_drag) return;
        // left button
        if(event.getButton() == 0){
            this.drag_object.opacity = 255;

            // floor or wall
            let rigid_body = this.drag_object.getComponent(cc.RigidBody);
            if(rigid_body) rigid_body.active = true;

            this.drag_object = null;
            this.scheduleOnce(() => {
                this.is_drag = false;
            }, 0.01);
        }
        // right butoon
        else if(event.getButton() == 2){
            let ans: boolean = confirm("Do you want to delete this object?");
            if(ans){
                this.drag_object.destroy();
                this.drag_object = null;
                this.scheduleOnce(() => {
                    this.is_drag = false;
                }, 0.01);
            }
        }
    }

    changeToDragOrCancel(event, node: cc.Node){
        if(this.is_drag) return;
        // left button
        if(event.getButton() == 0){
            this.drag_object = node;
            this.drag_object.opacity = 180;
            
            // floor or wall
            let rigid_body = this.drag_object.getComponent(cc.RigidBody);
            if(rigid_body) rigid_body.active = true;

            this.scheduleOnce(() => {
                this.is_drag = true;
            }, 0.01);
        }
        // right button
        else if(event.getButton() == 2){
            let ans: boolean = confirm("Do you want to delete this object?");
            if(ans) node.destroy();
        }
    }

    changeEnemyScript(enabled: boolean){
        // Search light
        let search_light_parent_node: cc.Node = cc.find("Canvas/enemies/search_lights");
        let search_light_scripts: SearchLight[] = search_light_parent_node.getComponentsInChildren(SearchLight);
        search_light_scripts.forEach((i) => {
            if(enabled){
                i.enabled = true;
                i.node.stopAllActions();
                let d = Math.random()*200+500, sec = Math.random()*2+2, dir = Math.random()<0.5?1:-1;
                i.node.runAction(cc.sequence(cc.moveBy(sec, dir*d, 0), cc.moveBy(sec, -dir*d, 0)).repeatForever());
                i.player = this.player.getComponent(Player);
            }
            else{
                i.node.setPosition(i.pos_x, i.pos_y);
                i.enabled = false;
                i.node.stopAllActions();
                i.player = null;
            }
        });
    }

    updateColdTime(dt){
        this.remaining_time = Math.max(0, this.remaining_time-dt);
    }

    updateDrag(){
        if(!this.is_drag || !this.drag_object) return;
        this.drag_object.setPosition(this.mouse_x-480+this.camera.x, this.mouse_y-320+this.camera.y);
    }

    updateMousePosition(event){
        this.mouse_x = event.getLocation().x;
        this.mouse_y = event.getLocation().y;
    }

    onKeyDown(event){
        switch(event.keyCode){
            case cc.macro.KEY.left:
                this.left_pressed = true;
                break;
            case cc.macro.KEY.right:
                this.right_pressed = true;
                break;
            case cc.macro.KEY.up:
                this.up_pressed = true;
                break;
            case cc.macro.KEY.down:
                this.down_pressed = true;
                break;
        }
    }

    onKeyUp(event){
        switch(event.keyCode){
            case cc.macro.KEY.left:
                this.left_pressed = false;
                break;
            case cc.macro.KEY.right:
                this.right_pressed = false;
                break;
            case cc.macro.KEY.up:
                this.up_pressed = false;
                break;
            case cc.macro.KEY.down:
                this.down_pressed = false;
                break;
        }
    }

    cameraFollow(){
        if(this.is_test) return;

        if(this.left_pressed) this.camera.x -= 40;
        if(this.right_pressed) this.camera.x += 40;
        if(this.up_pressed) this.camera.y += 40;
        if(this.down_pressed) this.camera.y -= 40;

        if(this.camera.x < this.left_boundary+this.canvas.designResolution.width/2) 
            this.camera.x = this.left_boundary+this.canvas.designResolution.width/2;
        if(this.camera.x > this.right_boundary-this.canvas.designResolution.width/2) 
            this.camera.x = this.right_boundary-this.canvas.designResolution.width/2;
        if(this.camera.y < this.down_boundary+this.canvas.designResolution.height/2) 
            this.camera.y = this.down_boundary+this.canvas.designResolution.height/2;
        if(this.camera.y > this.up_boundary-this.canvas.designResolution.height/2) 
            this.camera.y = this.up_boundary-this.canvas.designResolution.height/2;
    }

    playBGM(){
        cc.audioEngine.playMusic(this.bgm, true);
    }
}
