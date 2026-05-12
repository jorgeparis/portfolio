/* =========================
   STATE
========================= */
let currentIndex = 0;
let currentImages = [];
let startX = 0;

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const thumbStrip = document.getElementById("thumb-strip");

/* =========================
   DATA
========================= */
const images = [
  "studio-angola-01.jpg",
  "studio-angola-02.jpg",
  "network-nigeria-01.jpg",
  "network-ghana-01.jpg",
  "telecom-angola-01.jpg"
];

/* =========================
   HELPERS
========================= */
function parseImageName(filename) {
  const [category, country, index] = filename.replace(".jpg", "").split("-");
  return { category, country, index };
}

function groupByCountry(images, selectedCategory) {
  const groups = {};

  images.forEach(img => {
    const { category, country } = parseImageName(img);

    if (selectedCategory !== "all" && category !== selectedCategory) return;

    if (!groups[country]) groups[country] = [];
    groups[country].push(img);
  });

  return groups;
}

/* =========================
   RENDER GALLERY
========================= */
function renderGallery(filter = "all") {
  gallery.innerHTML = "";
  currentImages = [];

  const grouped = groupByCountry(images, filter);

  Object.entries(grouped).forEach(([country, imgs]) => {
    const section = document.createElement("div");
    section.className = "country-section";

    section.innerHTML = `
      <h2 class="country-title">${country.toUpperCase()}</h2>
      <div class="country-grid"></div>
    `;

    const grid = section.querySelector(".country-grid");

    imgs.forEach(img => {
      const index = currentImages.length;
      currentImages.push(img);

      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <img src="images/${img}" />
        <div class="overlay">
          <h3>${country.toUpperCase()}</h3>
          <p>${img.replace(".jpg", "")}</p>
        </div>
      `;

      card.addEventListener("click", () => openLightbox(index));
      grid.appendChild(card);
    });

    gallery.appendChild(section);
  });
}

/* =========================
   FILTER
========================= */
function filterProjects(category, e) {
  document.querySelectorAll(".filters button")
    .forEach(btn => btn.classList.remove("active"));

  if (e) e.target.classList.add("active");

  renderGallery(category);
}

/* =========================
   LIGHTBOX
========================= */
function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "flex";
  updateLightbox();
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function updateLightbox() {
  lightboxImg.src = `images/${currentImages[currentIndex]}`;
  renderThumbnails();
}

/* =========================
   NAVIGATION
========================= */
function nextImage(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
}

function prevImage(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
}

/* =========================
   THUMBNAILS
========================= */
function renderThumbnails() {
  thumbStrip.innerHTML = "";

  currentImages.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = `images/${img}`;
    thumb.className = `thumb ${index === currentIndex ? "active" : ""}`;

    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateLightbox();
    });

    thumbStrip.appendChild(thumb);
  });

  scrollToActiveThumb();
}

function scrollToActiveThumb() {
  const active = document.querySelector(".thumb.active");
  if (!active) return;

  active.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

/* =========================
   EVENTS
========================= */

// Keyboard
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display !== "flex") return;

  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "Escape") closeLightbox();
});

// Touch (Swipe)
lightbox.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;

  if (endX - startX > 50) prevImage();
  if (startX - endX > 50) nextImage();
});

/* =========================
   INIT
========================= */
renderGallery();