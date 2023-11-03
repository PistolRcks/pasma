import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";

let firstPost: boolean = true;
let postID: number;

/**
 * Reacts to a post.
 * @param {Request} req Requires a JSON body which includes an 'id' and 'token' field.
 * @param {Response} res Response to request (200 if success, 400 if post does not exist, and 500 if failed for other reason)
 */
export function react(req: Request, res: Response) {
    if ("id" in req.body && "token" in req.body) {
        // make sure we have a valid token (one that finds us a valid user)
        if (sessions.has(req.body.token)) {
            const username = sessions.get(req.body.token).username;

            // first, lets make sure the post exists
            db.get(`SELECT * FROM Posts WHERE ID=?`, [req.body.id], function (err: Error, row: any) {
                // error running query
                if (err) {
                    console.log("[SQL] Error: " + err);
                    res.status(500).send("Database error!");
                    return;
                }

                // if no post is found
                if (!row) {
                    console.log('[API] React request failed! (invalid post ID)');
                    res.status(400).send("Invalid post ID!");
                    return;
                }

                // otherwise, dislike or remove the dislike, depending on it's previous state.
                db.run(`INSERT INTO PostDislikes VALUES (?, ?, 1) ON CONFLICT(ID, Username) DO UPDATE SET Disliked = NOT Disliked`, [req.body.id, username], function (err: Error) {
                    if (err) {
                        console.log("[SQL] Error: " + err);
                        res.status(500).send("Database error!");
                        return;
                    }
                    // successfully disliked or removed dislike from a post
                    console.log("[API] " + username + " toggled dislike on post " + req.body.id);
                    res.status(200).send("OK");
                });
            });
        } else {
            // invalid user token
            console.log("[API] Dislike request failed! (invalid token provided)");
            res.status(500).send("Invalid token provided!");
            return;
        }
    } else {
        // invalid request data
        console.log('[API] Dislike request failed! (invalid dislike request)');
        res.status(500).send("Invalid dislike request!");
        return;
    }
}
