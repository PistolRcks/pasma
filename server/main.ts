// Here is the file which will act as the launching point for our Bun backend.
const server = Bun.serve({
  port: 3000,
    fetch(req) {
    return new Response(Bun.file("./public/"));
  },
});
  
console.log(`Listening on http://localhost:${server.port} ...`);
