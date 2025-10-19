import Dexie, { type EntityTable } from "dexie";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const db = new Dexie("SharedDatabase") as Dexie & {
  openai: EntityTable<ChatCompletionMessageParam, never>;
};

// Schema declaration:
db.version(1).stores({
  openai: "++id, role", // indexed keys
});

export default db;
