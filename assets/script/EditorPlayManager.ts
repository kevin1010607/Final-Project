// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DynamicSpike from "./DynamicSpike";
import StaticSpike from "./StaticSpike";

const {ccclass, property} = cc._decorator;
declare const firebase: any

@ccclass
export default class EditorPlayManager extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    // prefab
    @property(cc.Prefab)
    player_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    boundary_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    boundary_edge_prefab: cc.Prefab = null;
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
    @property(cc.Prefab)
    chain_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    gear_prefab: cc.Prefab = null;

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
    private chain_parent_node: cc.Node = null;
    private gear_parent_node: cc.Node = null;
    private boundary_node: cc.Node = null;
    private left_boundary_node: cc.Node = null;
    private right_boundary_node: cc.Node = null;
    private up_boundary_node: cc.Node = null;
    private down_boundary_node: cc.Node = null;

    // background boundary
    private left_boundary: number = -1000;
    private right_boundary: number = 17000;
    private up_boundary: number = 980;
    private down_boundary: number = -1420;

    private map_name: string = "";


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        this.player.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
        this.scheduleOnce(() => {
            this.player.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        }, 1.5);
    }

    start () {
        this.bindingParentNode();
        this.placeAllBlock();
        this.createBoundary();
    }

    // update (dt) {}

    createBlock(prefab_name: string, x: number, y: number){
        let object: cc.Node;
        if(prefab_name == "floor"){
            object = cc.instantiate(this.floor_prefab);
            object.setPosition(x, y);
            this.floor_parent_node.addChild(object);
        }
        else if(prefab_name == "wall"){
            object = cc.instantiate(this.wall_prefab);
            object.setPosition(x, y);
            this.wall_parent_node.addChild(object);
        }
        else if(prefab_name == "light"){
            object = cc.instantiate(this.search_light_prefab);
            object.setPosition(x, y);
            this.search_light_parent_node.addChild(object);
        }
        else if(prefab_name == "launcher"){
            object = cc.instantiate(this.launcher_prefab);
            object.setPosition(x, y);
            this.launcher_parent_node.addChild(object);
        }
        else if(prefab_name == "hammer"){
            object = cc.instantiate(this.hammer_prefab);
            object.setPosition(x, y);
            this.hammer_parent_node.addChild(object);
        }
        else if(prefab_name == "blade"){
            object = cc.instantiate(this.blade_prefab);
            object.setPosition(x, y);
            this.blade_parent_node.addChild(object);
        }
        else if(prefab_name == "lava"){
            object = cc.instantiate(this.lava_prefab);
            object.setPosition(x, y);
            this.lava_parent_node.addChild(object);
        }
        else if(prefab_name == "box"){
            object = cc.instantiate(this.box_prefab);
            object.setPosition(x, y);
            this.box_parent_node.addChild(object);
        }
        else if(prefab_name == "fake"){
            object = cc.instantiate(this.fake_prefab);
            object.setPosition(x, y);
            this.fake_parent_node.addChild(object);
        }
        else if(prefab_name == "spike1"){
            object = cc.instantiate(this.spike1_prefab);
            object.setPosition(x, y);
            this.spike1_parent_node.addChild(object);
        }
        else if(prefab_name == "spike2"){
            object = cc.instantiate(this.spike2_prefab);
            object.setPosition(x, y);
            this.spike2_parent_node.addChild(object);
        }
        else if(prefab_name == "spike3"){
            object = cc.instantiate(this.spike3_prefab);
            object.setPosition(x, y);
            this.spike3_parent_node.addChild(object);
            object.rotation = 180;
            object.getComponent(StaticSpike).direction = 0;
        }
        else if(prefab_name == "spike4"){
            object = cc.instantiate(this.spike4_prefab);
            object.setPosition(x, y);
            this.spike4_parent_node.addChild(object);
        }
        else if(prefab_name == "chain"){
            object = cc.instantiate(this.chain_prefab);
            object.setPosition(x, y);
            this.chain_parent_node.addChild(object);
        }
        else if(prefab_name == "gear"){
            object = cc.instantiate(this.gear_prefab);
            object.setPosition(x, y);
            this.gear_parent_node.addChild(object);
        }
        else{
            return;
        }
    }

    bindingParentNode(){
        let canvas_node = cc.find("Canvas");
        this.boundary_node = canvas_node.getChildByName("boundarys");
        this.left_boundary_node = canvas_node.getChildByName("left_boundary");
        this.right_boundary_node = canvas_node.getChildByName("right_boundary");
        this.up_boundary_node = canvas_node.getChildByName("up_boundary");
        this.down_boundary_node = canvas_node.getChildByName("down_boundary");

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
        this.chain_parent_node = enemies_node.getChildByName("chains");
        this.gear_parent_node = enemies_node.getChildByName("gears");
    }

    placeAllBlock(){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('user/'+uid+'/current_editor').once('value').then((snapShot) => {
            this.map_name = snapShot.val();
            // floor
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/floors').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("floor", node.x, node.y);
                });
            });
            // wall
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/walls').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("wall", node.x, node.y);
                });
            });
            // search light
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/search_lights').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("light", node.x, node.y);
                });
            });
            // launcher
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/launchers').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("launcher", node.x, node.y);
                });
            });
            // hammer
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/hammers').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("hammer", node.x, node.y);
                });
            });
            // blade
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/blades').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("blade", node.x, node.y);
                });
            });
            // lava
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/lavas').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("lava", node.x, node.y);
                });
            });
            // box
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/boxes').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("box", node.x, node.y);
                });
            });
            // fake
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/fakes').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("fake", node.x, node.y);
                });
            });
            // spike1
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike1s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("spike1", node.x, node.y);
                });
            });
            // spike2
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike2s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("spike2", node.x, node.y);
                });
            });
            // spike3
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike3s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("spike3", node.x, node.y);
                });
            });
            // spike4
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/spike4s').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("spike4", node.x, node.y);
                });
            });
            // chain
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/chains').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("chain", node.x, node.y);
                });
            });
            // gear
            firebase.database().ref('user/'+uid+'/'+this.map_name+'/gears').once('value').then((snapShot) => {
                if(snapShot.val() == null) return;
                snapShot.val().forEach((node) => {
                    this.createBlock("gear", node.x, node.y);
                });
            });
        });
    }

    createBoundary(){
        // boundary
        for(let x = this.left_boundary+30, y = -216.25; x < this.right_boundary; x += 60){
            let boundary = cc.instantiate(this.boundary_prefab);
            boundary.setPosition(x, y);
            this.boundary_node.addChild(boundary);
        }

        // left spike
        for(let x = this.left_boundary+20, y = this.up_boundary; y >= this.down_boundary; y -= 60){
            let spike = cc.instantiate(this.boundary_edge_prefab);
            spike.setPosition(x, y);
            spike.rotation = 90;
            spike.getComponent(StaticSpike).direction = 3;
            this.left_boundary_node.addChild(spike);
        }

        // right spike
        for(let x = this.right_boundary-20, y = this.up_boundary; y >= this.down_boundary; y -= 60){
            let spike = cc.instantiate(this.boundary_edge_prefab);
            spike.setPosition(x, y);
            spike.rotation = 270;
            spike.getComponent(StaticSpike).direction = 2;
            this.right_boundary_node.addChild(spike);
        }

        // up spike
        // for(let x = this.left_boundary, y = this.up_boundary-20; x <= this.right_boundary; x += 60){
        //     let spike = cc.instantiate(this.boundary_edge_prefab);
        //     spike.setPosition(x, y);
        //     spike.rotation = 180;
        //     spike.getComponent(StaticSpike).direction = 0;
        //     this.up_boundary_node.addChild(spike);
        // }

        // down spike
        // for(let x = this.left_boundary, y = this.down_boundary+20; x <= this.right_boundary; x += 60){
        //     let spike = cc.instantiate(this.boundary_edge_prefab);
        //     spike.setPosition(x, y);
        //     spike.rotation = 0;
        //     spike.getComponent(StaticSpike).direction = 1;
        //     this.down_boundary_node.addChild(spike);
        // }
    }
}
