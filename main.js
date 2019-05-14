var renderer = null,
  scene = null,
  camera = null;

var geometry, material, mesh, pointLight, playerA, playerB, keyDown, fieldA, fieldB, ball, net, counter, fontMesh;

var scoreA = scoreB = 0;

function init() {

  var container = document.getElementById("container");

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.BasicShadowMap;
  container.appendChild( renderer.domElement );

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x7ec0ee );
  // Light
  light = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(light);

  // Camera
  camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 1000);
  camera.position.y = 12;
  // camera.position.z = 10;
  camera.position.x = -20;
  // camera.position.z = -12.5;
  camera.lookAt(new THREE.Vector3(0, 5, 0));

  scene.add(camera);

  // Spielfeld Hälften
  fieldA = new Field(0, -4.5);
  scene.add(fieldA.getMesh());

  fieldB = new Field(0, 4.5);
  scene.add(fieldB.getMesh());

  ball = new Ball(0, 4, -3.5);
  scene.add(ball.getMesh());

  playerA = new Player(0, 0, -4.5, 0xff0000);
  scene.add(playerA.getMesh());

  playerB = new Player(0, 0, 4.5, 0x00ff00);
  scene.add(playerB.getMesh());

  net = new Net(0, 2.25/2, 0);
  scene.add(net.getMesh());


  generateScore(scoreA, scoreB, scene);

  pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(0, 30, 0);
  pointLight.castShadow = true;

  pointLight.shadow.mapSize.width = 4096;
  pointLight.shadow.mapSize.height = 4096;
  pointLight.shadow.camera.near = 1;
  pointLight.shadow.camera.far = 100;
  scene.add(pointLight);

  // // //Create a helper for the shadow camera (optional)
  // var helper = new THREE.CameraHelper( pointLight.shadow.camera );
  // scene.add( helper );
  keyDown = new Array();
  for (i = 0; i < 300; i++) {
    keyDown[i] = false;
  }

  document.onkeydown = function(event) {
    keyDown[event.keyCode] = true;
  }

  document.onkeyup = function(event) {
    keyDown[event.keyCode] = false;
  }

  // Run loop
  loop();
}

function loop() {
  requestAnimationFrame(loop);

  if(scoreA > 9 || scoreB > 9) {
    scoreA = 0;
    scoreB = 0;
    playerA.reset(true);
    playerB.reset(false);
    ball.reset(true);
    scene.remove(fontMesh);
    generateScore(scoreA, scoreB, scene);
  }


  let collionValue = ball.update([playerA, playerB]);
  playerA.update(keyDown, 65, 87, 68, 83, 32);
  playerB.update(keyDown, 37, 38, 39, 40, 13);

  switch (collionValue) {
    case 0: //Feld A
      scoreB++;
      playerA.reset(true);
      playerB.reset(false);
      ball.reset(false);
      scene.remove(fontMesh);
      generateScore(scoreA, scoreB, scene);

    //RESET
    break;
    case 1: //Feld B
      scoreA++;
      playerA.reset(true);
      playerB.reset(false);
      ball.reset(true);
      scene.remove(fontMesh);
      generateScore(scoreA, scoreB, scene);
    break;
    default:
  }

  renderer.render(scene, camera);
}

function generateScore(a, b, scene) {
  //Counter
  var fontLoader = new THREE.FontLoader();
  var text = "" + a + "   " + b;
  fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function (font) {

    var fontGeometry = new THREE.TextGeometry( text, {
      font: font,
      size: 6,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0.1,
      bevelSegments: 0.1
    } );

    let fontMaterial = new THREE.MeshToonMaterial( {color: 0x110000} );
    fontMesh = new THREE.Mesh( fontGeometry, fontMaterial );

    fontMesh.rotation.y = -0.5*Math.PI;
    fontMesh.position.x = 6;
    fontMesh.position.y = 5;
    fontMesh.position.z = -8;
    fontMesh.castShadow = false;
    fontMesh.reflective = 0;

    scene.add(fontMesh);
  } );

}
