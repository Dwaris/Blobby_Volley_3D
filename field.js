class Field {
  constructor(x, z) {
    this.geometry = new THREE.PlaneGeometry(9, 9, 100, 100);
    //this.material = new THREE.MeshStandardMaterial({color: 0x0646FF, side: THREE.DoubleSide});
    this.mapUrl = "Sand.jpg";
    this.map = THREE.ImageUtils.loadTexture(this.mapUrl);
    this.material = new THREE.MeshPhongMaterial({ map: this.map });



    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.x = x;
    this.mesh.position.z = z;
    this.mesh.receiveShadow = true;
    this.mesh.reflective = 0;

  }

  getMesh() {
    return this.mesh;
  }

}
