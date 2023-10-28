import { db } from "../database";
import { isPost } from "../../server/types/DatabaseTypes";
import { Request, Response } from "express";

let firstPost: boolean = true;
let postID: number;

/**
 * Creates a post, given valid Post information.
 * @param {Request} req Requires a valid Post in the JSON body.
 * @param {Response} res Responds with the post ID in the text field if successful, otherwise returns status code 500.
 */
function createPost(req: Request, res: Response) {
    if (isPost(req.body)) {
        db.run(`INSERT INTO Posts VALUES (?, ?, ?, ?, ?)`,
            [postID, req.body.Username, req.body.Content, req.body.Picture, req.body.Timestamp],
            function (err) {
                if (err) {
                    console.log("[SQL] Error!");
                    res.status(500).send("Database error!");
                }
                console.log('[API] Post ' + postID + ' created');
                res.status(200).send("" + postID);
                ++postID;
            });
    } else {
        console.log('[API] Post request failed!');
        res.status(500).send("Invalid post request!");
    }
}

/**
 * Checks if this is the initial post before second it off to createPost, which does the work.
 * @param {Request} req Requires a valid Post in the JSON body.
 * @param {Response} res Responds with the post ID in the text field if successful, otherwise returns status code 500.
 */
export function post(req: Request, res: Response) {
    if (firstPost) {
        db.get(`SELECT COUNT(*) as 'count' FROM Posts`, function (err: any, row: any) {
            if (err) {
                console.log("[SQL] Error!");
                res.status(500).send("Database error!");
            }
            postID = row.count;
            createPost(req, res)
        });
        firstPost = false;
    } else {
        createPost(req, res)
    }
}
