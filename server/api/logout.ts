import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";

export function logout(req: Request, res: Response) {
    if ("token" in req.body) {

        // we use this enough in the code that this is justifiable
        const token = req.body.token;

        if (sessions.has(token)) {
            const username = sessions.get(token).username;
            if (sessions.delete(token)) {
                console.log('[API] Logged out user ' + username);
                res.status(200).send("OK");
                return;
            } else {
                console.log('[NJS] Logout request failed! (failed to delete session)');
                res.status(500).send("Error: Server couldn't remove session!");
                return;
            }
        } else {
            console.log('[API] Logout request failed! (not logged in)');
            res.status(400).send("Error: Not logged in!");
            return;
        }
    } else {
        console.log('[API] Logout request failed! (invalid request)');
        res.status(500).send("Error: Invalid logout request!");
        return;
    }
}
