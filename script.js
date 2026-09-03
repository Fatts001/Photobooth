const camera = document.getElementById("camera");
const cameraBox = document.getElementById("cameraBox");
const cameraPlaceholder =
  document.getElementById("cameraPlaceholder");

const photoResult =
  document.getElementById("photoResult");

const photo1 =
  document.getElementById("photo1");

const photo2 =
  document.getElementById("photo2");

const photoEmpty =
  document.querySelectorAll(".photo-empty");

const canvas =
  document.getElementById("canvas");

const cameraBtn =
  document.getElementById("cameraBtn");

const galleryInput =
  document.getElementById("galleryInput");

const captureBtn =
  document.getElementById("captureBtn");

const stopBtn =
  document.getElementById("stopBtn");

const cameraControls =
  document.getElementById("cameraControls");

const resultControls =
  document.getElementById("resultControls");

const downloadBtn =
  document.getElementById("downloadBtn");

const againBtn =
  document.getElementById("againBtn");

const counter =
  document.getElementById("counter");

const countdown =
  document.getElementById("countdown");

const status =
  document.getElementById("status");

let stream = null;

let photos = [];

let photoNumber = 0;


// =====================================
// BUKA KAMERA
// =====================================

cameraBtn.addEventListener("click", async () => {

  try {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

      status.textContent =
        "Browser tidak mendukung kamera.";

      return;

    }

    stream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: "user"
        },

        audio: false

      });

    camera.srcObject = stream;

    await camera.play();

    // TAMPILKAN KAMERA
    camera.style.display = "block";

    // HILANGKAN PLACEHOLDER
    cameraPlaceholder.style.display = "none";

    // SEMBUNYIKAN HASIL FOTO
    photoResult.style.display = "none";

    cameraControls.classList.remove("hidden");

    resultControls.classList.add("hidden");

    status.textContent =
      "Kamera siap 📸";

  }

  catch (error) {

    console.error(error);

    camera.style.display = "none";

    cameraPlaceholder.style.display = "flex";

    status.textContent =
      "Tidak bisa membuka kamera. Izinkan akses kamera di browser.";

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

    status.textContent =
      "Kamera belum siap.";

    return;

  }

  canvas.width =
    camera.videoWidth;

  canvas.height =
    camera.videoHeight;

  const ctx =
    canvas.getContext("2d");

  // Mirror selfie
  ctx.save();

  ctx.translate(
    canvas.width,
    0
  );

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
    canvas.toDataURL("image/jpeg", .92);

  photos[photoNumber] = image;

  showPhoto(
    photoNumber,
    image
  );

  photoNumber++;

  if (photoNumber === 1) {

    counter.textContent =
      "Foto 2 dari 2";

    status.textContent =
      "Foto pertama berhasil! Ambil foto kedua 📸";

  }

  else {

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

    photoEmpty[0].style.display =
      "none";

  }

  if (index === 1) {

    photo2.src = image;

    photo2.style.display = "block";

    photoEmpty[1].style.display =
      "none";

  }

}


// =====================================
// COUNTDOWN
// =====================================

function countdownAnimation() {

  return new Promise(resolve => {

    let number = 3;

    countdown.textContent =
      number;

    const timer =
      setInterval(() => {

        number--;

        if (number > 0) {

          countdown.textContent =
            number;

        }

        else {

          countdown.textContent =
            "📸";

          clearInterval(timer);

          setTimeout(() => {

            countdown.textContent =
              "";

            resolve();

          }, 350);

        }

      }, 700);

  });

}


// =====================================
// GALERI
// =====================================

