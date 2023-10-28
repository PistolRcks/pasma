import { db } from "../database";
import { Request, Response } from "express";

let firstPost: boolean = true;
let postID: number;

/**
 * Reacts to a post.
 * @param {Request} req Requires a JSON body which includes an 'id' field.
 * @param {Response} res Response to request (200 if success, 400 if post does not exist, and 500 if failed for other reason)
 */
export function react(req: Request, res: Response) {
    if ("id" in req.body) {
        // first, lets make sure the post exists
        db.get(`SELECT * FROM Posts WHERE ID=?`, [req.body.id], function (err: Error, row: any) {
            // error running query
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            }
            // if no post is found
            if (!row || row.test == "fail") {
                console.log('[API] Edit request failed! (invalid post ID)');
                res.status(403).send("Invalid post ID!");
                return;
            }
            // then, check if we have already disliked this post (we want to remove the dislike if that is the case)
            db.get(`SELECT * FROM PostDislikes WHERE ID=?`, [req.body.id], function (err: Error, row: any) {
                
            });
            // post found, react to post
            db.run(`UPDATE PostDislikes SET ID=?,  WHERE ID=?`, [req.body.content, req.body.id],
                function (err: Error) {
                    if (err) {
                        console.log("[SQL] Error: " + err);
                        res.status(500).send("Database error!");
                        return;
                    }
                    console.log('[API] Post ' + req.body.id + ' editted');
                    res.status(200).send();
                    return;
                });
        });
    } else {
        //invalid request data
        console.log('[API] Edit request failed! (invalid edit request)');
        res.status(500).send("Invalid edit request!");
        return;
    }
}
