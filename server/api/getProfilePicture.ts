import { db } from '../database';
import { Request, Response } from 'express';

export function dbProfilePicture (req: Request, res: Response) {
    let profilePicture: string;
    db.get(`SELECT ProfilePicture FROM Users WHERE Username = '${req.params.Username}'`, function (err,row: any) {
        if (row) {
            profilePicture = row.ProfilePicture;
            res.status(200).type('txt').send("" + profilePicture);
        }
        else {
            res.status(400).type('txt').send("User does not exist");
        }
    });
};
