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
      const decodedJWT = tokenService.decodeJWT(body.token);

      if (!decodedJWT) {
        throw new Error("Invalid token");
      }

      await tokenService.delete(decodedJWT.jti);

      // invalidate session

      console.log(req.session.user);
      req.session.user = null;

      req.session.regenerate(() => {
        console.log("Session regenerated");
      });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);

      res.sendStatus(400);
    }
  },
]);

module.exports = router;
