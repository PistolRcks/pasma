import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { getDB } from "../../server/database.ts";

const testingDB = getDB();

// first, check to make sure our Database is in fact a database.
test("Checking database type", () => {
    expect(testingDB instanceof Database).toBe(true);
});

/* then, list out the tables. make sure we have the Users and Posts tables, since they should be
   created by getDB() */
test("Checking database structure", () => {
    let testQuery = testingDB.query("SELECT name FROM sqlite_master WHERE type='table';").values();
    expect(testQuery).toEqual([["Users"],["Posts"]]);
});
