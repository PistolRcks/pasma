// Due to Typescript being bad at inferring types, we need to have 
// some type definitions for some commonly-used method signatures.
// This gets especially bad when mocking, and is some times necessary.
// Here are just a few. Feel free to add your own, 
// alongside a JSDoc describing which function it's supposed to be for.

import { RunResult, Statement } from "sqlite3";
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
 * Type for `db.get` (with additional parameters). 
 * 
 */
export type DBGetTypeWithParams = (
    sql: string,
    params: any,
    callback?: (this: Statement, err: Error | null, row: any) => void
) => any;

/**
 * Type for `db.run`, with `params` and `callback` variable. 
 * 
 * While identical in structure, we are keeping distinguished types for each database function.
 */
export type DBRunTypeWithCallback = (
    sql: string, 
    params: any,
    callback?: (this: RunResult, err: Error | null) => void
) => any;

/**
 * Type for `db.all`, with `params`. 
 */
export type DBAllTypeWithParams = (
    sql: string,
    params: any, 
    callback?: (this: RunResult, err: Error | null, rows: any[]) => void
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
