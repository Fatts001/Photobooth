// ===============================
// MINI BATTLE ROYALE 3D V1 FIX
// ===============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 50, 150);


// CAMERA
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

camera.position.set(0, 7, 12);


// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
);

document
  .getElementById("game")
  .appendChild(renderer.domElement);


// LIGHT
const ambient = new THREE.HemisphereLight(
  0xffffff,
  0x447744,
  2
);

scene.add(ambient);

const sun = new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(30, 50, 20);
scene.add(sun);


// ===============================
// GROUND
// ===============================

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(140, 140),
  new THREE.MeshLambertMaterial({
    color: 0x4d994d
  })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


// ROAD
const road1 = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 140),
  new THREE.MeshLambertMaterial({
    color: 0x555555
  })
);

road1.rotation.x = -Math.PI / 2;
road1.position.y = 0.01;

scene.add(road1);


const road2 = new THREE.Mesh(
  new THREE.PlaneGeometry(140, 10),
  new THREE.MeshLambertMaterial({
    color: 0x555555
  })
);

road2.rotation.x = -Math.PI / 2;
road2.position.y = 0.02;

scene.add(road2);


// ===============================
// BUILDINGS
// ===============================

function createBuilding(x, z) {

  const width = 5 + Math.random() * 5;
  const depth = 5 + Math.random() * 5;
  const height = 4 + Math.random() * 6;

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      depth
    ),
    new THREE.MeshLambertMaterial({
      color:
        Math.random() > 0.5
          ? 0xb9a38d
          : 0x89939b
    })
  );

  building.position.set(
    x,
    height / 2,
    z
  );

  scene.add(building);
}


for (let i = 0; i < 25; i++) {

  const x =
    (Math.random() - 0.5) * 110;

  const z =
    (Math.random() - 0.5) * 110;

  if (
    Math.abs(x) < 12 &&
    Math.abs(z) < 12
  ) continue;

  createBuilding(x, z);
}


// ===============================
// TREES
// ===============================

function createTree(x, z) {

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.25,
      0.35,
      2,
      7
    ),
    new THREE.MeshLambertMaterial({
      color: 0x70452b
    })
  );

  trunk.position.set(
    x,
    1,
    z
  );

  scene.add(trunk);


  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(
      2,
      8,
      8
    ),
    new THREE.MeshLambertMaterial({
      color: 0x267a38
    })
  );

  leaves.position.set(
    x,
    3,
    z
  );

  scene.add(leaves);
}


for (let i = 0; i < 40; i++) {

  createTree(
    (Math.random() - 0.5) * 120,
    (Math.random() - 0.5) * 120
  );

}


// ===============================
// PLAYER
// ===============================

const player = new THREE.Group();


// BODY
const playerBody = new THREE.Mesh(
  new THREE.BoxGeometry(
    1.2,
    1.7,
    0.8
  ),
  new THREE.MeshLambertMaterial({
    color: 0x2477e8
  })
);

playerBody.position.y = 1.5;

player.add(playerBody);


// HEAD
const playerHead = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.48,
    12,
    8
  ),
  new THREE.MeshLambertMaterial({
    color: 0xffbd91
  })
);

playerHead.position.y = 2.65;

player.add(playerHead);


// GUN
const playerGun = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.2,
    0.2,
    1.5
  ),
  new THREE.MeshLambertMaterial({
    color: 0x202020
  })
);

playerGun.position.set(
  0.65,
  1.5,
  -0.7
);

player.add(playerGun);


player.position.set(
  0,
  0,
  15
);

scene.add(player);


// ===============================
// ENEMIES
// ===============================

const enemies = [];


function createEnemy() {

  const enemy = new THREE.Group();


  const body = new THREE.Mesh(
    new THREE.BoxGeometry(
      1.2,
      1.7,
      0.8
    ),
    new THREE.MeshLambertMaterial({
      color: 0xd93636
    })
  );

  body.position.y = 1.5;

  enemy.add(body);


  const head = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.48,
      12,
      8
    ),
    new THREE.MeshLambertMaterial({
      color: 0xffb48b
    })
  );

  head.position.y = 2.65;

  enemy.add(head);


  let x;
  let z;

  do {

    x =
      (Math.random() - 0.5) * 100;

    z =
      (Math.random() - 0.5) * 100;

  } while (
    Math.sqrt(
      x * x +
      (z - 15) * (z - 15)
    ) < 20
  );


  enemy.position.set(
    x,
    0,
    z
  );


  enemy.hp = 3;
  enemy.speed =
    0.025 +
    Math.random() * 0.02;


  scene.add(enemy);

  enemies.push(enemy);
}


