import express from "express";
import { createServer } from "node:http";
import { hostname } from "node:os";
import csfetch from "./lib/fetch.js";
import $gr from "./lib/config.js";
import rewrite from "./lib/rewriter.js"

const app = express();
app.use(express.static("public"));
app.get($gr.prefix, (req, res) => {
  const query = req.query.q;

  csfetch(query, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      res.send(rewrite(result, query));
    }
  });
});

const server = createServer();



server.on("request", (req, res) => {
  app(req, res);
});

// de port
let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// sigma shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  process.exit(0);
}

server.listen({
  port,
});