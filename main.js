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
