// This file handles changing a users password

import crypto from "crypto";
import { Request, Response } from "express";
import { db } from "../database";
import { addSession } from "../types/Session";
import { isUser, userTypes } from "../types/DatabaseTypes";
import { verifyPassword } from "./register";
import { sessions } from "../types/Session";

/**
 * Changes a user's password, given a valid session token and valid new password.
 * @param {Request} req - Requests a JSON object in the body containing 
 *      "token", "oldPassword" and "newPassword" field.
 * @param {Response} res - Responds with error text in the case of a user or internal 
 *      error (beginning with "Error:"), or with the newly generated session token in the case of
 *      a success.
 */

export function changePassword(req: Request, res: Response) {
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
            res.status(401).send("Error: Invalid token provided.");
            return;
        }

        // Is input malformed?
        if (!("oldPassword" in req.body)) {
            res.status(400).send("Error: \"password\" not in request JSON.");
            return;
        }
        if (!("newPassword" in req.body)) {
            res.status(400).send("Error: \"password\" not in request JSON.");
            return;
        }
        
        // Is the new password good?
        if (!verifyPassword(req.body.newPassword)) {
            res.status(400).send("Error: New password is insecure. It must have at least 12 characters, one digit, and one special character.");
            return;
        }

        // Check that old passwords match
        db.get(`select * from Users where Username = "${sessions.get(req.body.token).username}"`, function (err, user) {
            if (err) {
                res.status(500).send(`Server Error: ${err}`);
                return;
            }

            if (typeof user === "undefined" || user === null) {
                res.status(401).send("Error: Username or password does not exist.");
                return;
            // Need to narrow here or else we are not able to use the result we got
            } else if (isUser(user)) {
                // Verify (assuming sent password is plaintext)
                const oldPasswordHash = crypto.pbkdf2Sync(req.body.oldPassword, user.Salt, 1000, 64, "sha512").toString('hex'); 
                if (user.Password === oldPasswordHash) {
                    // Generate password hash
                    const newSalt = crypto.randomBytes(16);
                    const newPasswordHashed = crypto.pbkdf2Sync(req.body.newPassword, newSalt, 1000, 64, "sha512"); 

                    // Dynamically generate the SQL statement based on what we've got
                    let params = [newPasswordHashed.toString("hex"), newSalt];
                    let appliedFields = "Password = ?, Salt = ?";
                    let questionMarks = "?, ?";
                    
                    db.run(`UPDATE Users SET ${appliedFields} WHERE Username = "${user.Username}"`, params, function (err) {
                        if (err) {
                            res.status(500).send(`Server Error: ${err}`);
                            return;
                        }
                        
                        res.status(200).send("Success!");
                        return;
                    });
                } else {
                    res.status(401).send("Error: Username or password does not exist.");
                    return;            
                }            
            }
        });
    }
}
