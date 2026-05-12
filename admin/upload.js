document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // INPUTS
  // =========================
  const imageInput = document.getElementById("imageFile");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const countryInput = document.getElementById("country");

  // preview (TEXT)
  const previewTitle = document.getElementById("previewTitle");
  const previewCategory = document.getElementById("previewCategory");
  const previewCountry = document.getElementById("previewCountry");

  // preview (IMAGES)
  const mainPreview = document.getElementById("mainPreview");
  const thumbs = document.getElementById("thumbs");

  // =========================
  // STATE
  // =========================
  let selectedFiles = [];
  let activeIndex = 0;

  // =========================
  // MULTI IMAGE SELECT
  // =========================
  imageInput.addEventListener("change", (e) => {
    selectedFiles = Array.from(e.target.files);
    activeIndex = 0;

    renderPreview();
  });

  // =========================
  // RENDER IMAGES
  // =========================
  function renderPreview() {
    if (selectedFiles.length === 0) return;

    const file = selectedFiles[activeIndex];

    const reader = new FileReader();

    reader.onload = (ev) => {
      mainPreview.innerHTML = `
          <img src="${ev.target.result}" style="
            width:100%;
            height:100%;
            object-fit:cover;
          "/>
        `;
    };

    reader.readAsDataURL(file);

    // THUMBNAILS (FIXED)
    thumbs.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const thumbReader = new FileReader();

      thumbReader.onload = (ev) => {
        const img = document.createElement("img");

        img.src = ev.target.result;

        img.style.width = "70px";
        img.style.height = "70px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        img.style.cursor = "pointer";
        img.style.border =
          index === activeIndex ? "2px solid #00d084" : "2px solid transparent";

        img.addEventListener("click", () => {
          activeIndex = index;
          renderPreview();
        });

        thumbs.appendChild(img);
      };

      thumbReader.readAsDataURL(file);
    });
  }

  // =========================
  // LIVE TEXT PREVIEW (FIXED)
  // =========================
  titleInput.addEventListener("input", () => {
    previewTitle.textContent = titleInput.value.trim() || "Project Title";
  });

  categoryInput.addEventListener("change", () => {
    previewCategory.textContent = categoryInput.value || "Category";
  });

  countryInput.addEventListener("input", () => {
    previewCountry.textContent = countryInput.value.trim() || "Country";
  });
});

const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("imageFile");
const fileCount = document.getElementById("fileCount");

// click opens file picker
uploadBox.addEventListener("click", () => {
  fileInput.click();
});

// drag highlight
uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = "#00d084";
});

// drag leave
uploadBox.addEventListener("dragleave", () => {
  uploadBox.style.borderColor = "rgba(255,255,255,0.15)";
});

// drop files
uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();

  fileInput.files = e.dataTransfer.files;

  updateFileCount();
});

// file selection change
fileInput.addEventListener("change", updateFileCount);

function updateFileCount() {
  const count = fileInput.files.length;

  fileCount.textContent =
    count === 0 ? "No files selected" : `${count} file(s) selected`;
}
