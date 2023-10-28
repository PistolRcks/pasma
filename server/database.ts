import { Database } from "sqlite3";
import crypto from "crypto";

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
            ProfilePicture TEXT,
            UserType TEXT NOT NULL CHECK (UserType IN ('standard', 'brand', 'moderator'))
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
        const salt: Buffer = crypto.randomBytes(16);
        const testPassword: Buffer = crypto.pbkdf2Sync("alice_password", salt, 1000, 64, "sha512"); 
        
        newDB.run(`INSERT OR IGNORE INTO Users(Username, Password, Salt, UserType)
            VALUES(?, ?, ?, ?);
        `, 
        ["alice", testPassword.toString("hex"), salt, "standard"]);
    });

    return newDB;
}

/**
 * The database.
 * @see database#initDB 
 */
export const db = initDB("./db.sqlite");
