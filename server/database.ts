import { Database } from "bun:sqlite";

export interface User {
    Username: string;
    Password: string;
    Salt: string;
    ProfilePicture: Blob;
}

export interface Post {
    Username: string;
    Content: string;
    Picture: Blob;
    Timestamp: number;
}

/**
 * Type guard for a User object
 * @param {User} x User object to check
 * @returns {boolean} Is x a Uost object?
 */
export function isUser(x: any): x is User {
    return "Username" in x && "Password" in x && "Salt" in x && "ProfilePicture" in x;
}

/**
 * Type guard for a Post object
 * @param {Post} x Post object to check
 * @returns {boolean} Is x a Post object?
 */
export function isPost(x: any): x is Post {
    return "Username" in x && "Content" in x && "Picture" in x && "Timestamp" in x;
}

/**
 * Initializes SQLite database from a file, and creates the Users and Posts tables
 * if they do not yet exist.
 * @param {string} dbFile relative path to SQLite database
 * @returns {Database} SQLite database
 */
export function initDB(dbFile: string): Database {
    // open database "db.sqlite". create if it does not exist
    const db = new Database(dbFile);

    // create tables for database if they do not exist.
    db.query(`CREATE TABLE if not exists "Users" (Username TEXT PRIMARY KEY, Password TEXT NOT NULL, Salt TEXT, ProfilePicture BLOB);`).run();
    db.query(`CREATE TABLE if not exists "Posts" (ID TEXT PRIMARY KEY, Username TEXT, Content TEXT, Picture BLOB, Timestamp INTEGER, FOREIGN KEY(Username) REFERENCES Users(Username));`).run();

    return db;
}
