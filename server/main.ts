// Start listening on our server. Must be in a different file as to the server
// definition, or else our app will start listening during testing (and break things)
import app from "./server";

app.listen(3000, () => {
    console.log('App initialized and is listening on port 3000.');
});
