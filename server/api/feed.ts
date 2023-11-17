import { Request, Response } from "express";
import { db } from "../database";
import { sessions } from "../types/Session";

/**
 * Returns a list of the (default) top 100 most recent posts visible to the currently logged in user
 * @param {Request} req - Requests a JSON object in the body containing:
 *          - "token": valid user token
 *          - "size": the maximum amount of most recent posts to read (optional, default 100; no less than 1 and no greater than 10000)
 *          - "bookmark": the post ID of the last post in the previous page (-1 if grabbing the first page; x
 *              optional, unimplemented)
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with a JSON array of the most recent posts containing each:
 *          - "id": the post ID of the post
 *          - "user": the username of the user who created the post
 *          - "userType": the usertype of the user who created the post
 *          - "picture": the filename of the image attached to the post, if any
 *          - "content": the text content of the post, if any
 *          - "dislikes": number of dislikes on the post
 *          - "comments": number of comments on the post (unimplemented; will work on that later)
 *          - "isDisliked": whether or not the user has disliked this post (0 if false, 1 if true)
 *      Eventually, we will also have the idea of private posts which will not send to users who are not
 *      friends of that user.
 */
export function feed(req: Request, res: Response) {
    // ensure valid request 
    if (!("token" in req.body)) {
        res.status(400).send("Error: \"token\" not in request JSON.");
        return;
    }
    
    // ensure logged in
    if (!sessions.has(req.body.token)) {
        // invalid user token
        console.log("[API] Feed get failed! (invalid token provided)");
        res.status(401).send("Error: Invalid token provided.");
        return;
    }
    
    let size = 100;
    if ("size" in req.body) {
        if (typeof req.body.size !== "number") {
            res.status(400).send("Error: \"size\" is not of type \"number\" in request JSON.");
            return;
        } else if (req.body.size < 1) {
            res.status(400).send("Error: \"size\" cannot be less than 1.");
            return;
        } else if (req.body.size > 10000) {
            res.status(400).send("Error: \"size\" cannot be greater than 10000.");
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
            u.UserType as userType,
            p.Timestamp as timestamp,
            p.Picture as picture, 
            p.Content as content,
            (
                SELECT count(*)
                FROM PostDislikes pd
                WHERE 
                    pd.ID = p.ID AND
                    pd.Disliked = true
            ) as dislikes,
            (
                SELECT count(*)
                FROM PostDislikes pd
                WHERE
                    pd.ID = p.ID AND
                    pd.Username = p.Username AND
                    pd.Disliked = true
            ) as isDisliked
        FROM Posts p
        JOIN Users u ON u.Username = p.Username
        ORDER BY 
            timestamp DESC,
            id DESC
        LIMIT ?;
    `, 
    [size],
    function (err, rows) {
        if (err) {
            console.log("[SQL] Error: " + err);
            res.status(500).send("Error: Database error!");
            return;
        } 
        
        // If we get no rows, return an empty list so that the frontend
        // can keep working smoothly
        // Otherwise it will be an empty object which may not be nice
        if (!rows) {
            rows = [];
        }
        
        res.status(200).send(rows);
    });
}
