// This file handles session token handling caused by logins. Also handles logins.

import Database from "bun:sqlite";
import { BunRequest } from "bunrest/src/server/request";
import { BunResponse } from "bunrest/src/server/response";
import { addSession } from "../types/Session";

// FIXME: Use actual DB and that kinda stuff later
const db = new Database(":memory:");

interface User {
    username: string,
    password: string
}

function isUser(x: any): x is User {
    return "username" in x && "password" in x;
}

/**
 * Given a JSON input (via request),
 * Returns token and stores token
 */
export async function login(req: BunRequest, res: BunResponse) {
    if (typeof req.body === "object") {
        // Is input malformed?
        if (!("username" in req.body && "password" in req.body)) {
            res.status(400).send("Error: \"username\" and/or \"password\" not in request JSON.");
            return;
        }

        // Does username exist?
        const stmt = db.query("select * from Users where username = ?");
        const user = stmt.get(req.body.username);

        if (typeof user === "undefined") {
            res.status(401).send(`Error: Username or password does not exist.`);
            return;
        // Need to narrow here or else we are not able to use the result we got
        } else if (user !== null && isUser(user)) {
            // Verify (assuming sent password is plaintext)
            if (await Bun.password.verify(req.body.password, user.password)) {
                const token = addSession({ username : user.username });
                res.status(200).send(token);
                return;
            } else {
                res.status(401).send(`Error: Username or password does not exist.`);
                return;            
            }            
        }
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}

