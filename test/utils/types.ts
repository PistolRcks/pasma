// Due to Typescript being bad at inferring types, we need to have 
// some type definitions for some commonly-used method signatures.
// This gets especially bad when mocking, and is some times necessary.
// Here are just a few. Feel free to add your own, 
// alongside a JSDoc describing which function it's supposed to be for.

import { Statement } from "sqlite3";
import { BinaryLike } from "crypto";

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * Type for `db.get`. 
 * 
 * Doesn't work *perfectly* well since the output is something we can't actually
 * match the `this` output.
 */
export type DBGetType = (
    sql: string, 
    callback?: (this: Statement, err: Error | null, row: any) => void
) => any;

/**
 * Type for `db.exec`. 
 * 
 * Seems to be identical in structure to the db.get call, maybe we can merge these?
 */
export type DBExecType = (
    sql: string, 
    callback?: (this: Statement, err: Error | null, row: any) => void
) => any;

/**
 * Type for `Crypto.pbkdf2Sync`.
 */
export type PBKDF2SyncType = (
    password: BinaryLike,
    salt: BinaryLike,
    iterations: number,
    keylen: number,
    digest: string
) => Buffer;
