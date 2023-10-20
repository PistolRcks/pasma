// This file handles signing a user up to the website, as well as password validation.

import { db } from "../database";
import { addSession } from "../types/Session";
import { Request, Response } from "express";
import crypto from "crypto";

/**
 * Signs up a user and stores the state, given a unique username and valid password. 
 * @param {Request} req - Requests a JSON object in the body containing 
 *      "username" and "password" fields.
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with the newly generated session token in the case of
 *      a success.
 */
export function register(req: Request, res: Response) {
    if (typeof req.body === "object") {
        // Is input malformed?
        if (!("username" in req.body && "password" in req.body)) {
            res.status(400).send("Error: \"username\" and/or \"password\" not in request JSON.");
            return;
        }
        
        // Is the password good?
        if (!verifyPassword(req.body.password)) {
            res.status(400).send("Error: Password is insecure. It must have at least 12 characters, one digit, and one special character.");
            return;
        }

        // Is the username already taken?
        db.get(`select * from Users where Username = ${req.body.username}`, function (err, row) {
            if (err) {
                res.status(500).send(`Server Error: ${err}`);
                return;
            }
            
            // Username is already taken if we can find it (i.e. it is nonnull)
            if (row) {
                res.status(400).send("Error: Username was already taken.");
                return;
            }
            
            // Create new user
            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512"); 

            db.run(`INSERT OR IGNORE INTO Users(Username, Password, Salt)
                VALUES(?, ?, ?);
            `, 
            [req.body.username, hashedPassword.toString("hex"), salt]);
            
            // Log the new user in
            const token = addSession({ username: req.body.username });
            res.status(200).send(token);
        });
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}

/**
 * Returns whether or not the given password is valid.
 * @param {string} password - The password to check 
 * @return {boolean} Whether or not the password contains all of the following:
 *      - The password length is at least 12
 *      - The password contains at least one digit
 *      - The password contains at least one special character
 *        (one of: !@#$%^&*()_+-=[]{};':"\|,.<>/?)
 */
function verifyPassword(password: string): boolean {
    return (
        password.length > 12 &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    );
}
