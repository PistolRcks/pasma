import { Request, Response } from "express";
import { db } from "../database";
import { sessions } from "../types/Session";

/**
 * Changes a user's profile picture, given a valid session token and valid new profile picture.
 * @param {Request} req - Requests a JSON object in the body containing 
 *      "token" and "profile_picture" field.
 * @param {Response} res - Responds with error text in the case of a user or internal 
 *      error (beginning with "Error:"), or with the newly generated session token in the case of
 *      a success.
 */
export function changeProfilePicture(req: Request, res: Response) {
    if ("token" in req.body && "profile_picture" in req.body) {

        if (!sessions.has(req.body.token)) {
            // invalid user token
            console.log("[API] changeUsername failed! (invalid token provided)");
            res.status(401).send("Error: Invalid token provided.");
            return;
        }

        db.run(`UPDATE Users SET ProfilePicture = ? WHERE Username = ?`, [req.body.profile_picture, sessions.get(req.body.token).username], function (err) {
            if (err) {
                res.status(500).send(`Server Error: ${err}`);
                return;
            }

            res.status(200).send("OK");
            return;
        });
    } else {
        res.status(400).send("Error: Invalid changeProfilePicture request!");
        return;
    }
}
