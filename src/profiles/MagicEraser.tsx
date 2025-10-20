import type { Message } from "@/shared/types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { RiFocusLine, RiHand } from "react-icons/ri";
import browser from "webextension-polyfill";

export default function MagicEraser() {
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelectionMode = () => setSelectionMode((s) => !s);

  // Trigger selection mode on content (activeTab)
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    browser.runtime.sendMessage<Message>({
      from: "popup",
      to: "content",
      action: "magic_eraser_selection_mode",
      data: selectionMode,
    });
  }, [selectionMode]);

  return (
    <div className="px-4">
      <p className="opacity-50">
        To begin removing elements from the current tab, press the button below:
      </p>
      <button
        className={clsx(
          "text-btn group/icon my-4 w-full justify-center",
          selectionMode ? "btn-red" : "btn-primary",
        )}
        onClick={toggleSelectionMode}
      >
        {selectionMode ? "Stop Selection" : "Selection Mode"}
        {selectionMode ? (
          <RiHand className="icon-zoom" />
        ) : (
          <RiFocusLine className="icon-zoom" />
        )}
      </button>
      <p className="mt-8 opacity-50">Press "esc" to exist selection mode.</p>
      <p className="mt-4 opacity-25">
        You can always manage websites in config and choose to remember your
        settings for next time you visit this website or only apply changes this
        time.
      </p>
    </div>
  );
}
