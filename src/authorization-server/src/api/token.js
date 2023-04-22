const { Router } = require("express");

const validateTokenParams = require("../middlewares/validateTokenParams");

const AuthorizationCodeService = require("../domain/services/AuthorizationCodeService");
const TokenService = require("../domain/services/TokenService");
const Repository = require("../infrastructure/Repository");

const router = new Router();

const authnCodeRepository = new Repository("authorization-code");
const tokenRepository = new Repository("token");

const authnCodeService = new AuthorizationCodeService(authnCodeRepository);
const tokenService = new TokenService(tokenRepository);

router.post("/", [
  validateTokenParams,
  async function (req, res) {
    const { body } = req;

    try {
      const code = await authnCodeService.redeem(body.code, body.code_verifier);

      if (!code) {
        throw new Error("code not found");
      }

      const token = await tokenService.create({
        clientId: code.clientId,
        userId: code.userId,
      });

      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Pragma", "no-store");

      res.json({
        access_token: tokenService.signJWT(token),
        token_type: "Bearer",
        expires_in: 3600,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        error: "invalid_request",
        error_description: error.message || "Invalid request",
      });
    }
  },
]);

module.exports = router;
