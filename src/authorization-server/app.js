const express = require("express");
const session = require("express-session");
const cors = require("cors");

const logger = require("morgan");

const api = require("./src/api");

const app = express();

app.use(cors());

app.use(
  session({
    secret: "s3cr3t", // A secret key used to sign the session ID cookie
    name: "sid", // Name of the session ID cookie
    resave: false, // Do not save the session if it was not modified
    saveUninitialized: true, // Save uninitialized sessions (i.e., new and not modified)
  })
);

app.use(logger("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// server metadata
app.get("/.well-known", (req, res) => {
  res.json({
    issuer: "http://localhost:3000",
    authorization_endpoint: "http://localhost:3000/oauth2/authorize",
    token_endpoint: "http://localhost:3000/oauth2/token",
    revocation_endpoint: "http://localhost:3000/oauth2/revoke",
    introspection_endpoint: "http://localhost:3000/oauth2/introspect",
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    token_endpoint_auth_methods_supported: ["none"],
    token_endpoint_auth_signing_alg_values_supported: ["HS256"],
  });
});

app.use("/oauth2", api);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).send("Internal Server Error");
});

module.exports = app;
