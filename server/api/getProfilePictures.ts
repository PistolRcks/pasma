import { db } from '../database';
import { Request, Response } from 'express';

/**
 * Selects the all profile pictures from the database
 * @param req The HTTP request
 * @param res The HTTP response
 */
export function getProfilePictures (req: Request, res: Response) {
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
