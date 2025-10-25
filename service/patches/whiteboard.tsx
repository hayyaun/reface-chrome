/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import clsx from "clsx";
import { render } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

const config = window.__rc_config["whiteboard"];
const scale = (config["scale"] ?? 0.5) as number;
const _fontFamily = (config["font-family"] ?? "Roboto") as string;

const canvasSize = [document.body.scrollWidth, document.body.scrollHeight];

// TODO add undo/redo at least for 1 step

type Mode = "draw" | "type" | "settings" | "work";

const fallbackMode: Mode = "work";

const getModeText = (mode: Mode) => {
  if (mode === "draw") return "Draw mode";
  if (mode === "type") return "Type mode";
  if (mode === "settings") return "Settings";
  return "Normal";
};

type Pos = [x: number, y: number];

function UI() {
  const [color, setColor] = useState("#ff0000");
  const [mode, setMode] = useState(fallbackMode);
  const [thickness] = useState(5 * scale);
  const [fontFamily] = useState(_fontFamily);
  const [fontSize] = useState(48);
  const [pos, setPosition] = useState<Pos | null>(null);
  const [text, setText] = useState("");

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
      ctx.current.lineWidth = thickness; // TODO update
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
  }, [color, mode, thickness, scale]);

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
  }, [mode, pos, color, fontFamily, fontSize, scale]);

  const modeText = useMemo(() => getModeText(mode), [mode]);

  return (
    <div aria-label="UI" className="reface--whiteboard-ui">
      <canvas
        ref={_canvas}
        width={canvasSize[0] * scale}
        height={canvasSize[1] * scale}
        style={{
          height: `${canvasSize[1]}px`,
          pointerEvents: mode === "work" ? "none" : "all",
        }}
        className="reface--whiteboard-canvas"
      />

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
          <div className="reface--whiteboard-picker reface--whiteboard-color" />
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
            "reface--whiteboard-btn-active": mode === "settings",
          })}
          onClick={() => setMode("settings")}
        >
          <img src={chrome.runtime.getURL("images/icons/Settings3Line.svg")} />
        </div>
      </div>

      <div
        aria-label="Settings"
        className={clsx("reface--whiteboard-settings", {
          "reface--whiteboard-hidden": mode !== "settings",
        })}
      >
        <label
          htmlFor="reface--whiteboard-color-picker"
          className="reface--whiteboard-picker reface--whiteboard-color"
        >
          <input
            id="reface--whiteboard-color-picker"
            type="color"
            style={{ display: "none" }}
            value={color}
            onInput={(e) => setColor(e.currentTarget.value)}
          />
        </label>
      </div>

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
    </div>
  );
}

// Create UI
const uiRoot = document.createElement("div");
document.body.appendChild(uiRoot);
render(<UI />, uiRoot);
