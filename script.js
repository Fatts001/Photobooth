const scene = new THREE.Scene();

scene.background = new THREE.Color(0x82c9e8);
scene.fog = new THREE.Fog(0x82c9e8, 40, 130);

const camera = new THREE.PerspectiveCamera(
  65,
  innerWidth / innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({
  antialias: false
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(
  Math.min(devicePixelRatio, 1.5)
);

document
  .getElementById("game")
  .appendChild(renderer.domElement);


// LIGHT

scene.add(
  new THREE.HemisphereLight(
    0xffffff,
    0x456040,
    2
  )
);

const sun = new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(30,50,20);

scene.add(sun);


// GROUND

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(120,120),
  new THREE.MeshLambertMaterial({
    color: 0x4d984d
  })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ROAD

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(12,120),
  new THREE.MeshLambertMaterial({
    color: 0x555555
  })
);

road.rotation.x = -Math.PI / 2;
road.position.y = .01;

scene.add(road);

const road2 = new THREE.Mesh(
  new THREE.PlaneGeometry(120,10),
  new THREE.MeshLambertMaterial({
    color: 0x555555
  })
);

road2.rotation.x = -Math.PI / 2;
road2.position.y = .02;

scene.add(road2);


// BUILDINGS

function building(x,z) {

  const w = 5 + Math.random()*5;
  const d = 5 + Math.random()*5;
  const h = 4 + Math.random()*6;

  const b = new THREE.Mesh(
    new THREE.BoxGeometry(w,h,d),
    new THREE.MeshLambertMaterial({
      color:
        Math.random() > .5
        ? 0xb9a38d
        : 0x8b969f
    })
  );

  b.position.set(x,h/2,z);

  scene.add(b);
}

for(let i=0;i<20;i++){

  const x =
    (Math.random()-.5)*95;

  const z =
    (Math.random()-.5)*95;

  if(Math.abs(x)<10 || Math.abs(z)<8)
    continue;

  building(x,z);
}


// TREES

function tree(x,z){

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      .25,.35,2,7
    ),
    new THREE.MeshLambertMaterial({
      color:0x70452b
    })
  );

  trunk.position.set(x,1,z);

  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2,7,7),
    new THREE.MeshLambertMaterial({
      color:0x247a38
    })
  );

  leaves.position.set(x,3,z);

  scene.add(leaves);
}

for(let i=0;i<35;i++){

  tree(
    (Math.random()-.5)*105,
    (Math.random()-.5)*105
  );
}


// PLAYER

const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(1.2,1.7,.8),
  new THREE.MeshLambertMaterial({
    color:0x2477e8
  })
);

body.position.y=1.5;

player.add(body);


const head = new THREE.Mesh(
  new THREE.SphereGeometry(.48,10,8),
  new THREE.MeshLambertMaterial({
    color:0xffbd91
  })
);

head.position.y=2.65;

player.add(head);


const gun = new THREE.Mesh(
  new THREE.BoxGeometry(.2,.2,1.5),
  new THREE.MeshLambertMaterial({
    color:0x202020
  })
);

gun.position.set(.65,1.5,-.7);

player.add(gun);

player.position.set(0,0,15);

scene.add(player);


// ENEMIES

const enemies=[];

function enemy(){

  const e = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2,1.7,.8),
    new THREE.MeshLambertMaterial({
      color:0xd93636
    })
  );

  body.position.y=1.5;

  e.add(body);


  const head = new THREE.Mesh(
    new THREE.SphereGeometry(.48,10,8),
    new THREE.MeshLambertMaterial({
      color:0xffb48b
    })
  );

  head.position.y=2.65;

  e.add(head);


  do {

    e.position.set(
      (Math.random()-.5)*85,
      0,
      (Math.random()-.5)*85
    );

  } while(
    e.position.distanceTo(player.position)<18
  );


  e.hp=3;

  e.speed=.012+
    Math.random()*.012;

  scene.add(e);

  enemies.push(e);
}

for(let i=0;i<10;i++)
  enemy();


// ZONE

let zoneRadius=55;

const zone = new THREE.Mesh(
  new THREE.RingGeometry(
    54.5,
    55,
    80
  ),
  new THREE.MeshBasicMaterial({
    color:0x26a9ff,
    transparent:true,
    opacity:.8,
    side:THREE.DoubleSide
  })
);

zone.rotation.x=-Math.PI/2;
zone.position.y=.05;

scene.add(zone);


// GAME

let hp=100;
let kills=0;
let playing=false;
let sprint=false;

const hpEl =
  document.getElementById("hp");

const killEl =
  document.getElementById("kills");

const zoneEl =
  document.getElementById("zone");

const message =
  document.getElementById("message");


// JOYSTICK

const joystick =
  document.getElementById("joystick");

const stick =
  document.getElementById("stick");

let joyX=0;
let joyY=0;
let active=false;

function moveStick(x,y){

  const r =
    joystick.getBoundingClientRect();

  const cx =
    r.left+r.width/2;

  const cy =
    r.top+r.height/2;

  let dx=x-cx;
  let dy=y-cy;

  const max=r.width/2-25;

  const dist=
    Math.sqrt(dx*dx+dy*dy);

  if(dist>max){

    dx=dx/dist*max;
    dy=dy/dist*max;

  }

  stick.style.transform =
    `translate(${dx}px,${dy}px)`;

  joyX=dx/max;
  joyY=dy/max;
}

