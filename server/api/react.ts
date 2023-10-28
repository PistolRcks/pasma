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
            db.get(`SELECT * FROM Posts WHERE ID=?`, [req.body.id], function (err: Error, postRow: any) {
                // error running query
                if (err) {
                    console.log("[SQL] Error: " + err);
                    res.status(500).send("Database error!");
                    return;
                }

                // if no post is found
                if (!postRow || !postRow.test_validpost) {
                    console.log('[API] Edit request failed! (invalid post ID)');
                    res.status(400).send("Invalid post ID!");
                    return;
                }

                // then, check if we have already disliked this post (we want to remove the dislike if that is the case)
                db.get(`SELECT * FROM PostDislikes WHERE ID=? AND Username=?`, [req.body.id, username], function (err: Error, dislikeRow: any) {
                    if (err) {
                        console.log("[SQL] Error: " + err);
                        res.status(500).send("Database error!");
                        return;
                    }
                    if (!dislikeRow || !dislikeRow.test_disliked) {
                        // no dislike yet, we can dislike this post
                        db.run(`INSERT INTO PostDislikes VALUES (?, ?)`, [req.body.id, username], function (err: Error) {
                            if (err) {
                                console.log("[SQL] Error: " + err);
                                res.status(500).send("Database error!");
                                return;
                            }
                            // successfully disliked post
                            console.log("[API] " + username + " disliked post " + req.body.id);
                            res.status(200).send();
                        });
                        return;
                    }
                    // post already disliked! remove dislike from the post
                    db.run(`DELETE FROM PostDislikes WHERE ID=? AND Username=?`, [req.body.id, username], function (err: Error) {
                        if (err) {
                            console.log("[SQL] Error: " + err);
                            res.status(500).send("Database error!");
                            return;
                        }
                        // successfully removed dislike from post
                        console.log("[API] " + username + " removed dislike from post " + req.body.id);
                        res.status(200).send();
                    });
                    return;
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
