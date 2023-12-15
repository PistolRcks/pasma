// This file handles signing a user up to the website, as well as password validation.

import crypto from "crypto";
import { Request, Response } from "express";
import { db } from "../database";
import { addSession } from "../types/Session";
import { userTypes } from "../types/DatabaseTypes";

/**
 * Signs up a user and stores the state, given a unique username and valid password. 
 * @param {Request} req - Requests a JSON object in the body containing 
 *      "username", "password", and "userType" (one of "standard", "brand", or "moderator") fields.
 *      Optional "profilePicture" field (the string name of the profile picture file).
 * @param {Response} res - Responds with errortext in the case of a user or internal 
 *      error (beginning with "Error:"), or with the newly generated session token in the case of
 *      a success.
 */
export function register(req: Request, res: Response) {
    if (typeof req.body === "object") {
        // Is input malformed?
        if (!("username" in req.body && "password" in req.body && "userType" in req.body)) {
            res.status(400).send("Error: \"username\",  \"password\", and/or \"userType\" not in request JSON.");
            return;
        }
        
        if (!userTypes.includes(req.body.userType)) {
            res.status(400).send(`Error: "userType" was not one of the following: ${userTypes}`);
            return;
        }
        
        if (!req.body.username) {
            res.status(400).send("Error: \"username\" field is blank!");
            return;
        }
        
        // Is the password good?
        if (!verifyPassword(req.body.password)) {
            res.status(400).send("Error: Password is insecure. It must have at least 12 characters, one digit, and one special character.");
            return;
        }

        // Is the username already taken?
        db.get(`select * from Users where Username = '${req.body.username}'`, function (err, row) {
            if (err) {
                res.status(500).send(`Server Error: ${err}`);
                return;
            }
            
            // Username is already taken if we can find it (i.e. it is nonnull)
            if (row) {
                res.status(400).send("Error: Username was already taken.");
                return;
            }
            
            // Create new user
            // Generate password hash
            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512"); 

            // Dynamically generate the SQL statement based on what we've got
            let params = [req.body.username, hashedPassword.toString("hex"), salt, req.body.userType];
            let appliedFields = "Username, Password, Salt, UserType";
            let questionMarks = "?, ?, ?, ?";
            
            if ("profilePicture" in req.body) {
                params.push(req.body.profilePicture);
                appliedFields += ", ProfilePicture";
                questionMarks += ", ?";
            }

            // Actually run the newly generated statement
            db.run(`INSERT INTO Users(${appliedFields})
                VALUES(${questionMarks});
            `, 
            params, function (err) {
                if (err) {
                    res.status(500).send(`Server Error: ${err}`);
                    return;
                }
                
                // Log the new user in
                console.log(`[API] Created new user "${req.body.username}"`);
                const token = addSession({ username: req.body.username });
                    res.status(200).send({
                        token: token,
                        username: req.body.username,
                        userType: req.body.userType,
                        profilePicture: req.body.profilePicture 
                    });
            });
            
        });
    } else {
        res.status(400).send("Error: Request body was not able to be transformed into JSON.");
        return;
    }
}

/**
 * Returns whether or not the given password is valid.
 * @param {string} password - The password to check 
 * @return {boolean} Whether or not the password contains all of the following:
 *      - The password length is at least 12
 *      - The password contains at least one digit
 *      - The password contains at least one special character
 *        (one of: !@#$%^&*()_+-=[]{};':"\|,.<>/?)
 */
export function verifyPassword(password: string): boolean {
    return (
        password.length >= 12 &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    );
}
