import clsx from "clsx";
import type OpenAI from "openai";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import Markdown from "react-markdown";
import Chips from "../components/Chips";
import type { Message } from "../types";

const hints = [
  "Summerize page content",
  "Gather all external links",
  "Close all wikipedia tabs",
];

export default function Samantha() {
  const [message, set] = useState("");
  const [thinking, setThinking] = useState<{
    iter: number;
    content: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  >([]);

  // answer
  useEffect(() => {
    if (import.meta.env.DEV) return;
    async function listener(msg: Message) {
      if (msg.to !== "popup") return;
      if (msg.action !== "openai_answer") return;
      setMessages((s) => [
        ...s,
        { role: "assistant", content: msg.data as string },
      ]);
      setThinking(null);
    }
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  // thinking
  useEffect(() => {
    if (import.meta.env.DEV) return;
    async function listener(msg: Message) {
      if (msg.to !== "popup") return;
      if (msg.action !== "openai_thinking") return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setThinking(msg.data as any);
    }
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  // send message
  const ask: FormEventHandler = async (ev) => {
    ev.preventDefault();
    if (import.meta.env.DEV) return;
    if (!message.length) return;
    setThinking({ iter: 0, content: "Deep thinking..." });
    const newMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      ...messages,
      { role: "user", content: message },
    ];
    await chrome.runtime.sendMessage<Message>({
      from: "popup",
      to: "background",
      action: "openai_ask",
      data: newMessages,
    });
    setMessages(newMessages);
    set("");
  };

  const scrollbox = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    scrollbox.current.scrollTo({
      top: scrollbox.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div
        ref={scrollbox}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8"
      >
        {messages
          .filter((v) => v.role !== "system")
          .map(({ role, content }, i) => (
            <div
              key={i}
              className={clsx(
                "max-w-4/5 rounded-md p-3 px-4 leading-[150%] break-words whitespace-pre-line select-text",
                role === "assistant"
                  ? "self-start bg-red-200/5"
                  : "self-end bg-blue-200/5",
              )}
            >
              <Markdown>{content?.toString()}</Markdown>
              {/* {content?.toString()} */}
            </div>
          ))}
        {thinking && (
          <div
            className={clsx(
              "max-w-4/5 rounded-md p-3 px-4 leading-[150%]",
              "self-start bg-red-200/5",
            )}
          >
            {thinking.content} {thinking.iter ? `(${thinking.iter})` : ""}
          </div>
        )}
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
      <form className="flex shrink-0 grow-0 gap-2 p-4 pt-2" onSubmit={ask}>
        <input
          aria-label="Text Input"
          className="flex-1 rounded-md bg-white/5 p-1.5 px-2"
          placeholder="How can I help you?"
          value={message}
          onChange={(ev) => set(ev.target.value)}
        />
        <button
          className="btn-primary group shrink-0 rounded-lg p-1.5"
          type="submit"
        >
          <RiSendPlaneFill className="size-4 transition group-hover:scale-105 group-active:scale-95" />
        </button>
      </form>
    </div>
  );
}
