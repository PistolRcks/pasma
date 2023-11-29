import { db } from '../database';
import { Request, Response } from 'express';
import { sessions } from "../types/Session";

/**
 * Selects the all profile pictures from the database
 * @param req The HTTP request
 * @param res The HTTP response
 */
export function getProfilePictures (req: Request, res: Response) {
    // ensure valid request 
    if (!("token" in req.body)) {
        res.status(400).send("Error: \"token\" not in request JSON.");
        return;
    }
    
    // ensure logged in
    if (!sessions.has(req.body.token)) {
        // invalid user token
        console.log("[API] Profile Pictures get failed! (invalid token provided)");
        res.status(401).send("Error: Invalid token provided.");
        return;
    }

    db.all(`SELECT Picture FROM 'ProfilePictures'`, function (err,rows: any) {
        if (err) {
            console.log("[SQL] Error: " + err);
            res.status(500).send("Error: Database error!");
            return;
        }

        let profilePicturesArray: string[] = [];
        rows.forEach((row: any) => {
            profilePicturesArray.push(row["Picture"])
        });
        
        res.status(200).send(profilePicturesArray);
        return;
    });
};
