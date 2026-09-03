const camera = document.getElementById("camera");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");

const photoResult = document.getElementById("photoResult");
const photo1 = document.getElementById("photo1");
const photo2 = document.getElementById("photo2");
const photoEmpty = document.querySelectorAll(".photo-empty");

const canvas = document.getElementById("canvas");

const cameraBtn = document.getElementById("cameraBtn");
const galleryInput = document.getElementById("galleryInput");

const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");

const cameraControls = document.getElementById("cameraControls");
const resultControls = document.getElementById("resultControls");

const downloadBtn = document.getElementById("downloadBtn");
const againBtn = document.getElementById("againBtn");

const counter = document.getElementById("counter");
const countdown = document.getElementById("countdown");
const status = document.getElementById("status");

let stream = null;
let photos = [];
let photoNumber = 0;


// =====================================
// KAMERA
// =====================================

cameraBtn.addEventListener("click", async () => {

  try {

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      },
      audio: false
    });

    camera.srcObject = stream;

    await camera.play();

    camera.style.display = "block";
    cameraPlaceholder.style.display = "none";

    photoResult.style.display = "none";

    cameraControls.classList.remove("hidden");
    resultControls.classList.add("hidden");

    status.textContent = "Kamera siap 📸";

  } catch (error) {

    console.error(error);

    camera.style.display = "none";
    cameraPlaceholder.style.display = "flex";

    status.textContent =
      "Kamera tidak bisa dibuka. Izinkan akses kamera.";

  }

});


// =====================================
// AMBIL FOTO
// =====================================

captureBtn.addEventListener("click", async () => {

  if (!stream) return;

  if (photoNumber >= 2) return;

  await countdownAnimation();

  if (
    camera.videoWidth === 0 ||
    camera.videoHeight === 0
  ) {

    status.textContent = "Kamera belum siap.";
    return;

  }

  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.save();

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    camera,
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.restore();

  const image =
    canvas.toDataURL("image/jpeg", 0.92);

  photos[photoNumber] = image;

  showPhoto(photoNumber, image);

  photoNumber++;

  if (photoNumber === 1) {

    counter.textContent = "Foto 2 dari 2";

    status.textContent =
      "Foto pertama berhasil! Ambil foto kedua 📸";

  } else {

    counter.textContent =
      "2 foto selesai ✨";

    status.textContent =
      "Selesai! Dua foto berhasil dibuat 🎉";

    stopCamera();

    cameraControls.classList.add("hidden");

    resultControls.classList.remove("hidden");

  }

});


// =====================================
// TAMPILKAN FOTO
// =====================================

function showPhoto(index, image) {

  photoResult.style.display = "grid";

  if (index === 0) {

    photo1.src = image;
    photo1.style.display = "block";
    photoEmpty[0].style.display = "none";

  }

  if (index === 1) {

    photo2.src = image;
    photo2.style.display = "block";
    photoEmpty[1].style.display = "none";

  }

}


// =====================================
// COUNTDOWN
// =====================================

function countdownAnimation() {

  return new Promise(resolve => {

    let number = 3;

    countdown.textContent = number;

    const timer = setInterval(() => {

      number--;

      if (number > 0) {

        countdown.textContent = number;

      } else {

        countdown.textContent = "📸";

        clearInterval(timer);

        setTimeout(() => {

          countdown.textContent = "";

          resolve();

        }, 350);

      }

    }, 700);

  });

}


// =====================================
// GALERI
// =====================================

galleryInput.addEventListener("change", event => {

  const files =
    Array.from(event.target.files)
      .filter(file =>
        file.type.startsWith("image/")
      )
      .slice(0, 2);

  if (files.length === 0) {

    status.textContent =
      "Pilih gambar terlebih dahulu.";

    return;

  }

  stopCamera();

  photos = [];
  photoNumber = files.length;

  files.forEach((file, index) => {

    const reader = new FileReader();

    reader.onload = e => {

      const image = e.target.result;

      photos[index] = image;

      showPhoto(index, image);

      if (
        photos.filter(Boolean).length === files.length
      ) {

        cameraPlaceholder.style.display = "none";
        camera.style.display = "none";

        cameraControls.classList.add("hidden");
        resultControls.classList.remove("hidden");

        counter.textContent =
          files.length === 2
            ? "2 foto dipilih ✨"
            : "1 foto dipilih";

        status.textContent =
          "Foto dari galeri berhasil dipilih 🖼️";

      }

    };

    reader.readAsDataURL(file);

  });

});


