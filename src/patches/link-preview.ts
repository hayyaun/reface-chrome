const iframe = document.createElement("iframe");
const closeBtn = document.createElement("span");
closeBtn.classList.add("close-btn");
const root = document.createElement("div");
root.classList.add("rc-link-preview");
root.appendChild(iframe);
root.appendChild(closeBtn);
document.body.appendChild(root);

// Animations

function show() {
  root.style.setProperty("opacity", "1");
  root.style.setProperty("display", "block");
}

function hide() {
  root.style.setProperty("opacity", "0");
  root.style.setProperty("display", "none");
}

const position = { x: 0, y: 0 };
const positionTo = { x: 0, y: 0 };

let visible = false;
let hoverTimer: NodeJS.Timeout;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function animate() {
  position.x = lerp(position.x, positionTo.x, 0.08);
  position.y = lerp(position.y, positionTo.y, 0.04);
  root.style.left = position.x + "px";
  root.style.top = position.y + "px";
  if (visible) show();
  else hide();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

document.body.addEventListener("pointermove", (ev) => {
  // root
  positionTo.x = ev.clientX;
  positionTo.y = ev.clientY;
  const translate = [];
  if (ev.clientX > window.innerWidth / 2) {
    translate.push("translateX(-100%)");
  }
  if (ev.clientY > window.innerHeight / 2) {
    translate.push("translateY(-100%)");
  }
  root.style.transform = translate.join(" ");
});

// Links

const links = document.querySelectorAll("a");

links.forEach((link) => {
  link.addEventListener("pointerenter", () => {
    let loaded = false;
    // timer
    hoverTimer = setTimeout(() => {
      if (loaded) visible = true;
    }, 1500);
    // iframe
    iframe.src = link.href;
    iframe.onload = () => {
      loaded = true;
    };
    iframe.onerror = () => {
      // visible = false;
    };
    // close button
    closeBtn.onclick = () => {
      visible = false;
    };
  });
  link.addEventListener("pointerleave", () => {
    clearTimeout(hoverTimer);
  });
});
