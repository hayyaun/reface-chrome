/* eslint-disable react-refresh/only-export-components */
import api from "@/shared/api";
import { computed, effect, signal } from "@preact/signals";
import clsx from "clsx";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";

type Mode = "work" | "draw" | "type" | "erase";

type Pos = [x: number, y: number];

// TODO add shapes button
// TODO add hash to compare unchanged -> don't save

const PATCH_KEY = "whiteboard";
const config = window.__rc_config[PATCH_KEY];
const _persist = (config["persist"] as boolean) ?? false;
const scale = (config["scale"] as number) ?? 0.5;
const _mode = (config["mode"] as Mode) ?? "draw";
const _fontFamily = (config["font-family"] as string) ?? "Roboto";
const _fontSize = (config["font-size"] as number) ?? 48;
const _thickness = (config["thickness"] as number) ?? 6;

const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];
const fallbackMode: Mode = "work";

const MAX_BUFFER_SIZE = 10;

// Signals
const ctx = signal<CanvasRenderingContext2D | null>(null);
const buffer = signal<string[]>([]);
const shift = signal(0); // present
const color = signal("#ff0000");
const mode = signal<Mode>(_mode);
const fontFamily = signal(_fontFamily);
const fontSize = signal(_fontSize);
const thickness = signal(_thickness);
const pos = signal<Pos | null>(null);
const text = signal("");
const settingsOpen = signal(false);

// Subscriptions

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

thickness.subscribe((value) => {
  api.runtime.sendMessage({
    to: "background",
    action: "update_config",
    data: { patchKey: PATCH_KEY, configKey: "thickness", value },
  });
});

fontSize.subscribe((value) => {
  api.runtime.sendMessage({
    to: "background",
    action: "update_config",
    data: { patchKey: PATCH_KEY, configKey: "font-size", value },
  });
});

// Buffer

const canUndo = computed(() => shift.value < buffer.value.length - 1);
const canRedo = computed(() => shift.value > 0);
const index = computed(() => buffer.value.length - 1 - shift.value);

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
  if (_persist || persist) {
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

effect(
  () => {
    if (!ctx.value) return;
    let drawing = false;
    function onMouseDown(ev: MouseEvent) {
      if (!ctx.value) return;
      if (mode.value !== "draw" && mode.value !== "erase") return;
      drawing = true;
      ctx.value.globalCompositeOperation =
        mode.value === "erase" ? "destination-out" : "source-over";
      ctx.value.beginPath();
      ctx.value.strokeStyle = color.value;
      const lineScale = mode.value === "erase" ? 5 : 1;
      ctx.value.lineWidth = thickness.value * scale * lineScale;
      ctx.value.lineJoin = "round";
      ctx.value.lineCap = "round";
      ctx.value.moveTo(ev.offsetX * scale, ev.offsetY * scale);
    }
    function onMouseMove(ev: MouseEvent) {
      if (!ctx.value || !drawing) return;
      ctx.value.lineTo(ev.offsetX * scale, ev.offsetY * scale);
      ctx.value.stroke();
    }
    function onMouseUp() {
      if (drawing) saveData();
      drawing = false;
    }
    function onMouseOut() {
      drawing = false;
    }
    const canvas = ctx.value.canvas;
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", () => onMouseOut);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseout", () => onMouseOut);
    };
  },
  { name: "Draw/Erase" },
);

effect(
  () => {
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
        // Apply text
        ctx.value.fillStyle = color.value;
        ctx.value.font = `${fontSize.value * scale}px ${fontFamily.value}`;
        if (pos.value) {
          ctx.value.fillText(text.value, pos.value[0] * scale, pos.value[1] * scale);
        }
        // Reset
        saveData();
        text.value = "";
        mode.value = fallbackMode;
        pos.value = null;
        return;
      }
      // Fill text for preview
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
    const canvas = ctx.value.canvas;
    canvas.addEventListener("click", reposition);
    window.addEventListener("keydown", onKeydown, true);
    window.addEventListener("keypress", stopPropagation, true);
    window.addEventListener("keyup", stopPropagation, true);
    return () => {
      canvas.removeEventListener("click", reposition);
      window.removeEventListener("keydown", onKeydown, true);
      window.removeEventListener("keypress", stopPropagation, true);
      window.removeEventListener("keyup", stopPropagation, true);
    };
  },
  { name: "Type" },
);

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
        title="Normal"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "work",
        })}
        onClick={() => (mode.value = "work")}
      >
        <img src={api.runtime.getURL("images/icons/RiCursorFill.svg")} />
      </div>
      <div
        title="Draw"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "draw",
        })}
        onClick={() => {
          if (mode.value === "draw") settingsOpen.value = !settingsOpen.value;
          else mode.value = "draw";
        }}
      >
        {mode.value === "draw" ? (
          <PenDot />
        ) : (
          <img src={api.runtime.getURL("images/icons/RiPencilFill.svg")} />
        )}
      </div>
      <div
        title="Type"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "type",
        })}
        onClick={() => {
          if (mode.value === "type") settingsOpen.value = !settingsOpen.value;
          else mode.value = "type";
        }}
      >
        <img src={api.runtime.getURL("images/icons/RiText.svg")} />
      </div>
      <div style={{ borderRight: "1px solid #fff1", height: 24 }} />
      <div
        title="Erase"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode.value === "erase",
        })}
        onClick={() => (mode.value = "erase")}
      >
        <img src={api.runtime.getURL("images/icons/RiEraserFill.svg")} />
      </div>
      <div title="Clear" className="reface--whiteboard-btn" onClick={() => clearCanvas(true)}>
        <img src={api.runtime.getURL("images/icons/RiDeleteBin.svg")} />
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
      <div style={{ borderRight: "1px solid #fff1", height: 24 }} />
      <div title="Save" className="reface--whiteboard-btn" onClick={() => saveData(true)}>
        <img src={api.runtime.getURL("images/icons/RiSaveLine.svg")} />
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
          <PenDot />
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
          step={1}
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
          step={2}
          value={fontSize}
          onInput={(ev) => (fontSize.value = parseFloat(ev.currentTarget.value))}
        />
      </div>
    </div>
  );
}

function PenDot() {
  return (
    <div className="reface--whiteboard-flex-center" style={{ width: 20, height: 20 }}>
      <div
        className="reface--whiteboard-dot"
        style={{ width: thickness.value, height: thickness.value }}
      />
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
