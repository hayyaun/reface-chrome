// constants
const DY_ALPHA = 0.04;
const DX_ALPHA = DY_ALPHA * 4;
const TY_ALPHA = DY_ALPHA * 20;
const TX_ALPHA = DX_ALPHA;
const SPACE_Y = 20;
const V_THRESHOLD = 500;

// Elements

const iframe = document.createElement("iframe");
const closeBtn = document.createElement("span");
closeBtn.classList.add("close-btn");
closeBtn.textContent = "x";
const root = document.createElement("div");
root.classList.add("rc-link-preview");
root.appendChild(iframe);
root.appendChild(closeBtn);
document.body.appendChild(root);

// Animations

const position = { x: 0, y: 0, tx: 0, ty: 0 };
const cursor = { x: 0, y: 0, tx: 0, ty: 0 };

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
  position.x = lerp(position.x, cursor.x, DX_ALPHA);
  position.y = lerp(position.y, cursor.y, DY_ALPHA);
  root.style.left = position.x + "px";
  root.style.top = position.y + "px";
}

function translate() {
  position.tx = lerp(position.tx, cursor.tx, TX_ALPHA);
  position.ty = lerp(position.ty, cursor.ty, TY_ALPHA);
  const transform = `translate(${position.tx}%, ${position.ty}%) translateY(${position.ty < -50 ? -SPACE_Y : SPACE_Y}px)`;
  root.style.transform = transform;
}

function animate() {
  displace();
  translate();
  if (visible) show();
  else hide();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

document.body.addEventListener("pointermove", (ev) => {
  const el = document.elementFromPoint(ev.clientX, ev.clientY);
  if (el?.tagName.toLowerCase() === "iframe") return;
  if (el?.classList.contains("rc-link-preview")) return;
  if (el?.classList.contains("close-btn")) return;

  cursor.x = ev.clientX;
  cursor.y = ev.clientY;

  cursor.tx = (ev.clientX / window.innerWidth) * -100;
  cursor.ty = ev.clientY > V_THRESHOLD ? -100 : 0;
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
