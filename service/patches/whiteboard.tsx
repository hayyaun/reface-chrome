/* eslint-disable react-refresh/only-export-components */
import clsx from "clsx";
import { render } from "preact";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";

// TODO add undo/redo at least for 1 step

const config = window.__rc_config["whiteboard"];
const scale = (config["scale"] ?? 0.5) as number;
const _fontFamily = (config["font-family"] ?? "Roboto") as string;
const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];

type Mode = "draw" | "type" | "work";

type Pos = [x: number, y: number];

const fallbackMode: Mode = "work";

const getModeText = (mode: Mode) => {
  if (mode === "draw") return "Draw mode";
  if (mode === "type") return "Type mode";
  return "Normal";
};

function UI() {
  const [color, setColor] = useState("#ff0000");
  const [mode, setMode] = useState(fallbackMode);
  const [thickness, setThickness] = useState(6);
  const [fontFamily] = useState(_fontFamily);
  const [fontSize, setFontSize] = useState(48);
  const [pos, setPosition] = useState<Pos | null>(null);
  const [text, setText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const _canvas = useRef<HTMLCanvasElement>(null!);
  const ctx = useRef<CanvasRenderingContext2D>(null!);

  useEffect(() => {
    ctx.current = _canvas.current.getContext("2d")!;
  }, []);

  useEffect(() => {
    document.body.style.setProperty("--reface--whiteboard-color", color);
  }, [color]);

  useEffect(() => {
    if (mode !== "type") return;
    setPosition([
      window.scrollX + window.innerWidth / 2, //
      window.scrollY + window.innerHeight / 2,
    ]);
  }, [mode]);

  // Draw effects
  useEffect(() => {
    let drawing = false;
    function onMouseDown(ev: MouseEvent) {
      if (mode !== "draw") return;
      drawing = true;
      ctx.current.beginPath();
      ctx.current.strokeStyle = color;
      ctx.current.lineWidth = thickness * scale;
      ctx.current.lineJoin = "round";
      ctx.current.lineCap = "round";
      ctx.current.moveTo(ev.offsetX * scale, ev.offsetY * scale);
    }
    function onMouseMove(ev: MouseEvent) {
      if (!drawing) return;
      ctx.current.lineTo(ev.offsetX * scale, ev.offsetY * scale);
      ctx.current.stroke();
    }
    const reset = () => (drawing = false);
    _canvas.current.addEventListener("mousedown", onMouseDown);
    _canvas.current.addEventListener("mousemove", onMouseMove);
    _canvas.current.addEventListener("mouseup", reset);
    _canvas.current.addEventListener("mouseout", reset);
    return () => {
      _canvas.current.removeEventListener("mousedown", onMouseDown);
      _canvas.current.removeEventListener("mousemove", onMouseMove);
      _canvas.current.removeEventListener("mouseup", reset);
      _canvas.current.removeEventListener("mouseout", reset);
    };
  }, [color, mode, thickness]);

  const _text = useRef("");
  useEffect(() => {
    _text.current = text;
  }, [text]);

  // Typing effects
  useEffect(() => {
    function stopPropagation(ev: KeyboardEvent) {
      if (mode !== "type") return;
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
    }
    function onKeydown(ev: KeyboardEvent) {
      if (mode !== "type") return;
      stopPropagation(ev);
      if (ev.key === "Enter") {
        // Set font style and size
        ctx.current.fillStyle = color;
        ctx.current.font = `${fontSize * scale}px ${fontFamily}`;
        if (pos) {
          ctx.current.fillText(_text.current, pos[0] * scale, pos[1] * scale);
        }
        // reset
        setText("");
        setMode(fallbackMode);
        setPosition(null);
        return;
      }
      // Fill text
      if (ev.key === "Backspace") {
        setText(_text.current.slice(0, -1));
      } else if (ev.key.length === 1) {
        setText(_text.current + ev.key);
      }
    }
    function reposition(ev: MouseEvent) {
      // free positioning for users
      if (mode !== "type") return;
      setPosition([ev.offsetX, ev.offsetY]);
    }
    _canvas.current.addEventListener("click", reposition);
    window.addEventListener("keydown", onKeydown, true);
    window.addEventListener("keypress", stopPropagation, true);
    window.addEventListener("keyup", stopPropagation, true);
    return () => {
      _canvas.current.removeEventListener("click", reposition);
      window.removeEventListener("keydown", onKeydown, true);
      window.removeEventListener("keypress", stopPropagation, true);
      window.removeEventListener("keyup", stopPropagation, true);
    };
  }, [mode, pos, color, fontFamily, fontSize]);

  return (
    <>
      <canvas
        ref={_canvas}
        width={canvasSize[0] * scale}
        height={canvasSize[1] * scale}
        className="reface--whiteboard-canvas"
        style={{
          height: `${canvasSize[1]}px`,
          pointerEvents: mode === "work" ? "none" : "all",
        }}
      />
      <Panel
        mode={mode}
        setMode={setMode}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
      {settingsOpen && (
        <Settings {...{ mode, color, setColor, thickness, setThickness, fontSize, setFontSize }} />
      )}
      {pos && (
        <div
          className="reface--whiteboard-text-preview"
          style={{
            color: color,
            fontSize: fontSize + "px",
            fontFamily: fontFamily,
            left: pos[0] + "px",
            top: pos[1] + "px",
          }}
        >
          {text || "."}
        </div>
      )}
    </>
  );
}

function Panel({
  mode,
  setMode,
  settingsOpen,
  setSettingsOpen,
}: {
  mode: Mode;
  setMode: Dispatch<StateUpdater<Mode>>;
  settingsOpen: boolean;
  setSettingsOpen: Dispatch<StateUpdater<boolean>>;
}) {
  const modeText = useMemo(() => getModeText(mode), [mode]);
  return (
    <div aria-label="Panel" className="reface--whiteboard-panel">
      <div
        aria-label="Mode button"
        className="reface--whiteboard-btn"
        onClick={() => setMode(fallbackMode)}
      >
        {modeText}
      </div>
      <div
        aria-label="Draw button"
        className={clsx("reface--whiteboard-btn", {
          "reface--whiteboard-btn-active": mode === "draw",
        })}
        onClick={() => setMode("draw")}
      >
        <div className="reface--whiteboard-dot reface--whiteboard-color" />
      </div>
      <div
        aria-label="Typing button"
        className={clsx("reface--whiteboard-btn", "reface--whiteboard-typing-btn", {
          "reface--whiteboard-btn-active": mode === "type",
        })}
        onClick={() => setMode("type")}
      >
        T
      </div>
      <div
        aria-label="Settings button"
        className={clsx("reface--whiteboard-btn", "reface--whiteboard-settings-btn", {
          "reface--whiteboard-btn-active": settingsOpen,
        })}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        <img src={chrome.runtime.getURL("images/icons/Settings3Line.svg")} />
      </div>
    </div>
  );
}

function Settings({
  color,
  setColor,
  thickness,
  setThickness,
  fontSize,
  setFontSize,
}: {
  mode: Mode;
  color: string;
  setColor: Dispatch<StateUpdater<string>>;
  thickness: number;
  setThickness: Dispatch<StateUpdater<number>>;
  fontSize: number;
  setFontSize: Dispatch<StateUpdater<number>>;
}) {
  return (
    <div aria-label="Settings" className="reface--whiteboard-settings">
      <div aria-label="Color picker">
        <input
          id="reface--whiteboard--color-picker"
          type="color"
          style={{ display: "none" }}
          value={color}
          onInput={(ev) => setColor(ev.currentTarget.value)}
        />
        <label
          htmlFor="reface--whiteboard--color-picker"
          className="reface--whiteboard-row"
          style={{ cursor: "pointer" }}
        >
          <p>Select color</p>
          <div className="reface--whiteboard-flex-center" style={{ width: 20, height: 20 }}>
            <div
              className="reface--whiteboard-dot reface--whiteboard-color"
              style={{ width: thickness, height: thickness }}
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
          onInput={(ev) => setThickness(parseFloat(ev.currentTarget.value))}
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
          onInput={(ev) => setFontSize(parseFloat(ev.currentTarget.value))}
        />
      </div>
    </div>
  );
}

// Create UI
const uiRoot = document.createElement("div");
uiRoot.classList.add("reface--whiteboard-ui");
document.body.appendChild(uiRoot);
render(<UI />, uiRoot);