joystick.addEventListener(
  "touchstart",
  e=>{
    active=true;

    const t=e.touches[0];

    moveStick(
      t.clientX,
      t.clientY
    );
  },
  {passive:false}
);

joystick.addEventListener(
  "touchmove",
  e=>{
    if(!active)return;

    const t=e.touches[0];

    moveStick(
      t.clientX,
      t.clientY
    );
  },
  {passive:false}
);

joystick.addEventListener(
  "touchend",
  ()=>{
    active=false;

    joyX=0;
    joyY=0;

    stick.style.transform=
      "translate(0,0)";
  }
);


// SPRINT

const sprintBtn =
  document.getElementById("sprint");

sprintBtn.addEventListener(
  "touchstart",
  e=>{
    e.preventDefault();
    sprint=true;
  }
);

sprintBtn.addEventListener(
  "touchend",
  ()=>{
    sprint=false;
  }
);


// SHOOT

const shootBtn =
  document.getElementById("shoot");

shootBtn.addEventListener(
  "touchstart",
  e=>{
    e.preventDefault();
    shoot();
  }
);

shootBtn.addEventListener(
  "click",
  shoot
);

function shoot(){

  if(!playing)return;

  let target=null;
  let distance=Infinity;

  enemies.forEach(e=>{

    if(!e.visible)return;

    const d =
      e.position.distanceTo(
        player.position
      );

    if(d<distance){

      distance=d;
      target=e;

    }

  });

  if(
    target &&
    distance<22
  ){

    target.hp--;

    target.scale.set(
      1.2,1.2,1.2
    );

    setTimeout(()=>{
      if(target.visible)
        target.scale.set(1,1,1);
    },100);

    if(target.hp<=0){

      target.visible=false;

      kills++;

      killEl.textContent=kills;

      message.textContent=
        "💥 ELIMINATED!";

      setTimeout(()=>{
        message.textContent="";
      },700);

      if(
        enemies.every(
          e=>!e.visible
        )
      ){

        win();

      }

    }

  }
}


// PLAYER MOVEMENT

function updatePlayer(){

  if(!playing)return;

  const speed =
    sprint ? .32 : .18;

  player.position.x +=
    joyX*speed;

  player.position.z +=
    joyY*speed;

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -57,57
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -57,57
    );

  if(
    Math.abs(joyX)>.1 ||
    Math.abs(joyY)>.1
  ){

    player.rotation.y =
      Math.atan2(
        joyX,
        joyY
      );

  }
}


// ENEMY AI

function updateEnemies(){

  if(!playing)return;

  enemies.forEach(e=>{

    if(!e.visible)return;

    const dx =
      player.position.x-
      e.position.x;

    const dz =
      player.position.z-
      e.position.z;

    const dist =
      Math.sqrt(dx*dx+dz*dz);

    if(dist<32){

      const angle =
        Math.atan2(dx,dz);

      e.rotation.y=angle;

      e.position.x +=
        Math.sin(angle)*
        e.speed;

      e.position.z +=
        Math.cos(angle)*
        e.speed;

    }

    if(dist<2.2){

      damage(.15);

    }

  });
}


// DAMAGE

function damage(amount){

  hp-=amount;

  hp=Math.max(0,hp);

  hpEl.textContent=
    Math.ceil(hp);

  if(hp<=0)
    lose();
}


// ZONE

function updateZone(){

  if(!playing)return;

  if(zoneRadius>12){

    zoneRadius-=.004;

    zone.scale.set(
      zoneRadius/55,
      zoneRadius/55,
      1
    );

  }

  const dist =
    Math.sqrt(
      player.position.x**2+
      player.position.z**2
    );

  const percent =
    Math.round(
      zoneRadius/55*100
    );

  zoneEl.textContent=
    "ZONE "+percent+"%";

  if(dist>zoneRadius){

    damage(.08);

    message.textContent=
      "⚠️ KELUAR ZONA!";

  }
}


// CAMERA

function updateCamera(){

  const offset =
    new THREE.Vector3(
      0,8,11
    );

  offset.applyAxisAngle(
    new THREE.Vector3(0,1,0),
    player.rotation.y
  );

  const target =
    player.position.clone()
      .add(offset);

  camera.position.lerp(
    target,
    .12
  );

  camera.lookAt(
    player.position.x,
    1.3,
    player.position.z
  );
}


// START

document
  .getElementById("play")
  .onclick=()=>{

    document
      .getElementById("start")
      .style.display="none";

    playing=true;

    message.textContent=
      "SURVIVE! 🔥";

    setTimeout(()=>{
      message.textContent="";
    },1000);

  };


// LOSE

function lose(){

  playing=false;

  document
    .getElementById("finalKills")
    .textContent=kills;

  document
    .getElementById("result")
    .textContent=
      "GAME OVER 💀";

  document
    .getElementById("gameover")
    .style.display="flex";
}


// WIN

function win(){

  playing=false;

  document
    .getElementById("finalKills")
    .textContent=kills;

  document
    .getElementById("result")
    .textContent=
      "BOOYAH! 🏆";

  document
    .getElementById("gameover")
    .style.display="flex";
}


// RESIZE

window.addEventListener(
  "resize",
  ()=>{

    camera.aspect=
      innerWidth/innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );

  }
);


// LOOP

function animate(){

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