// =====================================
// TUTUP KAMERA
// =====================================

stopBtn.addEventListener("click", () => {

  stopCamera();

  cameraControls.classList.add("hidden");

  camera.style.display = "none";

  if (photos.length === 0) {
    cameraPlaceholder.style.display = "flex";
  }

});


function stopCamera() {

  if (stream) {

    stream.getTracks().forEach(track => {
      track.stop();
    });

    stream = null;

  }

  camera.srcObject = null;

}


// =====================================
// ULANGI
// =====================================

againBtn.addEventListener("click", () => {

  stopCamera();

  photos = [];
  photoNumber = 0;

  photo1.src = "";
  photo2.src = "";

  photo1.style.display = "none";
  photo2.style.display = "none";

  photoEmpty[0].style.display = "flex";
  photoEmpty[1].style.display = "flex";

  photoResult.style.display = "none";

  camera.style.display = "none";

  cameraPlaceholder.style.display = "flex";

  cameraControls.classList.add("hidden");
  resultControls.classList.add("hidden");

  galleryInput.value = "";

  counter.textContent = "Foto 1 dari 2";

  status.textContent = "";

});


// =====================================
// SIMPAN HASIL DENGAN BANYAK DEKORASI
// =====================================

downloadBtn.addEventListener("click", async () => {

  const validPhotos = photos.filter(Boolean);

  if (validPhotos.length === 0) return;

  const output = document.createElement("canvas");

  const ctx = output.getContext("2d");

  const width = 1200;
  const height = 950;

  output.width = width;
  output.height = height;


  // =================================
  // BACKGROUND GRADIENT
  // =================================

  const gradient = ctx.createLinearGradient(
    0,
    0,
    width,
    height
  );

  gradient.addColorStop(0, "#ffd9ec");
  gradient.addColorStop(0.35, "#e6ddff");
  gradient.addColorStop(0.7, "#d9f4ff");
  gradient.addColorStop(1, "#d8ffe9");

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  // =================================
  // BUBBLE BACKGROUND
  // =================================

  drawBubble(ctx, 80, 170, 75);
  drawBubble(ctx, 1120, 190, 90);
  drawBubble(ctx, 100, 680, 95);
  drawBubble(ctx, 1100, 700, 80);

  drawBubble(ctx, 250, 90, 35);
  drawBubble(ctx, 950, 80, 45);
  drawBubble(ctx, 40, 470, 40);
  drawBubble(ctx, 1160, 470, 45);


  // =================================
  // SPARKLES
  // =================================

  drawSparkle(ctx, 70, 90, 30);
  drawSparkle(ctx, 1130, 100, 35);

  drawSparkle(ctx, 70, 850, 35);
  drawSparkle(ctx, 1130, 850, 30);

  drawSparkle(ctx, 270, 160, 18);
  drawSparkle(ctx, 930, 160, 18);

  drawSparkle(ctx, 300, 820, 20);
  drawSparkle(ctx, 900, 820, 20);


  // =================================
  // BINTANG KECIL
  // =================================

  const stars = [
    [140, 130],
    [210, 220],
    [1020, 240],
    [1070, 330],
    [130, 400],
    [1080, 510],
    [170, 760],
    [1030, 780],
    [330, 100],
    [870, 105]
  ];

  ctx.fillStyle = "#ffffffaa";

  ctx.font = "25px Arial";

  stars.forEach(([x, y]) => {
    ctx.fillText("✦", x, y);
  });


  // =================================
  // HATI
  // =================================

  ctx.font = "32px Arial";

  ctx.fillStyle = "#ff6fae";

  ctx.fillText("♡", 120, 260);
  ctx.fillText("♡", 1060, 290);
  ctx.fillText("♡", 115, 600);
  ctx.fillText("♡", 1060, 620);


  // =================================
  // BUNGA
  // =================================

  ctx.font = "35px Arial";

  ctx.fillStyle = "#ffffff";

  ctx.fillText("✿", 175, 340);
  ctx.fillText("✿", 1020, 370);
  ctx.fillText("❀", 160, 710);
  ctx.fillText("❀", 1040, 750);


  // =================================
  // JUDUL
  // =================================

  ctx.textAlign = "center";

  ctx.fillStyle = "#4d3b68";

  ctx.font = "bold 44px Arial";

  ctx.fillText(
    "PHOTOBOOTH",
    width / 2,
    65
  );

  ctx.font = "20px Arial";

  ctx.fillStyle = "#735f87";

  ctx.fillText(
    "✦ little moments, big memories ✦",
    width / 2,
    95
  );


  // =================================
  // LOAD FOTO
  // =================================

  const images =
    await Promise.all(
      validPhotos.map(src => loadImage(src))
    );


  // =================================
  // UKURAN FOTO
  // =================================

  const photoWidth =
    images.length === 2
      ? 500
      : 1000;

  const photoHeight =
    680;

  const gap = 35;

  const totalWidth =
    images.length === 2
      ? photoWidth * 2 + gap
      : photoWidth;

  const startX =
    (width - totalWidth) / 2;


  // =================================
  // FOTO
  // =================================

  images.forEach((img, index) => {

    const x =
      startX +
      index *
      (photoWidth + gap);

    const y = 125;


    // SHADOW

    ctx.save();

    ctx.shadowColor =
      "rgba(80,50,100,.3)";

    ctx.shadowBlur = 25;

    ctx.shadowOffsetY = 10;

    ctx.fillStyle = "white";

    ctx.fillRect(
      x - 12,
      y - 12,
      photoWidth + 24,
      photoHeight + 24
    );

    ctx.restore();


    // FRAME

    ctx.fillStyle = "white";

    ctx.fillRect(
      x - 8,
      y - 8,
      photoWidth + 16,
      photoHeight + 16
    );


    // FOTO

    ctx.save();

    ctx.beginPath();

    ctx.rect(
      x,
      y,
      photoWidth,
      photoHeight
    );

    ctx.clip();

    const scale =
      Math.max(
        photoWidth / img.width,
        photoHeight / img.height
      );

    const w =
      img.width * scale;

    const h =
      img.height * scale;

    ctx.drawImage(
      img,

      x +
      (photoWidth - w) / 2,

      y +
      (photoHeight - h) / 2,

      w,
      h
    );

    ctx.restore();


    // NOMOR

    ctx.fillStyle =
      "rgba(255,255,255,.9)";

    ctx.font =
      "bold 18px Arial";

    ctx.textAlign =
      "center";

    ctx.fillText(
      index === 0 ? "01" : "02",
      x + photoWidth / 2,
      y + photoHeight + 42
    );

  });


  // =================================
  // FOOTER
  // =================================

  ctx.textAlign = "center";

  ctx.fillStyle = "#665274";

  ctx.font =
    "bold 22px Arial";

  ctx.fillText(
    "♡ memories to keep forever ♡",
    width / 2,
    height - 28
  );


  // =================================
  // DOWNLOAD
  // =================================

  const link =
    document.createElement("a");

  link.download =
    "photobooth-" +
    Date.now() +
    ".png";

  link.href =
    output.toDataURL("image/png");

  link.click();

  status.textContent =
    "Hasil photobooth berhasil disimpan 💾✨";

});


// =====================================
// BUBBLE
// =====================================

function drawBubble(ctx, x, y, radius) {

  ctx.save();

  ctx.fillStyle =
    "rgba(255,255,255,.28)";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();

}


// =====================================
// SPARKLE
// =====================================

function drawSparkle(ctx, x, y, size) {

  ctx.save();

  ctx.translate(x, y);

  ctx.fillStyle =
    "rgba(255,255,255,.8)";

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size
  );

  ctx.lineTo(
    size * .25,
    -size * .25
  );

  ctx.lineTo(
    size,
    0
  );

  ctx.lineTo(
    size * .25,
    size * .25
  );

  ctx.lineTo(
    0,
    size
  );

  ctx.lineTo(
    -size * .25,
    size * .25
  );

  ctx.lineTo(
    -size,
    0
  );

  ctx.lineTo(
    -size * .25,
    -size * .25
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();

}


// =====================================
// LOAD IMAGE
// =====================================

function loadImage(src) {

  return new Promise(resolve => {

    const img = new Image();

    img.onload = () => resolve(img);

    img.src = src;

  });

}


// =====================================
// CLEANUP
// =====================================

window.addEventListener(
  "beforeunload",
  stopCamera
);
