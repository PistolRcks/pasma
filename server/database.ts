import { Database } from "sqlite3";
import crypto from "crypto";

// Lorem ipsum for dummytext
const LIPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porttitor sagittis neque sed gravida. Nullam porta tristique maximus. 
Nulla in mi eu magna cursus pellentesque ac at lectus. Phasellus euismod pulvinar faucibus. Quisque felis enim, feugiat eget est eget, aliquam fringilla magna. 
In viverra, leo nec ornare luctus, ligula risus aliquet nibh, nec porttitor ligula metus vel risus. Sed ut massa ut lorem viverra laoreet at ac est. 
Sed et felis fermentum, efficitur est eget, dapibus lacus. Etiam tempor gravida dictum. In ullamcorper tortor non cursus hendrerit. 
Donec at ultrices tellus, at pharetra neque. Nulla commodo nunc non gravida auctor. Mauris ac tortor mauris. Nullam euismod at nunc eu iaculis. 
Vestibulum venenatis tellus pharetra maximus gravida. Etiam fermentum maximus ante et semper. Nullam sed consequat justo. Vivamus dignissim purus vel suscipit scelerisque. 
Nullam ultricies, ante at aliquet porttitor, eros lectus interdum neque, a sollicitudin leo massa et leo. Ut nec lorem quis massa sodales pellentesque. 
Nulla risus quam, finibus vitae venenatis eu, scelerisque ut quam.`;

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
            Private BOOLEAN,
            FOREIGN KEY(Username) REFERENCES Users(Username)
        );`);

        newDB.run(`CREATE TABLE if not exists "PostDislikes" (
            ID TEXT, 
            Username TEXT,
            Disliked INTEGER,
            PRIMARY KEY (ID, Username),
            FOREIGN KEY (ID) REFERENCES Posts(ID),
            FOREIGN KEY (Username) REFERENCES Users(Username)
        );`);
        
        // insert test user (for now)
        const salt: Buffer = crypto.randomBytes(16);
        const testPassword: Buffer = crypto.pbkdf2Sync("alice_password", salt, 1000, 64, "sha512"); 
        
        newDB.run(`INSERT OR IGNORE INTO Users(Username, Password, Salt, ProfilePicture, UserType)
            VALUES(?, ?, ?, ?, ?);
        `, 
        ["alice", testPassword.toString("hex"), salt, "standard"]);
        

        // Generate random posts based on lorem ipsum text
        const lipsum_sublength = Math.floor(LIPSUM.length / 10);
        for (let i = 0; i < 10; i++) {
            newDB.run(`INSERT OR IGNORE INTO Posts(ID, Username, Content, Picture, Timestamp, Private)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [
                i, 
                "alice", 
                LIPSUM.slice(i * lipsum_sublength, (i + 1) * lipsum_sublength), 
                null, 
                Date.now(),
                false
            ]);
        }
    });

    return newDB;
}

/**
 * The database.
 * @see database#initDB 
 */
export const db = initDB("./db.sqlite");
