import { Database } from "sqlite3";
import crypto from "crypto";

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
 * @returns {boolean} Is x a User object?
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
    const newDB = new Database(dbFile);

    // create tables for database if they do not exist.
    newDB.serialize(() => {
        newDB.run(`CREATE TABLE if not exists "Users" (
            Username TEXT PRIMARY KEY, 
            Password TEXT NOT NULL, 
            Salt BLOB, 
            ProfilePicture TEXT
        );`);

        newDB.run(`CREATE TABLE if not exists "Posts" (
            ID TEXT PRIMARY KEY, 
            Username TEXT, 
            Content TEXT, 
            Picture TEXT, 
            Timestamp INTEGER, 
            FOREIGN KEY(Username) REFERENCES Users(Username)
        );`);
        
        // insert test user (for now)
        let salt: Buffer = crypto.randomBytes(16);
        let testPassword: Buffer = crypto.pbkdf2Sync("alice_password", salt, 1000, 64, "sha512"); 
        
        // In a testing environment, testPassword will be undefined...
        // ...unless you console.log it (and then it will become undefined after the fact...)
        if (testPassword) {
            newDB.run(`INSERT OR IGNORE INTO Users(Username, Password, Salt)
                VALUES(?, ?, ?);
            `, 
            ["alice", testPassword.toString("hex"), salt]);
        }
    });

    return newDB;
}

/**
 * The database.
 * @see database#initDB 
 */
export const db = initDB("./db.sqlite");
