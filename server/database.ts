// import sqlite from bun
import { Database } from "bun:sqlite";

// EXAMPLE IMPORT:
// import { getDB } from "./database.ts"
// const db = getDB();

export function getDB(): Database {
    // open database "db.sqlite". create if it does not exist
    const db = new Database("server/db.sqlite");

    // create tables for database if they do not exist
    db.query(`CREATE TABLE if not exists "Users" (Username TEXT, Password TEXT, Salt TEXT, ProfilePicture BLOB);`).run();
    db.query(`CREATE TABLE if not exists "Posts" (Username TEXT, Content TEXT, Picture BLOB, Timestamp INTEGER);`).run();

    // return database with tables
    return db;
}