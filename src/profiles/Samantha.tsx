import clsx from "clsx";
import { useEffect, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import Chips from "../components/Chips";
import type { Message } from "../types";

const hints = [
  "Summerize page content",
  "Gather all wikipedia links",
  "Apply dark theme",
];

export default function Samantha() {
  const [message, set] = useState("");
  const [messages, setMessages] = useState<
    { content: string; sender: "bot" | "user" }[]
  >([]);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    async function listener(msg: Message) {
      if (msg.to !== "popup") return;
      if (msg.action !== "openai_answer") return;
      setMessages((s) => [
        ...s,
        { content: msg.data as string, sender: "bot" },
      ]);
    }
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const ask = async () => {
    const result = await chrome.runtime.sendMessage<Message>({
      from: "popup",
      to: "background",
      action: "openai_ask",
      data: message,
    });
    console.log({ result });
    setMessages((s) => [...s, { content: message, sender: "user" }]);
  };

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8">
        {messages.map(({ sender, content }, i) => (
          <div
            key={i}
            className={clsx(
              "max-w-4/5 rounded-md p-3 leading-[150%]",
              sender === "bot"
                ? "self-start bg-red-200/5"
                : "self-end bg-blue-200/5",
            )}
          >
            {content}
          </div>
        ))}
        {!messages.length && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <p className="mb-2 opacity-45">Get started by trying these:</p>
            {hints.map((hint, i) => (
              <Chips
                key={i}
                active={false}
                title={hint}
                onClick={() => set(hint)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 grow-0 gap-2 p-4">
        <input
          aria-label="Text Input"
          className="flex-1 rounded-md bg-white/5 p-1.5 px-2"
          placeholder="Ask Samantha to do something on this page..."
          value={message}
          onChange={(ev) => set(ev.target.value)}
        />
        <button
          className="btn-primary group shrink-0 rounded-lg p-1.5"
          onClick={ask}
        >
          <RiSendPlaneFill className="size-5 transition group-hover:scale-105 group-active:scale-95" />
        </button>
      </div>
    </div>
  );
}
