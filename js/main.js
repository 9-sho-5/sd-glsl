const words = ["SHADER", "GLSL", "UNIFORMS", "FRAGMENT", "RAYMARCH"];
const element = document.querySelector(".lead_title");
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = words[wordIndex];
  const displayed = current.slice(0, charIndex);
  element.textContent = displayed || "\u00A0"; // 空白でもカーソル見える

  if (!isDeleting) {
    if (charIndex < current.length) {
      charIndex++;
      setTimeout(type, 120);
    } else {
      isDeleting = true;
      setTimeout(type, 1500); // 完了後に少し待つ
    }
  } else {
    if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 50);
    } else {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 1000);
    }
  }
}

window.addEventListener("DOMContentLoaded", type);

document.querySelectorAll(".archive_item").forEach((item) => {
  const frameContainer = document.getElementById("previewFrameContainer");
  const frame = document.getElementById("previewFrame");

  item.addEventListener("mouseover", () => {
    const href = item.getAttribute("href");
    frame.src = href;
    frameContainer.style.display = "block";
  });

  item.addEventListener("mousemove", (e) => {
    frameContainer.style.left = `${e.pageX + 20}px`;
    frameContainer.style.top = `${e.pageY - 100}px`;
  });

  item.addEventListener("mouseout", () => {
    frameContainer.style.display = "none";
    frame.src = "";
  });
});
