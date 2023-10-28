import { db } from "../database";
import { Request, Response } from "express";

/**
 * Edits a post.
 * @param {Request} req Requires a JSON body which includes a 'content' and 'id' field. id must be the ID of a valid post.
 * @param {Response} res Response to request (200 if success, 403 if post does not exist, and 500 if failed for other reason)
 */
export function edit(req: Request, res: Response) {
    if ("id" in req.body && "content" in req.body) {
        db.get(`SELECT * as 'post' FROM Posts WHERE ID=?`, [req.body.id], function (err: Error, row: any) {
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
            // post found, edit post
            db.run(`UPDATE Posts SET content=? WHERE ID=?`, [req.body.content, req.body.id],
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
