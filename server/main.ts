// Here is the file which will act as the launching point for our Bun backend.

//import server from "bunrest";
import { serve, file } from 'bun';
//const app = server();

// Set port
//const port = 3000

// Create a universal route that logs all request
/*
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})
*/

// Create static route to serve the public folder
serve({
    fetch(req) {
      const rootFilePath = "./public"
      const url = new URL(req.url);
      console.log (url.pathname)
      if (url.pathname == "/") {
        return new Response(file(rootFilePath+"/index.html"))
      } else {
        return new Response(file(rootFilePath+url.pathname))
      }
    }
  })

// Start listening
//app.listen(port, () => {
//    console.log(`Server started at http://localhost:${port}`)
//})
