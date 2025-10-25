const config = window.__rc_config["whiteboard"];
const scale = (config["scale"] ?? 0.5) as number;
const fontFamily = (config["font-family"] ?? "Roboto") as string;

const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];

// TODO add undo/redo at least for 1 step

interface State {
  mode: "draw" | "type" | "settings" | "work";
  // ui
  canvas: HTMLCanvasElement;
  panel: HTMLDivElement;
  modeBtn: HTMLDivElement;
  drawBtn: HTMLLabelElement;
  typingBtn: HTMLDivElement;
  settingsBtn: HTMLDivElement;
  textPreview: HTMLDivElement;
  settings: HTMLDivElement;
  // config
  color: string;
  thickness: number;
  fontFamily: string;
  fontSize: number;
}

const fallbackMode: State["mode"] = "work";

const state: State = {
  mode: fallbackMode,
  canvas: null!,
  panel: null!,
  modeBtn: null!,
  drawBtn: null!,
  typingBtn: null!,
  settingsBtn: null!,
  textPreview: null!,
  settings: null!,
  color: "#ff0000",
  thickness: 5 * scale,
  fontFamily,
  fontSize: 48,
};

let pos: [x: number, y: number] = [0, 0];

const getModeText = () => {
  if (state.mode === "draw") return "Draw mode";
  if (state.mode === "type") return "Type mode";
  if (state.mode === "settings") return "Settings";
  return "Normal";
};

function setMode(_mode: State["mode"]) {
  let mode = _mode;
  if (state.mode === _mode) mode = fallbackMode; // fallback toggler

  state.mode = mode;
  state.canvas.style.pointerEvents = mode === "work" ? "none" : "auto";
  state.modeBtn.textContent = getModeText();

  if (mode === "draw") {
    state.drawBtn.classList.add("reface--whiteboard-btn-active");
  } else {
    state.drawBtn.classList.remove("reface--whiteboard-btn-active");
  }

  if (mode === "type") {
    state.typingBtn.classList.add("reface--whiteboard-btn-active");
    // update
    pos = [
      window.scrollX + window.innerWidth / 2, //
      window.scrollY + window.innerHeight / 2,
    ];
    updateTextPreview("");
  } else {
    state.typingBtn.classList.remove("reface--whiteboard-btn-active");
  }

  if (mode === "settings") {
    state.settingsBtn.classList.add("reface--whiteboard-btn-active");
    state.settings.classList.remove("reface--whiteboard-hidden");
  } else {
    state.settingsBtn.classList.remove("reface--whiteboard-btn-active");
    state.settings.classList.add("reface--whiteboard-hidden");
  }
}

function updateColor(color: string) {
  state.color = color;
  document.body.style.setProperty("--reface--whiteboard-color", state.color);
}

