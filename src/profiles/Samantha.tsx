import api from "@/shared/api";
import db from "@/shared/store/db";
import type { Message, SamanthaThinkingMessageData } from "@/shared/types";
import clsx from "clsx";
import { useLiveQuery } from "dexie-react-hooks";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { memo, useCallback, useEffect, useRef, useState, type FormEventHandler } from "react";
import { RiDeleteBinFill, RiSendPlaneFill } from "react-icons/ri";
import Markdown from "react-markdown";
import Chips from "../components/Chips";

const hints = [
  "Summerize page content",
  "Close all wikipedia tabs",
  "Open 5 first links in new tab",
  "Organize my bookmarks",
];

export default function Samantha() {
  const messages = useLiveQuery(() => db.samantha.toArray());
  const clear = useCallback(() => db.samantha.clear(), []);

  const [message, set] = useState("");
  const [thinking, setThinking] = useState<SamanthaThinkingMessageData>(null);

  // thinking
  useEffect(() => {
    if (import.meta.env.DEV) return;
    async function listener(msg: Message) {
      if (msg.to !== "popup" || msg.action !== "samantha_thinking") return null;
      setThinking(msg.data);
    }
    api.runtime.onMessage.addListener(listener);
    return () => {
      api.runtime.onMessage.removeListener(listener);
    };
  }, []);

  // send message
  const ask: FormEventHandler = async (ev) => {
    ev.preventDefault();
    if (!messages) return;
    if (import.meta.env.DEV) return;
    if (!message.length) return;
    if (thinking) return;
    setThinking({ iter: 0, content: "Processing..." });
    const newMessage: ChatCompletionMessageParam = {
      role: "user",
      content: message,
    };
    const data = [...messages, newMessage];
    await db.samantha.add(newMessage);
    await api.runtime.sendMessage({
      to: "background",
      action: "samantha_ask",
      data,
    });
    set("");
  };

  // ui
  const scrollbox = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    scrollbox.current.scrollTo({
      top: scrollbox.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages?.length, thinking]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        ref={scrollbox}
        className="relative flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8"
      >
        {messages
          ?.filter((v) => v.role !== "system")
          .map((msg, i) => (
            <MessageBubble key={i} {...msg} />
          ))}
        {thinking && (
          <div
            className={clsx(
              "max-w-4/5 animate-pulse rounded-md p-3 px-4 leading-[150%]",
              "self-start bg-red-200/5",
            )}
          >
            {thinking.content} {thinking.iter ? `(${thinking.iter})` : ""}
          </div>
        )}
        {!messages?.length && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <p className="mb-2 opacity-45">Get started by trying these:</p>
            {hints.map((hint, i) => (
              <Chips key={i} active={false} title={hint} onClick={() => set(hint)} />
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
          disabled={!!thinking}
        />
        <button className="btn-primary icon-btn group/icon" type="submit">
          <RiSendPlaneFill className="icon-zoom" />
        </button>
      </form>

      {!!messages?.length && (
        <button
          aria-label="Clear button"
          className="icon-btn btn-red group/icon absolute top-0 left-4"
          onClick={clear}
        >
          <RiDeleteBinFill className="icon-zoom" />
        </button>
      )}
    </div>
  );
}

const MessageBubble = memo(({ role, content }: ChatCompletionMessageParam) => (
  <div
    className={clsx(
      "max-w-4/5 rounded-md p-3 px-4 leading-[150%] break-words whitespace-pre-line select-text",
      role === "assistant" ? "self-start bg-red-200/5" : "self-end bg-blue-200/5",
    )}
  >
    <Markdown>{content?.toString()}</Markdown>
  </div>
));
