import type { Message } from "@/shared/types";

export function isMessage(msg: unknown): msg is Message {
  return (
    typeof msg === "object" && msg !== null && "to" in msg && "action" in msg
  );
}
