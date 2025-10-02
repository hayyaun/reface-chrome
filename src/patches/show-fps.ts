let last = performance.now();
let frames = 0;

const styles = `
  .fps-indicator {
    position: fixed;
    z-index: 999;
    bottom: 20px;
    left: 20px;
    padding: 16px 32px;
    background-color: #000;
    border: 1px solid #fff2;
    border-radius: 8px;
    color: #fff;
    opacity: 0.5;
    font-size: 12px;
    cursor: pointer;
    transition: all ease 0.5s;
  }
  .fps-indicator:hover {
    opacity: 1;
  }
`;

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
    const style = document.createElement("style");
    style.textContent = styles;
    // add to dom
    document.head.appendChild(style);
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
