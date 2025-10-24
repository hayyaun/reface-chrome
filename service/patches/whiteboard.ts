const config = window.__rc_config["whiteboard"];
const scale = (config["scale"] ?? 0.5) as number;

const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];

interface State {
  mode: "draw" | "type" | "work";
  canvas: HTMLCanvasElement;
  panel: HTMLDivElement;
  modeBtn: HTMLDivElement;
  pickerBtn: HTMLLabelElement;
  color: string;
  thickness: number;
  fontFamily: string;
  fontSize: number;
}

const state: State = {
  mode: "draw",
  canvas: null!,
  panel: null!,
  modeBtn: null!,
  pickerBtn: null!,
  color: "#ff0000",
  thickness: 5 * scale,
  fontFamily: "Roboto",
  fontSize: 48,
};

const getModeText = () => {
  if (state.mode === "draw") return "Draw mode";
  if (state.mode === "type") return "Type mode";
  return "Neutral";
};

function setMode(mode: State["mode"]) {
  state.mode = mode;
  state.canvas.style.pointerEvents = mode === "work" ? "none" : "auto";
  state.modeBtn.textContent = getModeText();
}

function updateColor(ctx: CanvasRenderingContext2D, color: string) {
  state.color = color;
  // ui
  state.pickerBtn.style.color = state.color;
  // ctx
  ctx.strokeStyle = state.color;
  ctx.fillStyle = state.color;
}

function addDrawListeners(ctx: CanvasRenderingContext2D) {
  let drawing = false;
  // Mouse events
  state.canvas.addEventListener("mousedown", (ev) => {
    if (state.mode !== "draw") return;
    drawing = true;
    ctx.beginPath();
    ctx.lineWidth = state.thickness; // TODO update
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.moveTo(ev.offsetX * scale, ev.offsetY * scale);
  });
  state.canvas.addEventListener("mousemove", (ev) => {
    if (!drawing) return;
    ctx.lineTo(ev.offsetX * scale, ev.offsetY * scale);
    ctx.stroke();
  });
  state.canvas.addEventListener("mouseup", () => (drawing = false));
  state.canvas.addEventListener("mouseout", () => (drawing = false));
}

function addTypingListeners(ctx: CanvasRenderingContext2D) {
  let pos = [0, 0];
  let text = "";
  state.canvas.addEventListener("click", (ev) => {
    setMode("type");
    pos = [ev.offsetX * scale, ev.offsetY * scale];
  });
  function stopPropagation(ev: KeyboardEvent) {
    if (state.mode !== "type") return;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
  }
  window.addEventListener(
    "keydown",
    (ev) => {
      if (state.mode !== "type") return;
      stopPropagation(ev);
      if (ev.key === "Enter") {
        // Set font style and size
        ctx.font = `${state.fontSize * scale}px ${state.fontFamily}`; // TODO update
        ctx.fillText(text, pos[0], pos[1]);
        // reset
        text = "";
        setMode("draw");
        // TODO hide prerendered text
        return;
      }

      // Fill text
      if (ev.key === "Backspace") {
        text = text.slice(0, -1);
      } else if (ev.key.length === 1) {
        text += ev.key;
      }

      // TODO show a prerendered text
    },
    true,
  );
  // Avoid
  window.addEventListener("keypress", stopPropagation, true);
  window.addEventListener("keyup", stopPropagation, true);
}

function init() {
  // Create canvas
  state.canvas = document.createElement("canvas");
  state.canvas.width = canvasSize[0] * scale;
  state.canvas.height = canvasSize[1] * scale;
  state.canvas.style.height = `${canvasSize[1]}px`;
  state.canvas.classList.add("reface__whiteboard-canvas");
  document.body.appendChild(state.canvas);

  const ctx = state.canvas.getContext("2d")!;
  addDrawListeners(ctx);
  addTypingListeners(ctx);

  // Create panel
  state.panel = document.createElement("div");
  state.panel.classList.add("reface__whiteboard-panel");
  document.body.appendChild(state.panel);

  // Create panel buttons
  // -- Mode
  state.modeBtn = document.createElement("div");
  state.modeBtn.classList.add("reface__whiteboard-btn");
  state.modeBtn.textContent = getModeText();
  state.modeBtn.addEventListener("click", () => setMode(state.mode === "work" ? "draw" : "work"));
  state.panel.appendChild(state.modeBtn);
  // -- Color Picker
  const colorPicker = document.createElement("input");
  colorPicker.id = "reface__whiteboard-color-picker";
  colorPicker.type = "color";
  colorPicker.style.display = "none";
  colorPicker.value = state.color;
  colorPicker.addEventListener("input", (ev) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateColor(ctx, (ev.target as any).value as string);
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

  // Initialization
  setMode("draw");
  updateColor(ctx, state.color);
}

init();
