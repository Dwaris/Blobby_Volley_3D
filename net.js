class Net {
  constructor(x, y, z) {
    this.geometry = new THREE.CubeGeometry(9, 2.32, 0.2);
    //this.material = new THREE.MeshStandardMaterial({color: 0x0646FF, side: THREE.DoubleSide});
    this.material = new THREE.MeshToonMaterial( {color: 0xffffff} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.mesh.receiveShadow = true;
    // this.mesh.castShadow = true;
    this.mesh.reflective = 0;

  }

  getMesh() {
    return this.mesh;
  }



}