galleryInput.addEventListener(
  "change",
  event => {

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

      const reader =
        new FileReader();

      reader.onload = e => {

        const image =
          e.target.result;

        photos[index] =
          image;

        showPhoto(
          index,
          image
        );

        if (photos.filter(Boolean).length === files.length) {

          cameraPlaceholder.style.display =
            "none";

          camera.style.display =
            "none";

          cameraControls.classList.add(
            "hidden"
          );

          resultControls.classList.remove(
            "hidden"
          );

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

  }
);


// =====================================
// TUTUP KAMERA
// =====================================

stopBtn.addEventListener(
  "click",
  () => {

    stopCamera();

    cameraControls.classList.add(
      "hidden"
    );

    camera.style.display =
      "none";

    if (photos.length === 0) {

      cameraPlaceholder.style.display =
        "flex";

    }

  }
);


function stopCamera() {

  if (stream) {

    stream
      .getTracks()
      .forEach(track => {
        track.stop();
      });

    stream = null;

  }

  camera.srcObject = null;

}


// =====================================
// ULANGI
// =====================================

againBtn.addEventListener(
  "click",
  () => {

    stopCamera();

    photos = [];

    photoNumber = 0;

    photo1.src = "";
    photo2.src = "";

    photo1.style.display =
      "none";

    photo2.style.display =
      "none";

    photoEmpty[0].style.display =
      "flex";

    photoEmpty[1].style.display =
      "flex";

    photoResult.style.display =
      "none";

    camera.style.display =
      "none";

    cameraPlaceholder.style.display =
      "flex";

    cameraControls.classList.add(
      "hidden"
    );

    resultControls.classList.add(
      "hidden"
    );

    galleryInput.value =
      "";

    counter.textContent =
      "Foto 1 dari 2";

    status.textContent =
      "";

  }
);


// =====================================
// SIMPAN HASIL
// =====================================

downloadBtn.addEventListener(
  "click",
  async () => {

    if (photos.filter(Boolean).length === 0) {
      return;
    }

    const output =
      document.createElement("canvas");

    const ctx =
      output.getContext("2d");

    const width = 1200;
    const height = 900;

    output.width =
      width;

    output.height =
      height;

    // BACKGROUND
    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    gradient.addColorStop(
      0,
      "#38245c"
    );

    gradient.addColorStop(
      1,
      "#172f48"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    // DEKORASI
    ctx.fillStyle =
      "rgba(255,255,255,.55)";

    ctx.font =
      "60px Arial";

    ctx.fillText(
      "✦",
      70,
      100
    );

    ctx.fillText(
      "♡",
      1080,
      120
    );

    ctx.fillText(
      "✿",
      70,
      820
    );

    ctx.fillText(
      "✦",
      1080,
      820
    );

    // TITLE
    ctx.fillStyle =
      "white";

    ctx.font =
      "bold 42px Arial";

    ctx.textAlign =
      "center";

    ctx.fillText(
      "PHOTOBOOTH ✦",
      width / 2,
      65
    );

    const validPhotos =
      photos.filter(Boolean);

    const images =
      await Promise.all(
        validPhotos.map(src =>
          loadImage(src)
        )
      );

    const photoWidth =
      validPhotos.length === 2
        ? 500
        : 1000;

    const photoHeight =
      680;

    const gap =
      35;

    const totalWidth =
      validPhotos.length === 2
        ? photoWidth * 2 + gap
        : photoWidth;

    const startX =
      (width - totalWidth) / 2;

    images.forEach(
      (img, index) => {

        const x =
          startX +
          index *
          (photoWidth + gap);

        const y =
          105;

        // FRAME
        ctx.fillStyle =
          "white";

        ctx.fillRect(
          x - 10,
          y - 10,
          photoWidth + 20,
          photoHeight + 20
        );

        // IMAGE
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

      }
    );

    // FOOTER
    ctx.fillStyle =
      "rgba(255,255,255,.8)";

    ctx.font =
      "20px Arial";

    ctx.textAlign =
      "center";

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
      output.toDataURL(
        "image/png"
      );

    link.click();

    status.textContent =
      "Hasil berhasil disimpan 💾";

  }
);


// =====================================
// LOAD IMAGE
// =====================================

function loadImage(src) {

  return new Promise(
    resolve => {

      const img =
        new Image();

      img.onload = () =>
        resolve(img);

      img.src =
        src;

    }
  );

}


// =====================================
// CLEANUP
// =====================================

window.addEventListener(
  "beforeunload",
  () => {
    stopCamera();
  }
);