function addDrawListeners(ctx: CanvasRenderingContext2D) {
  let drawing = false;
  // Mouse events
  state.canvas.addEventListener("mousedown", (ev) => {
    if (state.mode !== "draw") return;
    drawing = true;
    ctx.beginPath();
    ctx.strokeStyle = state.color;
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

function updateTextPreview(text?: string) {
  if (typeof text === "undefined") {
    state.textPreview.style.display = "none";
    return;
  }
  state.textPreview.textContent = text || ".";
  state.textPreview.style.display = "block";
  state.textPreview.style.color = state.color;
  state.textPreview.style.fontSize = state.fontSize + "px";
  state.textPreview.style.fontFamily = state.fontFamily;
  state.textPreview.style.left = pos[0] + "px";
  state.textPreview.style.top = pos[1] + "px";
}

function addTypingListeners(ctx: CanvasRenderingContext2D) {
  let text = "";
  function stopPropagation(ev: KeyboardEvent) {
    if (state.mode !== "type") return;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
  }
  function onKeydown(ev: KeyboardEvent) {
    if (state.mode !== "type") return;
    stopPropagation(ev);
    if (ev.key === "Enter") {
      // Set font style and size
      ctx.fillStyle = state.color;
      ctx.font = `${state.fontSize * scale}px ${state.fontFamily}`;
      ctx.fillText(text, pos[0] * scale, pos[1] * scale);
      // reset
      text = "";
      setMode(fallbackMode);
      updateTextPreview(undefined);
      return;
    }
    // Fill text
    if (ev.key === "Backspace") {
      text = text.slice(0, -1);
    } else if (ev.key.length === 1) {
      text += ev.key;
    }
    updateTextPreview(text);
  }
  state.canvas.addEventListener("click", (ev) => {
    // free positioning for users
    if (state.mode !== "type") return;
    pos = [ev.offsetX, ev.offsetY];
    updateTextPreview(text);
  });
  window.addEventListener("keydown", onKeydown, true);
  window.addEventListener("keypress", stopPropagation, true);
  window.addEventListener("keyup", stopPropagation, true);
}

function createPanelButtons() {
  // -- Mode
  state.modeBtn = document.createElement("div");
  state.panel.appendChild(state.modeBtn);
  state.modeBtn.classList.add("reface--whiteboard-btn");
  state.modeBtn.textContent = getModeText();
  state.modeBtn.addEventListener("click", () => setMode(fallbackMode));

  // -- Draw mode
  state.drawBtn = document.createElement("label");
  state.panel.appendChild(state.drawBtn);
  state.drawBtn.classList.add("reface--whiteboard-btn");
  state.drawBtn.addEventListener("click", () => setMode("draw"));

  const colorDot = document.createElement("div");
  state.drawBtn.appendChild(colorDot);
  colorDot.classList.add("reface--whiteboard-picker", "reface--whiteboard-color");

  // -- Typing mode
  state.typingBtn = document.createElement("div");
  state.panel.appendChild(state.typingBtn);
  state.typingBtn.addEventListener("click", () => setMode("type"));
  state.typingBtn.classList.add("reface--whiteboard-btn", "reface--whiteboard-typing-btn");
  state.typingBtn.textContent = "T";

  // -- Settings
  state.settingsBtn = document.createElement("div");
  state.panel.appendChild(state.settingsBtn);
  state.settingsBtn.addEventListener("click", () => setMode("settings"));
  state.settingsBtn.classList.add("reface--whiteboard-btn", "reface--whiteboard-settings-btn");

  const settingsIcon = document.createElement("img");
  state.settingsBtn.appendChild(settingsIcon);
  settingsIcon.src = chrome.runtime.getURL("images/icons/Settings3Line.svg");
}

function createSettingsMenu() {
  const colorDot = document.createElement("label");
  state.settings.appendChild(colorDot);
  colorDot.classList.add("reface--whiteboard-picker", "reface--whiteboard-color");

  const colorPickerId = "reface--whiteboard-color-picker";
  colorDot.htmlFor = colorPickerId;
  const colorPicker = document.createElement("input");
  colorDot.appendChild(colorPicker);
  colorPicker.id = colorPickerId;
  colorPicker.type = "color";
  colorPicker.style.display = "none";
  colorPicker.value = state.color;
  colorPicker.addEventListener("input", (ev) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateColor((ev.target as any).value as string);
  });
}

function init() {
  // 1. Create canvas
  state.canvas = document.createElement("canvas");
  document.body.appendChild(state.canvas);
  state.canvas.width = canvasSize[0] * scale;
  state.canvas.height = canvasSize[1] * scale;
  state.canvas.style.height = `${canvasSize[1]}px`;
  state.canvas.classList.add("reface--whiteboard-canvas");

  const ctx = state.canvas.getContext("2d")!;
  addDrawListeners(ctx);
  addTypingListeners(ctx);

  // 2. Create panel
  state.panel = document.createElement("div");
  document.body.appendChild(state.panel);
  state.panel.classList.add("reface--whiteboard-panel");
  createPanelButtons();

  // 3. Settings
  state.settings = document.createElement("div");
  document.body.appendChild(state.settings);
  state.settings.classList.add("reface--whiteboard-settings");
  createSettingsMenu();

  // 4. Text preview
  state.textPreview = document.createElement("div");
  document.body.appendChild(state.textPreview);
  state.textPreview.classList.add("reface--whiteboard-text-preview");

  // Initialization
  setMode("work");
  updateColor(state.color);
}

init();
