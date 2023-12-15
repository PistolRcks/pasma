import { Database } from "sqlite3";
import crypto from "crypto";

// TODO: in the future, this might be read from a file
const STARTING_PHRASES = [
    "Oh brother, THIS GUY STINKS!!!",
    "The colonial minister's proclamation of \"No more pirates!\" is childish and outdated. Space piracy is good for the economy and you're an idiot if you think otherwise.",
    "Wow, that's interesting!",
    'insinuating that "twitter" (or "x" or whatever elon\'s calling it nowadays) is a good platform is like saying that you wished you were still in high school (if you don\'t understand this, then you\'re the problem)',
    'Evil Santa be like "Oh oh oh! Terrible Christmas!"',
    "I love this image. My friend's daughter's dog's former roommate made it.",
    "This image is garbage and you should delete your account NOW",
    "tomorrow. it's happening. yes, it's true.",
    "just got on pasma whhheeeyyyyyyy",
    "This looks like the last time I tripped in Tahiti. I'm not allowed there again.",
    "Patrolling the post feed almost makes you wish for a nuked database.",
    "I LOVE PASMA!!!! IT'S MY FAVORITE WEBSITE!!!! I'M NOT BEING FINANCIALLY INCENTIVIZED TO MAKE THIS POST!!!!",
    "// FIXME: add a post in here",
    "Impressive. Very nice. Let's see Paul Allen's comment.",
    "I would find this very humorous...if I was a lesser being. Unfortunately for you, I am not.",
    "error 403: automatic post was refused by server",
    "Picked this post up from the code yesterday. It's React. And the stylesheet is something called 'NextUI.'",
    "NextUI? More like CRAPUI",
    "This is really super. How'd a nitwit like you get so tasteful?",
    "can't even dark mode right smfh",
    "friend system when",
    "mods, snap his neck, thank you",
    "ban system when",
    "pasma team pls fix",
    "According to all known laws of programming, there is no way that PASMA should be able to run. Its test files are too small to get its fat little codebase off the ground. PASMA, of course, runs anyways. Because PASMA doesn't care what humans think is impossible.",
    "i don't want to get political, but i think we can all agree that starving to death is not a good thing. the attached image describes my stance in more detail",
    "at least pasma doesn't have a character limit",
    "i hope you STARVE!!!!!!!!!!1",
    "This post is a private post. To view this post, please insert exactly 0.0000324 BTC into your Bitcoin Allowance Port which came with your PASMA instruction manual.",
    "Ten years in the joint made you a [REDACTED]"
  ];

function createDBTables(dbFile: Database, callback: any) {
    // open database "db.sqlite". create if it does not exist
    const newDB = dbFile;

    // create tables for database if they do not exist.
    newDB.serialize(() => {
        newDB.run(`PRAGMA foreign_keys = ON;`);

        newDB.run(`CREATE TABLE if not exists "ProfilePictures" (
            Picture TEXT PRIMARY KEY
        );`);

        newDB.run(`CREATE TABLE if not exists "StockImages" (
            Picture TEXT PRIMARY KEY
        );`);

        newDB.run(`CREATE TABLE if not exists "PostPhrases" (
            Phrase TEXT PRIMARY KEY
        );`);

        newDB.run(`CREATE TABLE if not exists "Users" (
            Username TEXT PRIMARY KEY, 
            Password TEXT NOT NULL, 
            Salt BLOB, 
            ProfilePicture TEXT,
            UserType TEXT NOT NULL CHECK (UserType IN ('standard', 'brand', 'moderator')),
            FOREIGN KEY(ProfilePicture) REFERENCES ProfilePictures(Picture)
        );`);

        newDB.run(`CREATE TABLE if not exists "Posts" (
            ID TEXT PRIMARY KEY, 
            Username TEXT, 
            Content TEXT, 
            Picture TEXT, 
            Timestamp INTEGER,
            ParentID TEXT,
            CommentCount INTEGER NOT NULL DEFAULT 0,
            Private BOOLEAN,
            FOREIGN KEY(Content) REFERENCES PostPhrases(Phrase),
            FOREIGN KEY(Picture) REFERENCES StockImages(Picture),
            FOREIGN KEY(Username) REFERENCES Users(Username),
            FOREIGN KEY(ParentID) REFERENCES Posts(ID)
        );`);

        newDB.run(`CREATE TABLE if not exists "PostDislikes" (
            ID TEXT, 
            Username TEXT,
            Disliked INTEGER,
            PRIMARY KEY (ID, Username),
            FOREIGN KEY (ID) REFERENCES Posts(ID),
            FOREIGN KEY (Username) REFERENCES Users(Username)
        );`);

        newDB.run(`CREATE TABLE if not exists "PostDislikes" (
            ID TEXT, 
            Username TEXT,
            Disliked INTEGER,
            PRIMARY KEY (ID, Username),
            FOREIGN KEY (ID) REFERENCES Posts(ID),
            FOREIGN KEY (Username) REFERENCES Users(Username)
        );`);
        callback();
    });
}

export function fillDBTables(dbFile: Database, callback: any) {

    const newDB = dbFile;

    // insert stock images from the stock_image directory
    const fs = require("fs");
    const path = require("path");

    const stockImageDir = path.join(__dirname, "../public/pictures/stock_images");
    const stockImages = fs.readdirSync(stockImageDir);
    stockImages.forEach((file: any) => {
        newDB.serialize(() => {
            newDB.run(`INSERT OR IGNORE INTO StockImages(Picture)
                                VALUES(?);
                            `,
                [file]);
        });

    });

    const profilePicturesImageDir = path.join(__dirname, "../public/pictures/profile_pictures");
    const profileImages = fs.readdirSync(profilePicturesImageDir);
    profileImages.forEach((file: any) => {
        newDB.serialize(() => {
            newDB.run(`INSERT OR IGNORE INTO ProfilePictures(Picture)
                                VALUES(?);
                            `,
                [file.toString()]);
        });
    });


    // insert starter phrases
    for (let i = 0; i < STARTING_PHRASES.length; i++) {
        newDB.serialize(() => {
            newDB.run(`INSERT OR IGNORE INTO PostPhrases(Phrase) VALUES (?)`, [STARTING_PHRASES[i]]);
        });
    }

    callback();
}

/**
 * Initializes SQLite database from a file, and creates the Users and Posts tables
 * if they do not yet exist.
 * @param {string} dbFile relative path to SQLite database
 * @returns {Database} SQLite database
 */
export function initDB(dbFile: string): Database {
    const newDB = new Database(dbFile);

    createDBTables(newDB, () => {
        fillDBTables(newDB, () => {
            const salt: Buffer = crypto.randomBytes(16);
            const testPassword: Buffer = crypto.pbkdf2Sync("alice_password", salt, 1000, 64, "sha512");

            newDB.run(`INSERT OR IGNORE INTO Users(Username, Password, Salt, ProfilePicture, UserType)
                VALUES(?, ?, ?, ?, ?);
            `,
                ["alice", testPassword.toString("hex"), salt, "JaredD-2023.png", "standard"]);

        });
    });

    return newDB;
}

/**
 * The database.
 * @see database#initDB 
 */
export const db = initDB("./db.sqlite");
