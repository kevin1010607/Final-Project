// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Player from "./Player";
import SearchLight from "./SearchLight";
import Launcher from "./Launcher";
import Hammer from "./Hammer";
import Blade from "./Blade";
import Lava from "./Lava";
import Box from "./Box";
import Fake from "./Fake";
import DynamicSpike from "./DynamicSpike";
import StaticSpike from "./StaticSpike";

const {ccclass, property} = cc._decorator;
declare const firebase: any

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
    @property(cc.Prefab)
    launcher_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    hammer_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    blade_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    lava_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    box_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    fake_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    spike1_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    spike2_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    spike3_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    spike4_prefab: cc.Prefab = null;

    // search light property
    @property(cc.Prefab)
    missile_prefab: cc.Prefab = null;
    @property(cc.AudioClip)
    search_audioclip: cc.AudioClip = null;
    // launcher property
    @property(cc.Prefab)
    bullet_prefab: cc.Prefab = null;
    // hammer property
    @property(cc.AudioClip)
    hammer_audioclip: cc.AudioClip = null;
    // lava property
    @property(cc.AudioClip)
    lava_effect_audioclip: cc.AudioClip = null;
    // fake property
    @property(cc.Prefab)
    broken_particle_prefab: cc.Prefab = null;
    // spike1 property
    @property(cc.AudioClip)
    spike_up_audioclip: cc.AudioClip = null;
    @property(cc.AudioClip)
    spike_down_audioclip: cc.AudioClip = null;

    // enemies node
    private floor_parent_node: cc.Node = null;
    private wall_parent_node: cc.Node = null;
    private search_light_parent_node: cc.Node = null;
    private launcher_parent_node: cc.Node = null;
    private hammer_parent_node: cc.Node = null;
    private blade_parent_node: cc.Node = null;
    private lava_parent_node: cc.Node = null;
    private box_parent_node: cc.Node = null;
    private fake_parent_node: cc.Node = null;
    private spike1_parent_node: cc.Node = null;
    private spike2_parent_node: cc.Node = null;
    private spike3_parent_node: cc.Node = null;
    private spike4_parent_node: cc.Node = null;

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

    private cold_time_test_stop: number = 1;
    private remaining_time_test_stop: number = 0;
    private cold_time_store: number = 2;
    private remaining_time_store: number = 0;

    private drag_object: cc.Node = null;

    private map_name: string = "";

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

        this.bindingParentNode();
        this.placeAllBlock();

        // let f = this.floor_parent_node.getChildByName("floor");
        // let w = this.wall_parent_node.getChildByName("wall");
        // f.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, f);});
        // w.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, w);});

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
        if(this.is_drag || this.remaining_time_test_stop > 0.1) return;
        this.remaining_time_test_stop = this.cold_time_test_stop;
        let label: cc.Label = cc.find("Canvas/Main Camera/test_or_stop/Background/Label").getComponent(cc.Label);
        if(this.is_test){
            // stop the test
            console.log("Stop!");
            this.is_test = false;
            label.string = "Test";
            this.player.getComponent(Player).playerDead();
            this.scheduleOnce(() => {
                this.player.destroy();
            }, 0.6);
            this.toggleAllEnemyScript(false);
        }
        else{
            // start the test
            console.log("Test!");
            this.is_test = true;
            label.string = "Stop";
            this.player = cc.instantiate(this.player_prefab);
            cc.find("Canvas").addChild(this.player);
            this.toggleAllEnemyScript(true);
        }
    }

    handleStoreBtn(){
        if(this.is_drag || this.is_test || this.remaining_time_store > 0.1) return;
        this.remaining_time_store = this.cold_time_store;
        console.log("Store!");
        let uid = firebase.auth().currentUser.uid;

        // floor
        let floors = [];
        this.floor_parent_node.children.forEach((i) => {
            floors.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/floors').set(floors);

        // wall
        let walls = [];
        this.wall_parent_node.children.forEach((i) => {
            walls.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/walls').set(walls);

        let search_lights = [];
        this.search_light_parent_node.children.forEach((i) => {
            search_lights.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/search_lights').set(search_lights);

        let launchers = [];
        this.launcher_parent_node.children.forEach((i) => {
            launchers.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/launchers').set(launchers);

        let hammers = [];
        this.hammer_parent_node.children.forEach((i) => {
            hammers.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/hammers').set(hammers);

        let blades = [];
        this.blade_parent_node.children.forEach((i) => {
            blades.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/blades').set(blades);

        let lavas = [];
        this.lava_parent_node.children.forEach((i) => {
            lavas.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/lavas').set(lavas);

        let boxes = [];
        this.box_parent_node.children.forEach((i) => {
            boxes.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/boxes').set(boxes);

        let fakes = [];
        this.fake_parent_node.children.forEach((i) => {
            fakes.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/fakes').set(fakes);

        let spike1s = [];
        this.spike1_parent_node.children.forEach((i) => {
            spike1s.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike1s').set(spike1s);

        let spike2s = [];
        this.spike2_parent_node.children.forEach((i) => {
            spike2s.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike2s').set(spike2s);

        let spike3s = [];
        this.spike3_parent_node.children.forEach((i) => {
            spike3s.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike3s').set(spike3s);

        let spike4s = [];
        this.spike4_parent_node.children.forEach((i) => {
            spike4s.push({x: i.x, y: i.y});
        });
        firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike4s').set(spike4s);
    }

    handleMenuBtn(){
        cc.audioEngine.stopMusic();
        cc.director.loadScene("menu");
    }

    handleBtn(event, prefab_name, drag=true, x=null, y=null){
        if(this.is_drag) return;

        let object: cc.Node;
        if(prefab_name == "floor"){
            object = cc.instantiate(this.floor_prefab);
            if(x && y) object.setPosition(x, y);
            this.floor_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "wall"){
            object = cc.instantiate(this.wall_prefab);
            if(x && y) object.setPosition(x, y);
            this.wall_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "light" && !this.is_test){
            object = cc.instantiate(this.search_light_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(SearchLight).destroy();
            this.search_light_parent_node.addChild(object);
        }
        else if(prefab_name == "launcher" && !this.is_test){
            object = cc.instantiate(this.launcher_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Launcher).destroy();
            this.launcher_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "hammer" && !this.is_test){
            object = cc.instantiate(this.hammer_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Hammer).destroy();
            this.hammer_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "blade" && !this.is_test){
            object = cc.instantiate(this.blade_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Blade).destroy();
            this.blade_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "lava" && !this.is_test){
            object = cc.instantiate(this.lava_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Lava).destroy();
            this.lava_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "box" && !this.is_test){
            object = cc.instantiate(this.box_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Box).destroy();
            this.box_parent_node.addChild(object);
            object.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "fake" && !this.is_test){
            object = cc.instantiate(this.fake_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(Fake).destroy();
            this.fake_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "spike1" && !this.is_test){
            object = cc.instantiate(this.spike1_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(DynamicSpike).destroy();
            this.spike1_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "spike2" && !this.is_test){
            object = cc.instantiate(this.spike2_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(StaticSpike).destroy();
            this.spike2_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else if(prefab_name == "spike3" && !this.is_test){
            object = cc.instantiate(this.spike3_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(StaticSpike).destroy();
            this.spike3_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
            object.rotation = 180;
        }
        else if(prefab_name == "spike4" && !this.is_test){
            object = cc.instantiate(this.spike4_prefab);
            if(x && y) object.setPosition(x, y);
            object.getComponent(StaticSpike).destroy();
            this.spike4_parent_node.addChild(object);
            if(drag) object.getComponent(cc.RigidBody).active = false;
        }
        else{
            return;
        }

        object.on(cc.Node.EventType.MOUSE_DOWN, (e) => {this.changeToDragOrCancel(e, object);});
        if(drag){
            object.opacity = 180;
            this.drag_object = object;
            this.scheduleOnce(() => {
                this.is_drag = true;
            }, 0.01);
        }
    }

    placeOrCancelObject(event){
        if(!this.is_drag) return;
        // left button
        if(event.getButton() == 0){
            this.drag_object.opacity = 255;

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
            
            let rigid_body = this.drag_object.getComponent(cc.RigidBody);
            if(rigid_body) rigid_body.active = false;

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

    toggleAllEnemyScript(enabled: boolean){
        cc.audioEngine.stopAllEffects();
        this.toggleSearchLightScript(enabled);
        this.toggleLauncherScript(enabled);
        this.toggleHammerScript(enabled);
        this.toggleBladeScript(enabled);
        this.toggleLavaScript(enabled);
        this.toggleBoxScript(enabled);
        this.toggleFakeScript(enabled);
        this.toggleSpike1Script(enabled);
        this.toggleSpike2Script(enabled);
        this.toggleSpike3Script(enabled);
        this.toggleSpike4Script(enabled);
    }

    toggleSearchLightScript(enabled: boolean){
        // Search light
        this.search_light_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(SearchLight);
                cp.missilePrefab = this.missile_prefab;
                cp.player = this.player.getComponent(Player);
                cp.search = this.search_audioclip;
            }
            else{
                let cp = i.getComponent(SearchLight);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleLauncherScript(enabled: boolean){
        // Launcher
        this.launcher_parent_node.children.forEach((i) => {
            if(i.name != "launcher") return;
            if(enabled){
                let cp = i.addComponent(Launcher);
                cp.bulletPrefab = this.bullet_prefab;
            }
            else{
                let cp = i.getComponent(Launcher);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleHammerScript(enabled: boolean){
        // Hammer
        this.hammer_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(Hammer);
                cp.hammer = this.hammer_audioclip;
            }
            else{
                let cp = i.getComponent(Hammer);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleBladeScript(enabled: boolean){
        // Blade
        this.blade_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(Blade);
            }
            else{
                let cp = i.getComponent(Blade);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleLavaScript(enabled: boolean){
        this.lava_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(Lava);
                cp.lava_effect = this.lava_effect_audioclip;
            }
            else{
                let cp = i.getComponent(Lava);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleBoxScript(enabled: boolean){
        this.box_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(Box);
                i.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            }
            else{
                i.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
                i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                let cp = i.getComponent(Box);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleFakeScript(enabled: boolean){
        this.fake_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(Fake);
                cp.broken_particle = this.broken_particle_prefab;
            }
            else{
                i.getComponent(cc.Sprite).enabled = true;
                i.getComponent(cc.RigidBody).active = true;
                let cp = i.getComponent(Fake);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleSpike1Script(enabled: boolean){
        this.spike1_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(DynamicSpike);
                cp.spike_up = this.spike_up_audioclip;
                cp.spike_down = this.spike_down_audioclip;
            }
            else{
                let cp = i.getComponent(DynamicSpike);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleSpike2Script(enabled: boolean){
        this.spike2_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(StaticSpike);
                cp.direction = 1;
            }
            else{
                let cp = i.getComponent(StaticSpike);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleSpike3Script(enabled: boolean){
        this.spike3_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(StaticSpike);
                cp.direction = 0;
                i.rotation = 180;
            }
            else{
                let cp = i.getComponent(StaticSpike);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    toggleSpike4Script(enabled: boolean){
        this.spike4_parent_node.children.forEach((i) => {
            if(enabled){
                let cp = i.addComponent(StaticSpike);
                cp.direction = 1;
            }
            else{
                let cp = i.getComponent(StaticSpike);
                i.setPosition(cp.pos_x, cp.pos_y);
                i.stopAllActions();
                cp.unscheduleAllCallbacks();
                cp.destroy();
            }
        });
    }

    updateColdTime(dt){
        this.remaining_time_test_stop = Math.max(0, this.remaining_time_test_stop-dt);
        this.remaining_time_store = Math.max(0, this.remaining_time_store-dt);
    }

    updateDrag(){
        if(!this.is_drag || !this.drag_object) return;
        this.drag_object.setPosition(this.mouse_x-480+this.camera.x, this.mouse_y-320+this.camera.y);
    }

    updateMousePosition(event){
        this.mouse_x = event.getLocation().x;
        this.mouse_y = event.getLocation().y;
    }

    bindingParentNode(){
        let ground_node = cc.find("Canvas/ground");
        this.floor_parent_node = ground_node.getChildByName("floors");
        this.wall_parent_node = ground_node.getChildByName("walls");
        let enemies_node = cc.find("Canvas/enemies");
        this.search_light_parent_node = enemies_node.getChildByName("search_lights");
        this.launcher_parent_node = enemies_node.getChildByName("launchers");
        this.hammer_parent_node = enemies_node.getChildByName("hammers");
        this.blade_parent_node = enemies_node.getChildByName("blades");
        this.lava_parent_node = enemies_node.getChildByName("lavas");
        this.box_parent_node = enemies_node.getChildByName("boxes");
        this.fake_parent_node = enemies_node.getChildByName("fakes");
        this.spike1_parent_node = enemies_node.getChildByName("spike1s");
        this.spike2_parent_node = enemies_node.getChildByName("spike2s");
        this.spike3_parent_node = enemies_node.getChildByName("spike3s");
        this.spike4_parent_node = enemies_node.getChildByName("spike4s");
    }

    placeAllBlock(){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('user/'+uid+'/current_editor').once('value').then((snapShot) => {
            this.map_name = snapShot.val();
            // floor
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/floors').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "floor", false, node.x, node.y);
                });
            });
            // wall
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/walls').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "wall", false, node.x, node.y);
                });
            });
            // search light
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/search_lights').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "light", false, node.x, node.y);
                });
            });
            // launcher
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/launchers').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "launcher", false, node.x, node.y);
                });
            });
            // hammer
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/hammers').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "hammer", false, node.x, node.y);
                });
            });
            // blade
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/blades').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "blade", false, node.x, node.y);
                });
            });
            // lava
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/lavas').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "lava", false, node.x, node.y);
                });
            });
            // box
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/boxes').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "box", false, node.x, node.y);
                });
            });
            // fake
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/fakes').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "fake", false, node.x, node.y);
                });
            });
            // spike1
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike1s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "spike1", false, node.x, node.y);
                });
            });
            // spike2
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike2s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "spike2", false, node.x, node.y);
                });
            });
            // spike3
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike3s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "spike3", false, node.x, node.y);
                });
            });
            // spike4
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike4s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.handleBtn(null, "spike4", false, node.x, node.y);
                });
            });
        });
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
