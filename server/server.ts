// In this file are all of the request handlers for our server app.
// This does NOT launch the app itself--`main.ts` handles that

import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import { comment } from "./api/comment";
import { phrase } from './api/createPhrase';
import { edit } from "./api/edit";
import { getPhrases } from './api/getPhrases';
import { login } from "./api/login";
import { logout } from "./api/logout";
import { post } from "./api/post";
import { dbProfilePicture } from './api/getProfilePicture';
import { react } from './api/react';
import { register } from './api/register';
import { feed } from './api/feed';
import { dbStockImages } from './api/getStockImages';
import { getProfilePictures } from './api/getProfilePictures';
import { changePassword } from './api/changePassword';
import { changeProfilePicture } from './api/changeProfilePicture';


/**
 * The actual app. Set request handlers to this object.
 */
const app: Express = express();
export default app;

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
    console.log(`Body: ${JSON.stringify(req.body)}`);

   // propagate if possible
    next();
});

// Propagate errors to the frontend
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const errorMsg: string = `Error occurred at "${err?.name}": ${err?.message}\n\t${err?.stack}`;
    res.status(500).send(errorMsg);
    // FIXME: Not displaying date correctly?
    console.log(`[${Date.now().toLocaleString("en-us")}] ${errorMsg}`);
});

// Attach endpoints to API router
api.post("/comment", comment);
api.post("/createPhrase", phrase);
api.post("/edit", edit);
api.post("/login", login);
api.post("/logout", logout);
api.post("/react", react);
api.post("/register", register);
api.post("/post", post);
api.post("/profile/settings/password", changePassword)
api.post("/profile/settings/profile_picture", changeProfilePicture)

api.post("/feed", feed);        // not really a POST but still must be POST due to how JS fetch works
api.post("/getPhrases", getPhrases);
api.get('/getProfilePicture/:Username', dbProfilePicture)
api.post('/getStockImages', dbStockImages)
api.get('/getProfilePictures', getProfilePictures)


app.use("/api", api);

// Create static route to serve (most of) the public folder (like static non-routed files)
app.use(express.static("./public"));

// Required for React Routing; serve routed files 
app.use('*', (req: Request, res: Response) => {
    // actually begins in the "dist" folder since that's where we're compiling typescript to
    // thus, gotta go up a folder
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
