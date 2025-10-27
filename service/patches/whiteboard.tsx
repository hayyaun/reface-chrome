/* eslint-disable react-refresh/only-export-components */
import api from "@/shared/api";
import { computed, effect, signal } from "@preact/signals";
import clsx from "clsx";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";

type Mode = "draw" | "type" | "work";

type Pos = [x: number, y: number];

// TODO add eraser button
// TODO add shapes button
// TODO add hash to compare unchanged -> don't save

const config = window.__rc_config["whiteboard"];
const scale = (config["scale"] as number) ?? 0.5;
const initMode = (config["init-mode"] as Mode) ?? "draw";
const autoPersist = (config["auto-save"] as boolean) ?? false;
const _fontFamily = (config["font-family"] as string) ?? "Roboto";

const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];
const fallbackMode: Mode = "work";

const MAX_BUFFER_SIZE = 10;

// Signals
const ctx = signal<CanvasRenderingContext2D | null>(null);
const buffer = signal<string[]>([]);
const shift = signal(0); // present
const color = signal("#ff0000");
const mode = signal<Mode>(initMode);
const thickness = signal(6);
const fontFamily = signal(_fontFamily);
const fontSize = signal(48);
const pos = signal<Pos | null>(null);
const text = signal("");
const settingsOpen = signal(false);

color.subscribe((value) => {
  document.body.style.setProperty("--reface--whiteboard-color", value);
});

mode.subscribe((value) => {
  if (value !== "type") {
    pos.value = null;
    return;
  }
  pos.value = [
    window.scrollX + window.innerWidth / 2, //
    window.scrollY + window.innerHeight / 2,
  ];
});

const getModeText = (mode: Mode) => {
  if (mode === "draw") return "Draw";
  if (mode === "type") return "Type";
  return "Normal";
};

// Buffer

const canUndo = computed(() => shift.value < buffer.value.length - 1);
const canRedo = computed(() => shift.value > 0);
const index = computed(() => buffer.value.length - 1 - shift.value);

effect(() => {
  console.debug("buffer", buffer.value.length, "shift", shift.value, "index", index.value);
});

const addBuffer = (dataURL: string) => {
  const newBuffer = buffer.value.slice(); // clone
  while (shift.value > 0) {
    // make it present
    newBuffer.pop();
    shift.value--;
  }
  if (newBuffer.length >= MAX_BUFFER_SIZE) {
    newBuffer.shift();
  }
  newBuffer.push(dataURL);
  buffer.value = newBuffer; // triggers subscriptions
};

const undo = () => {
  if (!canUndo.value) return;
  shift.value++;
  clearCanvas();
  drawData(buffer.value[index.value]);
};

const redo = () => {
  if (!canRedo.value) return;
  shift.value--;
  clearCanvas();
  drawData(buffer.value[index.value]);
};

// Canvas

const drawData = async (dataURL: string, imgScale = scale) => {
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataURL;
    const factor = scale / imgScale;
    img.onload = () => {
      ctx.value?.drawImage(img, 0, 0, img.width * factor, img.height * factor);
      resolve(null);
    };
    img.onerror = reject;
  });
};

const initCanvasData = async () => {
  const res = await api.runtime.sendMessage({
    to: "background",
    action: "whiteboard_get_item",
    data: window.location.href,
  });
  console.debug({ saved: res });
  if (!res?.data) {
    saveData(); // initial state = empty
    return;
  }
  // initial state = from storage
  addBuffer(res.data);
  drawData(res.data, res.scale);
};

const saveData = (persist = false) => {
  const data = ctx.value?.canvas.toDataURL();
  if (!data) return alert("Cannot save canvas");
  addBuffer(data);
  if (autoPersist || persist) {
    api.runtime.sendMessage({
      to: "background",
      action: "whiteboard_set_item",
      data: { url: window.location.href, data, scale },
    });
  }
};

const clearCanvas = (save = false) => {
  ctx.value?.clearRect(0, 0, ctx.value?.canvas.width, ctx.value?.canvas.height);
  if (save) saveData();
};

// Effects

