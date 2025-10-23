import Dexie, { type EntityTable } from "dexie";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { MagicEraserDBItem } from "../types";

const db = new Dexie("SharedDatabase") as Dexie & {
  openai: EntityTable<ChatCompletionMessageParam, never>;
  magic_eraser: EntityTable<MagicEraserDBItem, "hostname">;
};

/**
 * @NOTICE until we have no users, we can use v1,
 * after some users installed the extension, we will need migration plans
 */

db.version(1).stores({
  openai: "++id, role",
  magic_eraser: "hostname",
});

export default db;
