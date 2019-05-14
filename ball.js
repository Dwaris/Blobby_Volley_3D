class Ball{
  constructor(x, y, z){
    this.radius = 0.66;
    this.geometry = new THREE.SphereGeometry( this.radius, 0.32, 0.32 );
    this.material = new THREE.MeshToonMaterial( {color: 0xff007f} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;


    this.speed = new THREE.Vector3(0, 0, 0);

    // this.speed.x = 1;
    // this.speed.z = 5;
    this.hasCollided = false;
  }


  getMesh() {
    return this.mesh;
  }

  border() {
    //X
    if (this.mesh.position.x<-4) {
      this.mesh.position.x = -4;
      let x = this.speed.x *(-1);
      let z = this.speed.z;
      this.speed.x = x;
      this.speed.z = z;

    }
    if (this.mesh.position.x>4) {
      this.mesh.position.x = 4;
      let z = this.speed.z;
      let x = this.speed.x*(-1);
      this.speed.x = x;
      this.speed.z = z;

    }
    //Z
    if (this.mesh.position.z<-8.5) {
      this.mesh.position.z = -8.5;
      let z = this.speed.z *(-1);
      let x = this.speed.x;
      this.speed.x = x;
      this.speed.z = z;

    }
    if (this.mesh.position.z>8.5) {
      this.mesh.position.z = 8.5;
      let z = this.speed.z *(-1);
      let x = this.speed.x;
      this.speed.x = x;
      this.speed.z = z;

    }


    //NET
    if(this.mesh.position.y-this.radius<2.2) {
      if(this.mesh.position.z < 0){ // if left
        if(this.mesh.position.z > -this.radius-0.1) {
          this.mesh.position.z = -this.radius-0.1;
          let z = this.speed.z *(-1);
          let x = this.speed.x;
          this.speed.x = x;
          // this.speed.y = y;
          this.speed.z = z;
        }
      } else { // if right
        if(this.mesh.position.z < this.radius+0.1) {
          this.mesh.position.z = this.radius+0.1
          let z = this.speed.z *(-1);
          let x = this.speed.x;
          this.speed.x = x;
          // this.speed.y = y;
          this.speed.z = z;
        }
      }
    } else {
      if(this.mesh.position.z>=-0.2 && this.mesh.position.z<=0.2 && this.mesh.position.y-this.radius<2.3) {
        console.log("Test");
        this.speed.y *= (-1);
      }
    }
  }
  // return: -1= No Collision, 0=FieldA, 1=FieldB
  collideField() {
    if(this.mesh.position.y <= this.radius) {
      if(this.mesh.position.z < 0) return 0;
      else return 1;
    } else return -1
  }


  gravity() {
    this.speed.y = this.speed.y - 0.5;
    if(this.speed.y < -20) this.speed.y = -20;
    if(this.mesh.position.y < this.radius) {
      this.mesh.position.y = this.radius + 0.1;
      this.speed.y = 0;
    }
  }

  reset(a) {
    this.hasCollided = false;
    if(a) {
      this.mesh.position.set(0, 4, -3.5);
    } else {
      this.mesh.position.set(0, 4, 3.5);
    }
    this.speed.set(0, 0, 0);
  }

  update(players) {
    // console.log(this.collideField());
    if(this.hasCollided) {
      this.gravity();
    }
    this.border();
    for (let i = 0; i<2; i++) {
      let player = players[i]
      let line = new THREE.Line3(this.mesh.position, player.getMesh().position);
      if (line.distance() <= this.radius+player.getRadius()) {
        this.hasCollided = true;
        player.collisions++;
        players[i==0?1:0].collisions = 0;
         // VECTOR Ball->Spieler
        let tmp = new THREE.Vector3(this.mesh.position.x - player.getMesh().position.x,
                                    this.mesh.position.y - player.getMesh().position.y,
                                    this.mesh.position.z - player.getMesh().position.z);
        // this.mesh.position.add(tmp);

        if(this.speed.length > 20) tmp.setLength(20);
        else tmp.setLength(this.speed.length());
        if(player.getSpeed().y < 0) {
          tmp.add(new THREE.Vector3(player.getSpeed().x*0.5, 0, player.getSpeed().z*0.5));
        } else {
          tmp.add(player.getSpeed());
        }
        this.speed = tmp;

      }
    }
    this.mesh.position.x +=this.speed.x * 0.005;
    this.mesh.position.z +=this.speed.z * 0.005;
    this.mesh.position.y +=this.speed.y * 0.01;
    return this.collideField();
  }

}