effect(() => {
  // Draw effects
  if (!ctx.value) return;
  let drawing = false;
  function onMouseDown(ev: MouseEvent) {
    if (!ctx.value) return;
    if (mode.value !== "draw") return;
    drawing = true;
    ctx.value.beginPath();
    ctx.value.strokeStyle = color.value;
    ctx.value.lineWidth = thickness.value * scale;
    ctx.value.lineJoin = "round";
    ctx.value.lineCap = "round";
    ctx.value.moveTo(ev.offsetX * scale, ev.offsetY * scale);
  }
  function onMouseMove(ev: MouseEvent) {
    if (!ctx.value) return;
    if (!drawing) return;
    ctx.value.lineTo(ev.offsetX * scale, ev.offsetY * scale);
    ctx.value.stroke();
  }
  const reset = (save: boolean) => {
    if (save && drawing) saveData();
    drawing = false;
  };
  ctx.value.canvas.addEventListener("mousedown", onMouseDown);
  ctx.value.canvas.addEventListener("mousemove", onMouseMove);
  ctx.value.canvas.addEventListener("mouseup", () => reset(true));
  ctx.value.canvas.addEventListener("mouseout", () => reset(false));
  return () => {
    if (!ctx.value) return;
    ctx.value.canvas.removeEventListener("mousedown", onMouseDown);
    ctx.value.canvas.removeEventListener("mousemove", onMouseMove);
    ctx.value.canvas.removeEventListener("mouseup", () => reset(true));
    ctx.value.canvas.removeEventListener("mouseout", () => reset(false));
  };
});

effect(() => {
  // Typing effects
  if (!ctx.value) return;
  function stopPropagation(ev: KeyboardEvent) {
    if (mode.value !== "type") return;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
  }
  function onKeydown(ev: KeyboardEvent) {
    if (!ctx.value) return;
    if (mode.value !== "type") return;
    stopPropagation(ev);
    if (ev.key === "Enter") {
      // Set font style and size
      ctx.value.fillStyle = color.value;
      ctx.value.font = `${fontSize.value * scale}px ${fontFamily.value}`;
      if (pos.value) {
        ctx.value.fillText(text.value, pos.value[0] * scale, pos.value[1] * scale);
      }
      // reset
      saveData();
      text.value = "";
      mode.value = fallbackMode;
      pos.value = null;
      return;
    }
    // Fill text
    if (ev.key === "Backspace") {
      text.value = text.value.slice(0, -1);
    } else if (ev.key.length === 1) {
      text.value = text.value + ev.key;
    }
  }
  function reposition(ev: MouseEvent) {
    // free positioning for users
    if (mode.value !== "type") return;
    pos.value = [ev.offsetX, ev.offsetY];
  }
  ctx.value.canvas.addEventListener("click", reposition);
  window.addEventListener("keydown", onKeydown, true);
  window.addEventListener("keypress", stopPropagation, true);
  window.addEventListener("keyup", stopPropagation, true);
  return () => {
    if (!ctx.value) return;
    ctx.value.canvas.removeEventListener("click", reposition);
    window.removeEventListener("keydown", onKeydown, true);
    window.removeEventListener("keypress", stopPropagation, true);
    window.removeEventListener("keyup", stopPropagation, true);
  };
});

// UI

function UI() {
  const _canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!_canvas.current) return;
    ctx.value = _canvas.current.getContext("2d")!;
    initCanvasData();
  }, []);
  return (
    <>
      <canvas
        ref={_canvas}
        width={canvasSize[0] * scale}
        height={canvasSize[1] * scale}
        style={{
          width: `${canvasSize[0]}px`, // initial width
          height: `${canvasSize[1]}px`, // initial height
          pointerEvents: mode.value === "work" ? "none" : "all",
          border: mode.value === "work" ? "none" : "1px solid red",
        }}
      />
      <Panel />
      {settingsOpen.value && <Settings />}
      <TextPreview />
    </>
  );
}

