import { db } from '../main';
import { isPost, isUser } from '../database';
import { Request, Response } from 'express';

export function dbProfilePicture (req: Request, res: Response) {
    if(1===1) {
        let profilePicture: string;
        db.get(`SELECT ProfilePicture FROM Users WHERE Username = '${req.params.Username}'`, (err,row: any) => {
            profilePicture = row.ProfilePicture;
            res.status(200).type('txt').send("" + profilePicture);
        });
    } else {
        res.status(500).type('txt').send("Invalid fields for fetching profile picture!");
    }
};
