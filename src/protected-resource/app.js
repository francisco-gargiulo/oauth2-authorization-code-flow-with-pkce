const express = require("express");
const session = require("express-session");
const cors = require("cors");

const logger = require("morgan");

const api = require("./src/api");

// Create an Express app
const app = express();

app.use(cors());

// Configure session middleware
app.use(
  session({
    secret: "s3cr3t", // A secret key used to sign the session ID cookie
    name: "sid", // Name of the session ID cookie
    resave: false, // Do not save the session if it was not modified
    saveUninitialized: true, // Save uninitialized sessions (i.e., new and not modified)
  })
);

// Add middleware to log requests in the console
app.use(logger("dev"));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// Server status
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Route all requests to the api module
app.use("/api", api);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Export the Express app object for use in other modules
module.exports = app;
