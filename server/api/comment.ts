import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";
import { postID, setPost } from "./post";

/**
 * Comments on a post.
 * @param {Request} req Requires a JSON body which includes 'id', 'content', and 'token' fields.
 * @param {Response} res Response to request (200 if success, 400 if post does not exist, and 500 if failed for other reason)
 */
export function comment(req: Request, res: Response) {
    /**
     * if someone tries sending a valid comment request before the postID value is initialized,
     * a database error will occur. if it is not, we can quickly fetch it to prevent issues.
     */
    if (!postID) {
        db.get(`SELECT COUNT(*) as 'count' FROM Posts`, function (err: Error, row: any) {
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            }
            setPost(row.count);
        });
    }

    if ("id" in req.body && "content" in req.body && "token" in req.body) {
        if (sessions.has(req.body.token)) {
            const username = sessions.get(req.body.token).username;

            // first, check if parent post exists...
            db.get(`SELECT * FROM Posts WHERE ID=?`, [req.body.id], function (err: Error, row: any) {
                // error running query
                if (err) {
                    console.log("[SQL] Error: " + err);
                    res.status(500).send("Database error!");
                    return;
                }
                // if no post is found
                if (!row) {
                    console.log('[API] Comment request failed! (invalid post ID)');
                    res.status(400).send("Invalid post ID!");
                    return;
                }

                const timestamp = Date.now();
                // ...if it does, create a comment
                db.run(`INSERT INTO Posts(ID, Username, Content, Picture, Timestamp, ParentID) VALUES (?, ?, ?, ?, ?, ?)`, [postID, username, req.body.content, req.body.picture, timestamp, req.body.id], function (err: Error) {
                    if (err) {
                        console.log("[SQL] Error: " + err);
                        res.status(500).send("Database error!");
                        return;
                    }

                    // if successful, reflect the change in the parent post by incrementing comment count
                    db.run(`UPDATE Posts SET CommentCount=CommentCount+1 WHERE id=?`, [req.body.id], function (err: Error) {
                        if (err) {
                            console.log("[SQL] Error: " + err);
                            res.status(500).send("Database error!");
                            return;
                        }

                        // if all of that worked, we can finally return success status
                        console.log('[API] Comment ' + postID + ' created');
                        res.status(200).send("" + postID);
                        setPost(postID + 1);
                        return;
                    });
                });
            });
        } else {
            console.log("[API] Comment request failed! (invalid token provided)");
            res.status(500).send("Invalid token provided!");
            return;
        }
    } else {
        //invalid request data
        console.log('[API] Comment request failed! (invalid comment request)');
        res.status(500).send("Invalid comment request!");
        return;
    }
}
