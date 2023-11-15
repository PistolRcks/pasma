import { db } from '../database';
import { Request, Response } from 'express';
import { sessions } from "../types/Session";

/**
 * Gets a list of possible post phrases from the database.
 * @param {Request} req Requires a JSON body which includes 'token' field.
 * @param {Response} res Response to request (200 if success, 401 if token is invalid, and 500 if failed for other reason)
 */
export function getPhrases(req: Request, res: Response) {

    if (!("token" in req.body)) {
        console.log('[API] getPhrases request failed! (invalid getPhrases request)');
        res.status(500).send("Invalid getPhrases request!");
        return;
    }

    if (!sessions.has(req.body.token)) {
        console.log("[API] getPhrases request failed! (invalid token provided)");
        res.status(401).send("Invalid token provided!");
        return;
    }

    db.all(`SELECT Phrase FROM 'PostPhrases'`, function (err, rows: any) {
        if (err) {
            console.log("[SQL] Error: " + err);
            res.status(500).send("Database error!");
            return;
        }

        let phrases: string[] = [];
        rows.forEach(function (row: any) {
            phrases.push(row["Phrase"])
        });

        res.status(200).send(phrases);
        return;
    });
};
