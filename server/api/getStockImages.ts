import { db } from '../database';
import { Request, Response } from 'express';

/**
 * Selects the stock image of the image name passed in the URL parameter from the database
 * @param req The HTTP request
 * @param res The HTTP response
 */
export function dbStockImages (req: Request, res: Response) {
    db.all(`SELECT * FROM StockImages'`, function (err,rows: any) {
        if (err) {
            console.log("[SQL] Error: " + err);
            res.status(500).send("Error: Database error!");
            return;
        } 
        
        // If we get no rows, return an empty list so that the frontend
        // can keep working smoothly
        // Otherwise it will be an empty object which may not be nice
        if (!rows) {
            rows = [];
        }
        
        res.status(200).send(rows);
        
    });
};
