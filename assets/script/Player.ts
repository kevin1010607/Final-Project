// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // ******* Change this to the length of the map ******** //
    @property
    map_length: number = 0;

    reborn_position: cc.Vec3 = null;

    streak: cc.ParticleSystem = null;
    dead_anime: cc.ParticleSystem = null;
    camera: cc.Camera = null;

    sprite: cc.Node = null;
    current_speed: number = 0;
    moving_speed: number = 300;
    jumping_speed: number = 1000;
    streak_gravity: number = 0;

    on_ground: boolean = true;
    on_wall: boolean = false;
    is_hidden: boolean = false;
    is_Dead: boolean = false;

    wall_object: cc.PhysicsBoxCollider = null;

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.streak = cc.find("Canvas/player/streak").getComponent(cc.ParticleSystem);
        this.sprite = this.node.getChildByName("sprite");
        this.dead_anime = this.node.getChildByName("dead_particle").getComponent(cc.ParticleSystem);

        // ************** Camera has to be names as Main Camera ****************** //
        this.camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);

        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.reborn_position = new cc.Vec3(this.node.x, this.node.y, 0);
        this.streak_gravity = this.streak.gravity.x;
        this.streak.node.position.z = this.node.position.z -1;
    }

    update (dt) {
        this.movingUpdate(dt);
        this.cameraMove();

        if (this.on_wall && this.on_ground) this.playerHidden();
        else this.playerReveal();

        // ************** Just for example scene ************* //
        if (cc.director.getScene().name == "example") {
            cc.find("tmp_btn").x = this.camera.node.x + 60;
        }
    }

    playerReveal(){
        if(!this.is_hidden) return;
        this.is_hidden = false;
        let action = cc.tintTo(0.1, 255, 255, 255);
        this.sprite.runAction(action);
    }

    playerHidden(){
        if(this.is_hidden) return;
        this.is_hidden = true;
        let action = cc.tintTo(0.1, 0, 0, 0);
        this.sprite.runAction(action);
    }

    playerDead(){
        if (this.is_Dead) return;
        this.is_Dead = true;
        this.sprite.active = false;
        this.current_speed = 0;
        this.streak.stopSystem();
        this.dead_anime.resetSystem();
        this.scheduleOnce(function(){
            this.dead_anime.stopSystem();
        }, 0.35)
    }

    playerReset(){
        this.is_Dead = false;
        this.sprite.active = true;
        this.node.position = this.reborn_position;
        this.current_speed = 0;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.node.getComponent(cc.RigidBody).angularVelocity = 0;
        this.node.rotation = 0;
    }

    onKeyDown(event){
        var macro = cc.macro;
        switch(event.keyCode){
            case macro.KEY.left:
                this.turnLeft();
                break;
            case macro.KEY.right:
                this.turnRight();
                break;
            case macro.KEY.space:
                if(this.on_ground == true) this.jump();             
                break;
        }
    }

    onKeyUp(event){
        var macro = cc.macro;
        switch(event.keyCode){
            case macro.KEY.left:
                if (this.current_speed < 0 )this.current_speed = 0;
                break;
            case macro.KEY.right:
                if (this.current_speed > 0 ) this.current_speed = 0;
                break;
            case macro.KEY.space:
                break;
        }
    }

    onBeginContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        // *********** Grounds and Walls has to come from different rigid body ************** //

        // Touch the ground
        if (other.tag == 0 && Manifold.normal.y <= -0.9){
            this.on_ground = true;
        }

        // Touch the wall
        if(other.tag == 0 &&  Math.abs(Manifold.normal.x) >= 0.98){
            this.on_wall = true;
            this.wall_object = other;
        }
    }

    onEndContact(contact, self, other){
        var Manifold = contact.getWorldManifold();

        if(this.wall_object == null) return;

        // Leave the wall
        if(other.tag == 0 &&  other == this.wall_object){
            this.wall_object = null;
            this.on_wall = false;
        }
    }

    turnLeft(){
        if(this.is_Dead) return;
        if(this.streak.stopped && !this.is_hidden) this.streak.resetSystem();
        if(!this.on_ground) this.getComponent(cc.RigidBody).angularVelocity  = -500;
        this.current_speed = -this.moving_speed;
        this.streak.gravity.x = -this.streak_gravity;
    }

    turnRight(){
        if(this.is_Dead) return;
        if(this.streak.stopped && !this.is_hidden) this.streak.resetSystem();
        if(!this.on_ground) this.getComponent(cc.RigidBody).angularVelocity  = 500;
        this.current_speed = this.moving_speed;
        this.streak.gravity.x = this.streak_gravity;
    }

    movingUpdate(dt){
        if(this.is_Dead) return;
        if (this.node.y < -360) this.playerDead(); // for debuging
        this.node.x += this.current_speed * dt;
        if((this.current_speed == 0 && this.on_ground) || this.is_hidden) this.streak.stopSystem();
    }

    cameraMove(){
        if(this.is_Dead) return;
        this.camera.node.x = this.node.x;
        if (this.camera.node.x < 0) this.camera.node.x = 0;

        if (this.camera.node.x > this.map_length) this.camera.node.x = this.map_length;
    }

    jump(){
        if(this.is_Dead) return;
        if(this.streak.stopped) this.streak.resetSystem();
        this.streak.gravity.x = 0;
        this.on_ground = false;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumping_speed);
        if (this.current_speed == this.moving_speed) this.getComponent(cc.RigidBody).angularVelocity  = 500;
        else if (this.current_speed == -this.moving_speed) this.getComponent(cc.RigidBody).angularVelocity  = -500;
    }
}
