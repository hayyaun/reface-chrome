// constants
const DX_ALPHA = 0.04;
const DY_ALPHA = 0.2;
const SPACE = 20;
const IFRAME_SIZE = [480, 320];

// Elements

const iframe = document.createElement("iframe");
const closeBtn = document.createElement("span");
closeBtn.classList.add("reface--link-preview-close-btn");
closeBtn.textContent = "x";
const root = document.createElement("div");
root.classList.add("reface--link-preview");
root.appendChild(iframe);
root.appendChild(closeBtn);
document.body.appendChild(root);

// Animations

const position = { x: 0, y: 0 };
const cursor = { x: 0, y: 0 };

let visible = false;
let hoverTimer: NodeJS.Timeout;

function show() {
  root.style.setProperty("opacity", "1");
  root.style.setProperty("display", "block");
}

function hide() {
  root.style.setProperty("opacity", "0");
  root.style.setProperty("display", "none");
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function displace() {
  let x = cursor.x;
  let y = cursor.y;

  if (cursor.x > window.innerWidth / 2) x -= IFRAME_SIZE[0] - SPACE;
  else x -= SPACE;
  if (cursor.y > window.innerHeight / 2) y -= IFRAME_SIZE[1] + SPACE;
  else y += SPACE;

  position.x = lerp(position.x, x, DX_ALPHA);
  position.y = lerp(position.y, y, DY_ALPHA);

  root.style.left = position.x + "px";
  root.style.top = position.y + "px";
}

function animate() {
  displace();
  if (visible) show();
  else hide();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

document.body.addEventListener("pointermove", (ev) => {
  const el = document.elementFromPoint(ev.clientX, ev.clientY);
  if (el?.tagName.toLowerCase() === "iframe") return;
  if (el?.classList.contains("reface--link-preview")) return;
  if (el?.classList.contains("close-btn")) return;

  cursor.x = ev.clientX;
  cursor.y = ev.clientY;
});

// Links

const links = document.querySelectorAll("a");

links.forEach(async (link) => {
  link.addEventListener("pointerenter", () => {
    let loaded = false;
    // iframe
    iframe.src = link.href;
    iframe.onload = () => {
      loaded = true;
    };
    // timer
    hoverTimer = setTimeout(() => {
      if (loaded) visible = true;
    }, 1500);
    // close button
    closeBtn.onclick = () => {
      visible = false;
    };
  });
  link.addEventListener("pointerleave", () => {
    clearTimeout(hoverTimer);
  });
});
