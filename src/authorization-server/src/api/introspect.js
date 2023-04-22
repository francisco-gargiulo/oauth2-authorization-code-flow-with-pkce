const { Router } = require("express");

const validateIntrospectParams = require("../middlewares/validateIntrospectParams");

const TokenService = require("../domain/services/TokenService");
const Repository = require("../infrastructure/Repository");

const router = new Router();

const tokenRepository = new Repository("token");
const tokenService = new TokenService(tokenRepository);

router.post("/", [
  validateIntrospectParams,
  async function (req, res) {
    const { body } = req;

    try {
      const verifiedToken = tokenService.verifyJWT(body.token);

      const token = await tokenService.findById(verifiedToken.jti);

      let active = false;
      if (token) {
        active = true;
      }

      res.json({
        active,
        ...verifiedToken,
      });
    } catch (error) {
      res.json({
        active: false,
      });
    }
  },
]);

module.exports = router;
