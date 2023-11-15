import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";

let firstPost: boolean = true;
export let postID: number;

/**
 * Sets the postID value.
 */
export function setPost(n: number) {
    postID = n;
}

/**
 * Creates a post.
 * @param {Request} req Requires a JSON body which includes 'token', 'content', and 'picture' fields.
 * @param {Response} res Responds with the post ID in the text field if successful, otherwise returns status code 500.
 */
function createPost(req: Request, res: Response) {
    if ("token" in req.body && "content" in req.body && "picture" in req.body) {
        if (sessions.has(req.body.token)) {
            const username = sessions.get(req.body.token).username;
            const timestamp = Date.now();
            db.run(`INSERT INTO Posts(ID, Username, Content, Picture, Timestamp) VALUES (?, ?, ?, ?, ?)`,
                [postID, username, req.body.content, req.body.picture, timestamp],
                function (err: Error) {
                    if (err) {
                        console.log("[SQL] Error: " + err);
                        res.status(500).send("Database error!");
                        return;
                    }
                    console.log('[API] Post ' + postID + ' created');
                    res.status(200).send("" + postID);
                    ++postID;
                    firstPost = false;
                    return;
                });
        } else {
            console.log('[API] Edit request failed! (invalid token provided)');
            res.status(401).send("Invalid token provided!");
            return;
        }
    } else {
        console.log('[API] Post request failed!');
        res.status(500).send("Invalid post request!");
        return;
    }
}

/**
 * Checks if this is the initial post before sending it off to createPost, which does the interaction with the database.
 * @param {Request} req Requires a JSON body which includes 'token', 'content', and 'picture' fields.
 * @param {Response} res Responds with the post ID in the text field if successful, otherwise returns status code 500.
 */
export function post(req: Request, res: Response) {
    if (firstPost) {
        db.get(`SELECT COUNT(*) as 'count' FROM Posts`, function (err: Error, row: any) {
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            }
            postID = row.count;
            createPost(req, res);
        });
    } else {
        createPost(req, res);
    }
}
