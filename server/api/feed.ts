import { Request, Response } from "express";

/**
 * Returns a list of the (default) top 100 most recent posts visible to the currently logged in user
 * @param {Request} req - Requests a JSON object in the body containing:
 *          - "token": valid user token
 *          - "size": the maximum amount of most recent posts to read (optional, default 100)
 *          - "bookmark": the post ID of the last post in the previous page (-1 if grabbing the first page; x
 *              optional, unimplemented)
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with an array of the most recent posts containing each:
 *          - "id": the post ID of the post
 *          - "user": the username of the user who created the post
 *          - "image": the filename of the image attached to the post, if any
 *          - "content": the text content of the post, if any
 */
export function feed(req: Request, res: Response) {
    if (typeof req.body === "object") {
        // ensure valid request 
        if (!("token" in req.body)) {
            res.status(400).send("Error: \"token\" not in request JSON.");
            return;
        }
        
        if (("size" in req.body) && typeof req.body.size !== "number") {
            res.status(400).send("Error: \"size\" is not of type \"number\" in request JSON.");
            return;
        }
        
        // get posts
        /** 
         * WHAT IS A POST? Nothing but a miserable little pile of:
         * id: post ID, useful for referencing
         * user: user that created the post
         * picture: the filename of the image attached to the post, if any
         * content: contents of the message, if any
         * dislikes: number of dislikes on the post
         * comments: number of comments on the post (unimplemented; will work on that later)
        */


        // generate array of posts
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}
