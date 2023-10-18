// Here is the file which will act as the launching point for our Bun backend.

import express, { Express, NextFunction, Request, Response } from 'express';
import { login } from "./api/login";
import { dbProfilePicture } from './api/getProfilePicture';


/**
 * The actual app. Set request handlers to this object.
 */
export const app : Express = express();

/**
 * The specific router for API calls.
 */
const api = express.Router();

// Translate to JSON whenever possible
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    // FIXME: Not displaying date correctly?
    console.log(`[${Date.now().toLocaleString("en-us")}] ${req.method} at ${req.path}`);
    
    // propagate if possible
    next();
});

// Propagate errors to the frontend
app.use((err : any, req : Request, res : Response, next : NextFunction) => {
    const errorMsg: string = `Error occurred at "${err?.name}": ${err?.message}\n\t${err?.stack}`;
    res.status(500).send(errorMsg);
    // FIXME: Not displaying date correctly?
    console.log(`[${Date.now().toLocaleString("en-us")}] ${errorMsg}`);
 });

api.post("/login", login);

app.use("/api", api);

api.get('/getProfilePicture/:Username', dbProfilePicture)

// Create static route to serve the public folder
app.use(express.static('./public'))

app.listen(3000, () => {
    console.log('App initialized and is listening on port 3000.');
});
