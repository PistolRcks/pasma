import { db } from "../database";
import { Request, Response } from "express";
import { sessions } from "../types/Session";

let firstPhrase: boolean = true;
export let phraseID: number;

/**
 * Sets the phraseID value.
 */
export function setPhrase(n: number) {
    phraseID = n;
}

/**
 * Creates a phrase.
 * @param {Request} req Requires a JSON body which includes 'token' and 'phrase' fields.
 * @param {Response} res Responds with the phrase ID in the text field if successful, otherwise returns status code 500.
 */
function createPhrase(req: Request, res: Response) {
    if (!("token" in req.body && "phrase" in req.body)) {
        console.log('[API] createPhrase request failed!');
        res.status(500).send("Invalid createPhrase request!");
        return;
    }

    if (!sessions.has(req.body.token)) {
        console.log('[API] createPhrase request failed! (invalid token provided)');
        res.status(401).send("Invalid token provided!");
        return;
    }

    if (req.body.phrase.length > 256 || req.body.phrase.length === 0) {
        console.log('[API] createPhrase request failed! (invalid phrase length)');
        res.status(500).send("Invalid phrase length! Phrase must be between 1 and 256 characters!");
        return;
    }

    const username = sessions.get(req.body.token).username;

    db.get(`SELECT UserType FROM Users WHERE Username=${username}`, function (err: Error, row: any) {
        if (err) {
            console.log("[SQL] Error: " + err);
            res.status(500).send("Database error!");
            return;
        }

        if (row.UserType != "moderator") {
            console.log('[API] createPhrase request failed! (invalid permissions)');
            res.status(500).send("Invalid permissions! You must be a moderator to create phrases!");
            return;
        }

        db.run(`INSERT INTO PostPhrases(Phrase) VALUES (?)`, [req.body.phrase], function (err: Error) {
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            }

            console.log('[API] Phrase ' + phraseID + ' created');
            res.status(200).send("" + phraseID);
            ++phraseID;
            firstPhrase = false;
            return;
        });
    });
}

/**
 * Checks if this is the initial phrase before sending it off to createPhrase, which does the interaction with the database.
 * @param {Request} req Requires a JSON body which includes 'token', 'content', and 'picture' fields.
 * @param {Response} res Responds with the phrase ID in the text field if successful, otherwise returns status code 500.
 */
export function phrase(req: Request, res: Response) {
    if (firstPhrase) {
        db.get(`SELECT COUNT(*) as 'count' FROM PostPhrases`, function (err: Error, row: any) {
            if (err) {
                console.log("[SQL] Error: " + err);
                res.status(500).send("Database error!");
                return;
            }
            phraseID = row.count;
            createPhrase(req, res);
        });
    } else {
        createPhrase(req, res);
    }
}
