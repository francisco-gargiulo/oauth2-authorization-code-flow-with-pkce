const { Router } = require("express");

const buildRedirectURL = require("../utils/buildRedirectURL");

const validateAuthorizeParams = require("../middlewares/validateAuthorizeParams");
const checkAuthentication = require("../middlewares/checkAuthentication");

const ClientService = require("../domain/services/ClientService");
const AuthorizationCodeService = require("../domain/services/AuthorizationCodeService");

const Repository = require("../infrastructure/Repository");

const router = new Router();

const clientRepository = new Repository("client");
const authzRepository = new Repository("authorization-code");

const clientService = new ClientService(clientRepository);
const authorizationCodeService = new AuthorizationCodeService(authzRepository);

router.get("/", [
  validateAuthorizeParams,
  checkAuthentication,
  async function (req, res) {
    const {
      session: { user },
      query: { client_id, state, code_challenge },
    } = req;

    try {
      const client = await clientService.findById(client_id);

      if (!client) {
        throw new Error("Client not found");
      }

      const authorizationCode = await authorizationCodeService.create({
        userId: user.id,
        clientId: client.id,
        codeChallenge: code_challenge,
      });

      const redirectURL = buildRedirectURL(client, authorizationCode.id, state);

      res.redirect(redirectURL);
    } catch (error) {
      console.log(error);

      res.status(400).json({
        error: "invalid_request",
        error_description: error.message || "Invalid request",
      });
    }
  },
]);

module.exports = router;
