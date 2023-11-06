import { db } from '../database';
import { Request, Response } from 'express';

/**
 * Selects the profile picture of the username passed as a URL parameter from the database
 * @param req The HTTP request
 * @param res The HTTP response
 */
export function dbProfilePicture (req: Request, res: Response) {
    db.get(`SELECT ProfilePicture FROM Users WHERE Username = '${req.params.Username}'`, function (err,row: any) {
        if (row) {
            res.status(200).send("" + row.ProfilePicture);
        }
        else {
            res.status(400).type('txt').send("User does not exist");
        }
    });
};