for (let i = 0; i < 10; i++) {
  createEnemy();
}


// ===============================
// ZONE
// ===============================

let zoneRadius = 60;

const zone = new THREE.Mesh(
  new THREE.RingGeometry(
    59.5,
    60,
    96
  ),
  new THREE.MeshBasicMaterial({
    color: 0x2299ff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })
);

zone.rotation.x = -Math.PI / 2;
zone.position.y = 0.05;

scene.add(zone);


// ===============================
// GAME VARIABLES
// ===============================

let hp = 100;
let kills = 0;
let playing = false;
let sprint = false;


// UI
const hpEl =
  document.getElementById("hp");

const killsEl =
  document.getElementById("kills");

const zoneEl =
  document.getElementById("zone");

const messageEl =
  document.getElementById("message");


// ===============================
// JOYSTICK
// ===============================

const joystick =
  document.getElementById("joystick");

const stick =
  document.getElementById("stick");

let joyX = 0;
let joyY = 0;
let joystickActive = false;


function updateJoystick(x, y) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height / 2;

  let dx = x - centerX;
  let dy = y - centerY;

  const max =
    rect.width / 2 - 25;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

  if (distance > max) {

    dx =
      dx / distance * max;

    dy =
      dy / distance * max;
  }


  stick.style.transform =
    `translate(${dx}px, ${dy}px)`;


  joyX = dx / max;
  joyY = dy / max;
}


joystick.addEventListener(
  "touchstart",
  function(e) {

    e.preventDefault();

    joystickActive = true;

    const touch =
      e.touches[0];

    updateJoystick(
      touch.clientX,
      touch.clientY
    );

  },
  { passive: false }
);


joystick.addEventListener(
  "touchmove",
  function(e) {

    e.preventDefault();

    if (!joystickActive)
      return;

    const touch =
      e.touches[0];

    updateJoystick(
      touch.clientX,
      touch.clientY
    );

  },
  { passive: false }
);


joystick.addEventListener(
  "touchend",
  function() {

    joystickActive = false;

    joyX = 0;
    joyY = 0;

    stick.style.transform =
      "translate(0,0)";
  }
);


// ===============================
// SPRINT
// ===============================

const sprintButton =
  document.getElementById("sprint");


sprintButton.addEventListener(
  "touchstart",
  function(e) {

    e.preventDefault();

    sprint = true;

  },
  { passive: false }
);


sprintButton.addEventListener(
  "touchend",
  function() {

    sprint = false;

  }
);


// ===============================
// SHOOT
// ===============================

const shootButton =
  document.getElementById("shoot");


shootButton.addEventListener(
  "touchstart",
  function(e) {

    e.preventDefault();

    shoot();

  },
  { passive: false }
);


shootButton.addEventListener(
  "click",
  function() {

    shoot();

  }
);


function shoot() {

  if (!playing)
    return;


  let target = null;
  let closest = Infinity;


  enemies.forEach(function(enemy) {

    if (!enemy.visible)
      return;


    const distance =
      enemy.position.distanceTo(
        player.position
      );


    if (
      distance < closest &&
      distance < 25
    ) {

      closest = distance;
      target = enemy;

    }

  });


  if (!target)
    return;


  target.hp--;


  target.scale.set(
    1.25,
    1.25,
    1.25
  );


  setTimeout(function() {

    if (target.visible) {

      target.scale.set(
        1,
        1,
        1
      );

    }

  }, 100);


  if (target.hp <= 0) {

    target.visible = false;

    kills++;

    killsEl.textContent =
      kills;


    messageEl.textContent =
      "💥 ELIMINATED!";


    setTimeout(function() {

      messageEl.textContent = "";

    }, 700);


    if (
      enemies.every(
        e => !e.visible
      )
    ) {

      win();

    }

  }

}


// ===============================
// PLAYER MOVEMENT
// ===============================

