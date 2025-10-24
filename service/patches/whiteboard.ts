interface State {
  mode: "draw" | "work";
  canvas: HTMLCanvasElement;
  panel: HTMLDivElement;
  modeBtn: HTMLDivElement;
  pickerBtn: HTMLLabelElement;
  color: string;
  thickness: number;
}

const state: State = {
  mode: "draw",
  canvas: null!,
  panel: null!,
  modeBtn: null!,
  pickerBtn: null!,
  color: "#ff0000",
  thickness: 5,
};

function addDrawListener() {
  const ctx = state.canvas.getContext("2d")!;
  let drawing = false;
  // Mouse events
  state.canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.strokeStyle = state.color;
    ctx.lineWidth = state.thickness;
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  state.canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  state.canvas.addEventListener("mouseup", () => (drawing = false));
  state.canvas.addEventListener("mouseout", () => (drawing = false));
}

function toggleMode() {
  if (state.mode === "draw") {
    state.mode = "work";
    state.modeBtn.textContent = "Work mode";
    state.canvas.style.pointerEvents = "none";
  } else {
    state.mode = "draw";
    state.modeBtn.textContent = "Draw mode";
    state.canvas.style.pointerEvents = "auto";
  }
}

function updateColor(color: string) {
  state.color = color;
  state.pickerBtn.style.color = color;
}

function init() {
  // create and insert a canvas into the document
  state.canvas = document.createElement("canvas");
  state.canvas.width = document.body.scrollWidth;
  state.canvas.height = document.body.scrollHeight;
  state.canvas.style.height = `${document.body.scrollHeight}px`;
  state.canvas.classList.add("reface__whiteboard-canvas");
  document.body.appendChild(state.canvas);

  addDrawListener();

  // create panel
  state.panel = document.createElement("div");
  state.panel.classList.add("reface__whiteboard-panel");
  document.body.appendChild(state.panel);

  // create panel buttons
  // Mode
  state.modeBtn = document.createElement("div");
  state.modeBtn.classList.add("reface__whiteboard-btn");
  state.modeBtn.textContent = "Draw mode";
  state.modeBtn.addEventListener("click", toggleMode);
  state.panel.appendChild(state.modeBtn);
  // Color Picker
  const colorPicker = document.createElement("input");
  colorPicker.id = "reface__whiteboard-color-picker";
  colorPicker.type = "color";
  colorPicker.style.display = "none";
  colorPicker.value = state.color;
  colorPicker.addEventListener("input", (ev) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateColor((ev.target as any).value as string);
  });
  state.pickerBtn = document.createElement("label");
  state.pickerBtn.htmlFor = colorPicker.id;
  state.pickerBtn.classList.add("reface__whiteboard-btn");
  state.pickerBtn.style.color = state.color;
  state.pickerBtn.appendChild(colorPicker);
  state.panel.appendChild(state.pickerBtn);
  const colorDot = document.createElement("div");
  colorDot.classList.add("reface__whiteboard-picker");
  state.pickerBtn.appendChild(colorDot);
}

init();
