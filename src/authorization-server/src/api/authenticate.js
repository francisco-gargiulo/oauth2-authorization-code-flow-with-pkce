const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const buildRedirectURL = require("../utils/buildRedirectURL");

const Repository = require("../infrastructure/Repository");

const UserService = require("../domain/services/UserService");
const ClientService = require("../domain/services/ClientService");
const AuthorizationCodeService = require("../domain/services/AuthorizationCodeService");

const router = new Router();

const userRepository = new Repository("user");
const clientRepository = new Repository("client");
const authzRepository = new Repository("authorization-code");

const clientService = new ClientService(clientRepository);
const authorizationCodeService = new AuthorizationCodeService(authzRepository);
const userService = new UserService(userRepository);

router.post("/", async function (req, res) {
  const {
    body: { email },
    session,
  } = req;

  const { client_id, state, code_challenge } = session.params;

  try {
    const client = await clientService.findById(client_id);

    if (!client) {
      res.status(400).json({ error: "Client not found" });
      return;
    }

    const user = await userService.findByEmail(email);

    if (!user) {
      res.set("WWW-Authenticate", 'Basic realm="Invalid credentials"');
      res.sendStatus(401);
      return;
    }

    // TODO: validate credentials
    session.user = user;

    const authorizationCode = await authorizationCodeService.create({
      userId: user.id,
      clientId: client.id,
      codeChallenge: code_challenge,
    });

    const redirectURL = buildRedirectURL(client, authorizationCode.id, state);

    res.redirect(redirectURL);
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
});

router.get("/", async function (req, res) {
  res.send(
    fs.readFileSync(path.join(__dirname, "../views/authenticate.html"), "utf8")
  );
});

module.exports = router;
