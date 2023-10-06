// This file handles session token handling caused by logins. Also handles logins.

import crypto from "crypto";
import { addSession } from "../types/Session";
import { Request, Response } from "express";
import { isUser } from "../database"
import { db } from "../main"

/**
 * Logs in a user and stores the state, given that the username and password are correct.
 * @param {Request} req - Requests a JSON object in the body 
 *      containing "username" and "password" fields.
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with the newly generated session token in the case of
 *      a success.
 */
export async function login(req: Request, res: Response) {
    if (typeof req.body === "object") {
        // Is input malformed?
        if (!("username" in req.body && "password" in req.body)) {
            res.status(400).send("Error: \"username\" and/or \"password\" not in request JSON.");
            return;
        }

        // Does username exist?
        const stmt = db.prepare("select * from Users where username = ?");
        const user = stmt.get(req.body.username);

        if (typeof user === "undefined" || user === null) {
            res.status(401).send("Error: Username or password does not exist.");
            return;
        // Need to narrow here or else we are not able to use the result we got
        } else if (isUser(user)) {
            // Verify (assuming sent password is plaintext)
            const inputHash = crypto.pbkdf2Sync(req.body.password, user.Salt, 1000, 64, "sha512").toString('hex'); 
            if (user.Password === inputHash) {
                const token = addSession({ username : user.Username });
                res.status(200).send(token);
                return;
            } else {
                res.status(401).send("Error: Username or password does not exist.");
                return;            
            }            
        }
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}

