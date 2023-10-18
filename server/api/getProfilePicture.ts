import { db } from '../database';
import { Request, Response } from 'express';

export function dbProfilePicture (req: Request, res: Response) {
    let profilePicture: string;
    db.get(`SELECT ProfilePicture FROM Users WHERE Username = '${req.params.Username}'`, (err,row: any) => {
        profilePicture = row.ProfilePicture;
        res.status(200).type('txt').send("" + profilePicture);
    });
};
