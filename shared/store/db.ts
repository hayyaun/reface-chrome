import Dexie, { type EntityTable, type Table } from "dexie";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { MagicEraserDBItem } from "../types";

const db = new Dexie("SharedDatabase") as Dexie & {
  samantha: EntityTable<ChatCompletionMessageParam, never>;
  magic_eraser: EntityTable<MagicEraserDBItem, "hostname">;
};

/**
 * @NOTICE until we have no users, we can use v1,
 * after some users installed the extension, we will need migration plans
 */

db.version(1).stores({
  samantha: "++id, role",
  magic_eraser: "hostname",
});

export default db;

type DB = Record<string, unknown[]>; // Tables

export async function exportDatabase(): Promise<DB> {
  const exportData: DB = {};
  for (const table of db.tables) {
    exportData[table.name] = await table.toArray();
  }
  return exportData;
}

export async function importDatabase(tables: DB): Promise<void> {
  await db.transaction("rw", db.tables, async () => {
    for (const tableName in tables) {
      const table = db.table(tableName) as Table<unknown, unknown>;
      await table.clear(); // optional, clears existing data
      await table.bulkAdd(tables[tableName]);
    }
  });
}
