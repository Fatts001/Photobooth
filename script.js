const camera = document.getElementById("camera");
const preview = document.getElementById("photoPreview");
const canvas = document.getElementById("canvas");
const empty = document.getElementById("empty");

const cameraBtn = document.getElementById("cameraBtn");
const galleryInput = document.getElementById("galleryInput");
const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");

const cameraControls = document.getElementById("cameraControls");
const resultControls = document.getElementById("resultControls");

const downloadBtn = document.getElementById("downloadBtn");
const againBtn = document.getElementById("againBtn");
const statusText = document.getElementById("status");

let stream = null;
let currentImage = null;

// =========================
// BUKA KAMERA
// =========================

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
    preview.style.display = "none";
    empty.style.display = "none";

    cameraControls.classList.remove("hidden");
    resultControls.classList.add("hidden");

    statusText.textContent = "Kamera siap 📸";

  } catch (error) {
    statusText.textContent =
      "Kamera tidak bisa dibuka. Pastikan izin kamera diberikan.";
  }
});

// =========================
// AMBIL FOTO
// =========================

captureBtn.addEventListener("click", () => {
  if (!stream) return;

  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;

  const ctx = canvas.getContext("2d");

  // Mirror seperti kamera selfie
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    camera,
    0,
    0,
    canvas.width,
    canvas.height
  );

  currentImage = canvas.toDataURL("image/png");

  preview.src = currentImage;

  camera.style.display = "none";
  preview.style.display = "block";

  stopCamera();

  cameraControls.classList.add("hidden");
  resultControls.classList.remove("hidden");

  statusText.textContent = "Foto berhasil diambil! 📸";
});

// =========================
// GALERI
// =========================

galleryInput.addEventListener("change", event => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    statusText.textContent = "File harus berupa gambar.";
    return;
  }

  const reader = new FileReader();

  reader.onload = e => {
    currentImage = e.target.result;

    preview.src = currentImage;

    preview.style.display = "block";
    camera.style.display = "none";
    empty.style.display = "none";

    cameraControls.classList.add("hidden");
    resultControls.classList.remove("hidden");

    stopCamera();

    statusText.textContent = "Foto dari galeri berhasil dipilih 🖼️";
  };

  reader.readAsDataURL(file);
});

// =========================
// TUTUP KAMERA
// =========================

stopBtn.addEventListener("click", () => {
  stopCamera();

  camera.style.display = "none";

  if (!currentImage) {
    empty.style.display = "grid";
  }

  cameraControls.classList.add("hidden");

  statusText.textContent = "";
});

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    camera.srcObject = null;
  }
}

// =========================
// FOTO LAGI
// =========================

againBtn.addEventListener("click", () => {
  currentImage = null;

  preview.src = "";
  preview.style.display = "none";

  empty.style.display = "grid";

  resultControls.classList.add("hidden");

  galleryInput.value = "";

  statusText.textContent = "";
});

// =========================
// DOWNLOAD
// =========================

downloadBtn.addEventListener("click", () => {
  if (!currentImage) return;

  const link = document.createElement("a");

  link.href = currentImage;
  link.download = "photobooth-" + Date.now() + ".png";

  document.body.appendChild(link);
  link.click();
  link.remove();

  statusText.textContent = "Foto disimpan 💾";
});

// =========================
// SAAT KELUAR DARI HALAMAN
// =========================

window.addEventListener("beforeunload", () => {
  stopCamera();
});