function Panel() {
  return (
    <div aria-label="Panel" className="reface--whiteboard-panel">
      <div
        aria-label="Mode"
        className="reface--whiteboard-btn"
        style={{ padding: "4px 12px", aspectRatio: "auto" }}
        onClick={() => (mode.value = fallbackMode)}
      >
        {getModeText(mode.value)}
      </div>
      <div
        title="Draw"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "draw",
        })}
        onClick={() => (mode.value = "draw")}
      >
        <div className="reface--whiteboard-dot" />
      </div>
      <div
        title="Type"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "type",
        })}
        style={{ fontFamily: "Roboto", fontSize: 16 }}
        onClick={() => (mode.value = "type")}
      >
        T
      </div>
      <div
        title="Settings"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": settingsOpen.value,
        })}
        onClick={() => (settingsOpen.value = !settingsOpen.value)}
      >
        <img src={api.runtime.getURL("images/icons/RiSettings3Line.svg")} />
      </div>
      <div title="Save" className="reface--whiteboard-btn" onClick={() => saveData(true)}>
        <img src={api.runtime.getURL("images/icons/RiSaveLine.svg")} />
      </div>
      <div title="Clear" className="reface--whiteboard-btn" onClick={() => clearCanvas(true)}>
        <img src={api.runtime.getURL("images/icons/RiDeleteBin.svg")} />
      </div>
      <div
        title="Undo"
        className="reface--whiteboard-btn"
        onClick={canUndo.value ? undo : undefined}
        style={{ opacity: canUndo.value ? 1 : 0.5, cursor: canUndo.value ? "pointer" : "auto" }}
      >
        <img src={api.runtime.getURL("images/icons/RiGoBackLine.svg")} />
      </div>
      <div
        title="Redo"
        className="reface--whiteboard-btn"
        onClick={canRedo.value ? redo : undefined}
        style={{ opacity: canRedo.value ? 1 : 0.5, cursor: canRedo.value ? "pointer" : "auto" }}
      >
        <img
          src={api.runtime.getURL("images/icons/RiGoBackLine.svg")}
          style={{ transform: "rotateY(180deg)" }}
        />
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div aria-label="Settings" className="reface--whiteboard-settings">
      <div aria-label="Color picker">
        <input
          id="reface--whiteboard--color-picker"
          type="color"
          style={{ display: "none" }}
          value={color}
          onInput={(ev) => (color.value = ev.currentTarget.value)}
        />
        <label
          htmlFor="reface--whiteboard--color-picker"
          className="reface--whiteboard-row"
          style={{ cursor: "pointer" }}
        >
          <div>Select color</div>
          <div className="reface--whiteboard-flex-center" style={{ width: 20, height: 20 }}>
            <div
              className="reface--whiteboard-dot"
              style={{ width: thickness.value, height: thickness.value }}
            />
          </div>
        </label>
      </div>
      <div aria-label="Thickness" className="reface--whiteboard-row">
        <label htmlFor="reface--whiteboard--thickness">Thickness</label>
        <input
          type="range"
          id="reface--whiteboard--thickness"
          name="thickness"
          min={1}
          max={20}
          value={thickness}
          onInput={(ev) => (thickness.value = parseFloat(ev.currentTarget.value))}
        />
      </div>
      <div aria-label="Font size" className="reface--whiteboard-row">
        <label htmlFor="reface--whiteboard--font-size">Font Size</label>
        <input
          type="range"
          id="reface--whiteboard--font-size"
          name="font-size"
          min={8}
          max={128}
          value={fontSize}
          onInput={(ev) => (fontSize.value = parseFloat(ev.currentTarget.value))}
        />
      </div>
    </div>
  );
}

function TextPreview() {
  if (!pos.value) return;
  return (
    <div
      className="reface--whiteboard-text-preview"
      style={{
        color: color.value,
        fontSize: fontSize.value + "px",
        fontFamily: fontFamily.value,
        left: pos.value[0] + "px",
        top: pos.value[1] + "px",
        height: fontSize.value + "px",
      }}
    >
      {text}
    </div>
  );
}

// Create UI
const uiRoot = document.createElement("div");
uiRoot.classList.add("reface--whiteboard");
document.body.appendChild(uiRoot);
render(<UI />, uiRoot);
