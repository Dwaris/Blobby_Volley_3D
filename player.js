class Player{
  constructor(x, y, z, color){
    this.radius = 1;
    this.geometry = new THREE.SphereGeometry( this.radius, 0.3, 0.2 );
    this.material = new THREE.MeshToonMaterial( {color: color} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.speed = new THREE.Vector3(0, 0, 0);
  }

  getMesh() {
    return this.mesh;
  }

  getRadius() {
    return this.radius;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  reset(a) {
    if(a) {
      this.mesh.position.set(0, 0, -4.5);
    } else {
      this.mesh.position.set(0, 0, 4.5);
    }
    this.speed.set(0, 0, 0);
  }

  gravity() {
    this.speed.y = this.speed.y - 0.5;
    if(this.speed.y < -16) this.speed.y = -16;
    if(this.mesh.position.y < this.radius) {
      this.mesh.position.y = this.radius + 0.1;
      // this.speed.y = -1;
    }
  }

  border() {
    //X
    if (this.mesh.position.x<-4) this.mesh.position.x = -4;
    if (this.mesh.position.x>4) this.mesh.position.x = 4;

    //Z
    if (this.mesh.position.z<-8.5) this.mesh.position.z = -8.5;
    if (this.mesh.position.z>8.5) this.mesh.position.z = 8.5;

    //NET
    if(this.mesh.position.z < 0){ // if left
      if(this.mesh.position.z > -this.radius-0.1) {
        // this.mesh.position.z = -this.radius-0.1
        if(this.speed.z > 0){
          this.speed.z = 0;
        }
      }
    } else { // if right
      if(this.mesh.position.z < this.radius+0.1) {
        // this.mesh.position.z = this.radius+0.1
        if(this.speed.z < 0){
          this.speed.z = 0;
        }
      }
    }
  }

  jump() {
    if(this.mesh.position.y <= this.radius + 0.1) {
      this.speed.y = 17;

    }
  }



  update(keyDown, left, forward, right, backward, jump) {
    let setspeed = 15;
    this.speed = new THREE.Vector3(0, this.speed.y, 0);
    if (keyDown[left]) this.speed.z = -setspeed;
    if (keyDown[forward]) this.speed.x = setspeed;
    if (keyDown[right]) this.speed.z = setspeed;
    if (keyDown[backward]) this.speed.x = -setspeed;
    if (!(keyDown[left] || keyDown[right])) this.speed.z = 0;
    if (!(keyDown[forward] || keyDown[backward])) this.speed.x = 0;
    if(keyDown[jump]) this.jump();
    this.gravity();
    this.border();


    this.mesh.position.x +=this.speed.x * 0.01;
    this.mesh.position.z +=this.speed.z * 0.01;
    this.mesh.position.y +=this.speed.y * 0.01;

  }



}
