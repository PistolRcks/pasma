// Here is the file which will act as the launching point for our Bun backend.

import server from "bunrest";
import { login } from "./api/login";
import { sessions, addSession } from "./types/Session";


/**
 * The actual app. Set request handlers to this object.
 */
const app = server();

/**
 * The specific router for API calls.
 */
const api = app.router();

// Log all requests
app.use((req, res, next) => {
    // FIXME: Not displaying date correctly?
    console.log(`[${Date.now().toLocaleString("en-us")}] ${req.method} at ${req.path}`);
    
    // propagate if possible
    if (next) {
        next();
    }
});

// Propagate errors to the frontend
app.use((req, res, next, err) => {
    const errorMsg: string = `Error occurred at "${err?.name}": ${err?.message}\n\t${err?.stack}`;
    res.status(500).send(errorMsg);
    // FIXME: Not displaying date correctly?
    console.log(`[${Date.now().toLocaleString("en-us")}] ${errorMsg}`);
 });

api.post("/login", login);

app.use("/api", api);

app.listen(3000, () => {
    console.log('App initialized and is listening on port 3000.');
});

addSession({ username: "blah" });

console.log(`Sessions: ${sessions}`);
