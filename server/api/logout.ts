import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";

export function logout(req: Request, res: Response) {
    if ("token" in req.body) {

        // we use this enough in the code that this is justifiable
        const token = req.body.token;

        /* because in keyword returns true even if value for field is empty, we need an 
        additional check to make sure it is not empty. we will assume that empty means
        not logged in, while token not existing in the sessions map means invalid token */
        if (!token) {
            console.log('[API] Logout request failed! (not logged in)');
            res.status(400).send("Not logged in!");
            return;
        }

        if (sessions.has(token)) {
            const username = sessions.get(token).username;
            if (sessions.delete(token)) {
                console.log('[API] Logged out user ' + username);
                res.status(200).send("OK");
                return;
            } else {
                console.log('[NJS] Logout request failed! (failed to delete session)');
                res.status(500).send("Error removing session!");
                return;
            }
        } else {
            console.log('[API] Logout request failed! (invalid token provided)');
            res.status(500).send("Invalid token provided!");
            return;
        }
    } else {
        console.log('[API] Logout request failed! (invalid request)');
        res.status(500).send("Invalid logout request!");
        return;
    }
}
