const axios = require("axios");

function checkAuthorization(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(403);
  }

  const [tokenType, token] = authHeader.split(" ");

  if (tokenType !== "Bearer") {
    res.setHeader("WWW-Authenticate", "Bearer realm=protected-resource");

    return res.sendStatus(401);
  }

  if (!token) {
    res.setHeader("WWW-Authenticate", "Bearer realm=protected-resource");

    return res.sendStatus(401);
  }

  axios
    .post("http://localhost:3000/oauth2/introspect", {
      token,
    })
    .then((response) => {
      if (response.data.active) {
        const { aud, sub } = response.data;

        if (aud !== "protected-resource") {
          res.setHeader("WWW-Authenticate", "Bearer realm=protected-resource");

          return res.sendStatus(401);
        }

        if (sub !== req.params.id) {
          res.setHeader("WWW-Authenticate", "Bearer realm=protected-resource");

          return res.sendStatus(401);
        }

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((error) => {
      console.error(error);

      res.sendStatus(500);
    });
}

module.exports = checkAuthorization;
