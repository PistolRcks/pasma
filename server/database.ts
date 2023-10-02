// import sqlite from bun
import { Database } from "bun:sqlite";

// user table
export interface User {
    Username: string;
    Password: string;
    Salt: string;
    ProfilePicture: Blob;
}

// post table
export interface Post {
    Username: string;
    Content: string;
    Picture: Blob;
    Timestamp: number;
}

// typeguard for user
export function isUser(x: any): x is User {
    return "Username" in x && "Password" in x && "Salt" in x && "ProfilePicture" in x;
}

// typeguard for post
export function isPost(x: any): x is Post {
    return "Username" in x && "Content" in x && "Picture" in x && "Timestamp" in x;
}

// EXAMPLE IMPORT:
// import { getDB } from "./database.ts"
// const db = getDB();

export function getDB(): Database {
    // open database "db.sqlite". create if it does not exist
    const db = new Database("server/db.sqlite");

    // create tables for database if they do not exist.
    db.query(`CREATE TABLE if not exists "Users" (Username TEXT, Password TEXT, Salt TEXT, ProfilePicture BLOB);`).run();
    db.query(`CREATE TABLE if not exists "Posts" (Username TEXT, Content TEXT, Picture BLOB, Timestamp INTEGER);`).run();

    // return database with tables
    return db;
}