function updatePlayer() {

  if (!playing)
    return;


  const speed =
    sprint
      ? 0.35
      : 0.18;


  player.position.x +=
    joyX * speed;


  player.position.z +=
    joyY * speed;


  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -65,
      65
    );


  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -65,
      65
    );


  if (
    Math.abs(joyX) > 0.1 ||
    Math.abs(joyY) > 0.1
  ) {

    player.rotation.y =
      Math.atan2(
        joyX,
        joyY
      );

  }

}


// ===============================
// ENEMY AI
// ===============================

function updateEnemies() {

  if (!playing)
    return;


  enemies.forEach(function(enemy) {

    if (!enemy.visible)
      return;


    const dx =
      player.position.x -
      enemy.position.x;


    const dz =
      player.position.z -
      enemy.position.z;


    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      );


    if (distance < 35) {

      const angle =
        Math.atan2(
          dx,
          dz
        );


      enemy.rotation.y =
        angle;


      enemy.position.x +=
        Math.sin(angle) *
        enemy.speed;


      enemy.position.z +=
        Math.cos(angle) *
        enemy.speed;

    }


    if (distance < 2.5) {

      damage(0.15);

    }

  });

}


// ===============================
// DAMAGE
// ===============================

function damage(amount) {

  if (!playing)
    return;


  hp -= amount;


  if (hp < 0)
    hp = 0;


  hpEl.textContent =
    Math.ceil(hp);


  if (hp <= 0) {

    lose();

  }

}


// ===============================
// ZONE
// ===============================

function updateZone() {

  if (!playing)
    return;


  if (zoneRadius > 12) {

    zoneRadius -= 0.004;


    zone.scale.set(
      zoneRadius / 60,
      zoneRadius / 60,
      1
    );

  }


  const distance =
    Math.sqrt(
      player.position.x *
      player.position.x +

      player.position.z *
      player.position.z
    );


  const percent =
    Math.round(
      zoneRadius / 60 * 100
    );


  zoneEl.textContent =
    "ZONE " + percent + "%";


  if (
    distance >
    zoneRadius
  ) {

    damage(0.08);

    messageEl.textContent =
      "⚠️ KELUAR ZONA!";

  }

}


// ===============================
// CAMERA
// ===============================

function updateCamera() {

  const offset =
    new THREE.Vector3(
      0,
      7,
      11
    );


  offset.applyAxisAngle(
    new THREE.Vector3(
      0,
      1,
      0
    ),
    player.rotation.y
  );


  const target =
    player.position
      .clone()
      .add(offset);


  camera.position.lerp(
    target,
    0.12
  );


  camera.lookAt(
    player.position.x,
    1.4,
    player.position.z
  );

}


// ===============================
// PLAY
// ===============================

const playButton =
  document.getElementById("play");

const startScreen =
  document.getElementById("start");


function startGame(e) {

  if (e) {

    e.preventDefault();
    e.stopPropagation();

  }


  startScreen.style.display =
    "none";


  playing = true;


  messageEl.textContent =
    "SURVIVE! 🔥";


  setTimeout(function() {

    messageEl.textContent = "";

  }, 1000);

}


playButton.addEventListener(
  "click",
  startGame
);


playButton.addEventListener(
  "touchstart",
  startGame,
  {
    passive: false
  }
);


// ===============================
// GAME OVER
// ===============================

function lose() {

  playing = false;


  document
    .getElementById("finalKills")
    .textContent = kills;


  document
    .getElementById("result")
    .textContent =
      "GAME OVER 💀";


  document
    .getElementById("gameover")
    .style.display =
      "flex";

}


// ===============================
// WIN
// ===============================

function win() {

  playing = false;


  document
    .getElementById("finalKills")
    .textContent = kills;


  document
    .getElementById("result")
    .textContent =
      "BOOYAH! 🏆";


  document
    .getElementById("gameover")
    .style.display =
      "flex";

}


// ===============================
// RESIZE
// ===============================

window.addEventListener(
  "resize",
  function() {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


// ===============================
// GAME LOOP
// ===============================

function animate() {

  requestAnimationFrame(
    animate
  );


  updatePlayer();

  updateEnemies();

  updateZone();

  updateCamera();


  renderer.render(
    scene,
    camera
  );

}


animate();
