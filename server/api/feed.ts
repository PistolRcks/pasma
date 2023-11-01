import { Request, Response } from "express";
import { db } from "../database";
import { sessions } from "../types/Session";

/**
 * Returns a list of the (default) top 100 most recent posts visible to the currently logged in user
 * @param {Request} req - Requests a JSON object in the body containing:
 *          - "token": valid user token
 *          - "size": the maximum amount of most recent posts to read (optional, default 100)
 *          - "bookmark": the post ID of the last post in the previous page (-1 if grabbing the first page; x
 *              optional, unimplemented)
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with a JSON array of the most recent posts containing each:
 *          - "id": the post ID of the post
 *          - "user": the username of the user who created the post
 *          - "picture": the filename of the image attached to the post, if any
 *          - "content": the text content of the post, if any
 *          - "dislikes": number of dislikes on the post
 *          - "comments": number of comments on the post (unimplemented; will work on that later)
 *      Eventually, we will also have the idea of private posts which will not send to users who are not
 *      friends of that user.
 */
export function feed(req: Request, res: Response) {
    if (typeof req.body === "object") {
        // ensure valid request 
        if (!("token" in req.body)) {
            res.status(400).send("Error: \"token\" not in request JSON.");
            return;
        }
        
        // ensure logged in
        if (!sessions.has(req.body.token)) {
            // invalid user token
            console.log("[API] Feed get failed! (invalid token provided)");
            res.status(401).send("Invalid token provided!");
            return;
        }
        
        let size = 100;
        if ("size" in req.body) {
            if (typeof req.body.size !== "number") {
                res.status(400).send("Error: \"size\" is not of type \"number\" in request JSON.");
                return;
            } else {
                size = req.body.size;
            }
        }
        
        // get posts
        /** 
         * WHAT IS A POST? Nothing but a miserable little pile of:
         * id: post ID
         * user: user that created the post
         * picture: the filename of the image attached to the post, if any
         * content: contents of the message, if any
         * dislikes: number of dislikes on the post
         * comments: number of comments on the post (unimplemented; will work on that later)
        */
        db.all(`
            SELECT 
                p.ID as id, 
                p.Username as user, 
                p.Timestamp as timestamp,
                p.Picture as picture, 
                p.Content as content,
                (
                    SELECT count(*)
                    FROM PostDislikes pd
                    WHERE 
                        pd.ID = p.ID AND
                        pd.Disliked = true
                ) as dislikes
            FROM Posts p
            ORDER BY 
                timestamp DESC,
                id DESC
            LIMIT ${size};
        `, function (err, rows) {
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            } 
            
            res.status(200).send(rows);
        })
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}
