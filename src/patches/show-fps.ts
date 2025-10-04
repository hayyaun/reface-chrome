let last = performance.now();
let frames = 0;

function showUI(fps: number) {
  let text = document.querySelector("span.fps-indicator-root");
  if (!text) {
    text = document.createElement("span");
    text.classList.add("fps-indicator-root");
    const root = document.createElement("div");
    root.classList.add("fps-indicator");
    root.onclick = () => {
      root.style.display = "none";
    };
    // add to dom
    document.body.appendChild(root);
    root.appendChild(text);
  }
  text.textContent = `FPS: ${fps}`;
}

function update() {
  frames++;
  const now = performance.now();
  if (now - last >= 1000) {
    showUI(frames);
    frames = 0;
    last = now;
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
