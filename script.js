const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const photo1 = document.getElementById("photo1");
const photo2 = document.getElementById("photo2");

const emptyPhotos = document.querySelectorAll(".empty-photo");

const cameraBtn = document.getElementById("cameraBtn");
const galleryInput = document.getElementById("galleryInput");

const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");

const cameraControls = document.getElementById("cameraControls");
const resultControls = document.getElementById("resultControls");

const downloadBtn = document.getElementById("downloadBtn");
const againBtn = document.getElementById("againBtn");

const cameraPlaceholder =
  document.getElementById("cameraPlaceholder");

const counter =
  document.getElementById("counter");

const countdown =
  document.getElementById("countdown");

const statusText =
  document.getElementById("status");

let stream = null;

let photos = [];

let photoNumber = 0;


// ============================
// BUKA KAMERA
// ============================

cameraBtn.addEventListener("click", async () => {

  try {

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      },
      audio: false
    });

    camera.srcObject = stream;

    camera.style.display = "block";

    cameraPlaceholder.style.display = "none";

    cameraControls.classList.remove("hidden");

    resultControls.classList.add("hidden");

    statusText.textContent =
      "Kamera siap 📸 Ambil 2 foto!";

  } catch (error) {

    statusText.textContent =
      "Kamera tidak bisa dibuka. Izinkan akses kamera.";

  }

});


// ============================
// AMBIL FOTO
// ============================

captureBtn.addEventListener("click", async () => {

  if (!stream) return;

  if (photoNumber >= 2) return;

  await countdownAnimation();

  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    camera,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL("image/png");

  photos.push(image);

  if (photoNumber === 0) {

    photo1.src = image;

    photo1.style.display = "block";

    emptyPhotos[0].style.display = "none";

  } else {

    photo2.src = image;

    photo2.style.display = "block";

    emptyPhotos[1].style.display = "none";

  }

  photoNumber++;

  if (photoNumber < 2) {

    counter.textContent =
      "Foto 2 dari 2";

    statusText.textContent =
      "Foto pertama berhasil! Sekarang foto kedua 📸";

  } else {

    counter.textContent =
      "2 foto selesai ✨";

    statusText.textContent =
      "Mantap! 2 foto berhasil dibuat 🎉";

    stopCamera();

    cameraControls.classList.add("hidden");

    resultControls.classList.remove("hidden");

  }

});


// ============================
// COUNTDOWN
// ============================

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

        }, 400);

      }

    }, 700);

  });

}


// ============================
// GALERI
// ============================

galleryInput.addEventListener("change", event => {

  const files =
    Array.from(event.target.files);

  const images =
    files.filter(file =>
      file.type.startsWith("image/")
    ).slice(0, 2);

  if (images.length === 0) {

    statusText.textContent =
      "Pilih file gambar.";

    return;

  }

  photos = [];

  photoNumber = 0;

  images.forEach((file, index) => {

    const reader = new FileReader();

    reader.onload = e => {

      const image =
        e.target.result;

      photos.push(image);

      if (index === 0) {

        photo1.src = image;

        photo1.style.display = "block";

        emptyPhotos[0].style.display =
          "none";

      }

      if (index === 1) {

        photo2.src = image;

        photo2.style.display = "block";

        emptyPhotos[1].style.display =
          "none";

      }

      if (index === images.length - 1) {

        resultControls.classList.remove(
          "hidden"
        );

        statusText.textContent =
          images.length === 2
            ? "2 foto berhasil dipilih 🖼️"
            : "1 foto dipilih. Pilih foto kedua jika diperlukan.";

      }

    };

    reader.readAsDataURL(file);

  });

});


// ============================
// TUTUP KAMERA
// ============================

stopBtn.addEventListener("click", () => {

  stopCamera();

  cameraControls.classList.add("hidden");

  cameraPlaceholder.style.display =
    "block";

});

function stopCamera() {

  if (stream) {

    stream.getTracks().forEach(track => {
      track.stop();
    });

    stream = null;

    camera.srcObject = null;

  }

}


// ============================
// ULANGI
// ============================

againBtn.addEventListener("click", () => {

  stopCamera();

  photos = [];

  photoNumber = 0;

  photo1.src = "";
  photo2.src = "";

  photo1.style.display = "none";
  photo2.style.display = "none";

  emptyPhotos[0].style.display = "flex";
  emptyPhotos[1].style.display = "flex";

  camera.style.display = "none";

  cameraPlaceholder.style.display =
    "block";

  cameraControls.classList.add("hidden");

  resultControls.classList.add("hidden");

  galleryInput.value = "";

  counter.textContent =
    "Foto 1 dari 2";

  statusText.textContent =
    "";

});


// ============================
// SIMPAN HASIL
// ============================

downloadBtn.addEventListener("click", () => {

  if (photos.length === 0) return;

  const output =
    document.createElement("canvas");

  const ctx =
    output.getContext("2d");

  const width = 1200;
  const height = 850;

  output.width = width;
  output.height = height;

  // background
  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  gradient.addColorStop(0, "#38245c");
  gradient.addColorStop(1, "#172f48");

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  // dekorasi
  ctx.fillStyle =
    "rgba(255,255,255,.35)";

  ctx.font = "55px Arial";

  ctx.fillText("✦", 70, 90);
  ctx.fillText("♡", 1080, 120);
  ctx.fillText("✿", 70, 770);
  ctx.fillText("✦", 1090, 750);

  // title
  ctx.fillStyle = "white";

  ctx.font =
    "bold 42px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    "PHOTOBOOTH ✦",
    width / 2,
    65
  );

  // load images
  const loaded = [];

  photos.forEach((src, index) => {

    const img =
      new Image();

    img.onload = () => {

      loaded[index] = img;

      if (
        loaded.length >= photos.length
      ) {

        drawPhotos(
          ctx,
          loaded,
          width,
          height
        );

      }

    };

    img.src = src;

  });

});


// ============================
// GAMBAR HASIL
// ============================

function drawPhotos(
  ctx,
  images,
  width,
  height
) {

  const margin = 90;

  const gap = 35;

  const photoWidth =
    images.length === 2
      ? 500
      : 1000;

  const photoHeight = 625;

  const startX =
    images.length === 2
      ? (width - photoWidth * 2 - gap) / 2
      : margin;

  images.forEach((img, index) => {

    const x =
      images.length === 2
        ? startX +
          index *
          (photoWidth + gap)
        : startX;

    const y = 105;

    // white frame
    ctx.fillStyle = "white";

    ctx.fillRect(
      x - 10,
      y - 10,
      photoWidth + 20,
      photoHeight + 20
    );

    // image
    ctx.save();

    ctx.beginPath();

    ctx.rect(
      x,
      y,
      photoWidth,
      photoHeight
    );

    ctx.clip();

    const ratio =
      Math.max(
        photoWidth / img.width,
        photoHeight / img.height
      );

    const w =
      img.width * ratio;

    const h =
      img.height * ratio;

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

  });

  // footer
  ctx.fillStyle =
    "rgba(255,255,255,.8)";

  ctx.font =
    "20px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    "made with ✦ PhotoBooth",
    width / 2,
    height - 35
  );

  const link =
    document.createElement("a");

  link.download =
    "photobooth-" +
    Date.now() +
    ".png";

  link.href =
    ctx.canvas.toDataURL("image/png");

  link.click();

  statusText.textContent =
    "Hasil photobooth berhasil disimpan 💾";

}


// ============================
// CLEANUP
// ============================

window.addEventListener(
  "beforeunload",
  stopCamera
);
