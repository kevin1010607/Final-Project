// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    @property(cc.Prefab)
    player: cc.Prefab = null;
    @property(cc.Prefab)
    boundary: cc.Prefab = null;
    @property(cc.Prefab)
    floor: cc.Prefab = null;
    @property(cc.Prefab)
    wall: cc.Prefab = null;


    private left_pressed: boolean = false;
    private right_pressed: boolean = false;
    private up_pressed: boolean = false;
    private down_pressed: boolean = false;

    private left_boundary: number = -1000;
    private right_boundary: number = 17000;
    private up_boundary: number = 980;
    private down_boundary: number = -1420;

    private is_test: boolean = false;
    private is_drag: boolean = false;
    private mouse_x: number = 0;
    private mouse_y: number = 0;

    private drag_object: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.playBGM();
        cc.find("Canvas/background").on(cc.Node.EventType.MOUSE_DOWN, this.placeObject, this);
        cc.find("Canvas/underworld").on(cc.Node.EventType.MOUSE_DOWN, this.placeObject, this);
        cc.find("Canvas").on(cc.Node.EventType.MOUSE_MOVE, this.updateMousePosition, this);

        let w = cc.find("Canvas/ground/wall");
        let f = cc.find("Canvas/ground/floor");
        w.on(cc.Node.EventType.MOUSE_DOWN, () => {this.changeToDrag(w);});
        f.on(cc.Node.EventType.MOUSE_DOWN, () => {this.changeToDrag(f);});

        for(let x = -970, y = -216.25; x < this.right_boundary; x += 60){
            let boundary = cc.instantiate(this.boundary);
            boundary.setPosition(x, y);
            this.boundary_node.addChild(boundary);
        }
    }

    update (dt) {
        this.cameraFollow();
        this.updateDrag();
    }

    handleTestOrStopBtn(){
        if(this.is_drag) return;
        let label: cc.Label = this.camera.getChildByName("test_or_stop").getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        if(this.is_test){
            // stop the test
            this.is_test = false;
            label.string = "test";
            cc.find("Canvas").getChildByName("player").destroy();
        }
        else{
            // start the test
            this.is_test = true;
            label.string = "stop";
            let player = cc.instantiate(this.player);
            cc.find("Canvas").addChild(player);
        }
    }

    handleBtn(event, prefab_name){
        if(this.is_drag || this.is_test) return;

        let object: cc.Node;
        if(prefab_name == "floor"){
            object = cc.instantiate(this.floor);
            cc.find("Canvas/ground").addChild(object);
        }
        else if(prefab_name == "wall"){
            object = cc.instantiate(this.wall);
            cc.find("Canvas/ground").addChild(object);
        }
        else{
            return;
        }
        object.opacity = 180;
        object.on(cc.Node.EventType.MOUSE_DOWN, () => {this.changeToDrag(object);});
        this.drag_object = object;
        this.scheduleOnce(() => {
            this.is_drag = true;
        }, 0.01);
    }

    placeObject(){
        if(!this.is_drag) return;
        this.drag_object.opacity = 255;
        this.drag_object = null;
        this.scheduleOnce(() => {
            this.is_drag = false;
        }, 0.01);
    }

    changeToDrag(node: cc.Node){
        if(this.is_drag) return;
        this.drag_object = node;
        this.drag_object.opacity = 180;
        this.scheduleOnce(() => {
            this.is_drag = true;
        }, 0.01);
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

        if(this.left_pressed) this.camera.x -= 20;
        if(this.right_pressed) this.camera.x += 20;
        if(this.up_pressed) this.camera.y += 20;
        if(this.down_pressed) this.camera.y -= 20;

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
