// In this file are all of the request handlers for our server app.
// This does NOT launch the app itself--`main.ts` handles that

import express, { Express, NextFunction, Request, Response } from 'express';
import { edit } from "./api/edit";
import { login } from "./api/login";
import { post } from "./api/post";
import { dbProfilePicture } from './api/getProfilePicture';
import { react } from './api/react';
import { register } from './api/register';


/**
 * The actual app. Set request handlers to this object.
 */
const app : Express = express();
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

// Attach endpoints to API router
api.post("/edit", edit);
api.post("/login", login);
api.post("/react", react);
api.post("/register", register);
api.post("/post", post);
api.get('/getProfilePicture/:Username', dbProfilePicture)

app.use("/api", api);

// Create static route to serve the public folder
app.use(express.static('./public'))
