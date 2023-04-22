const axios = require("axios");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

require("./authorization-server");
require("./protected-resource");
require("./client");

const user = {
  id: "1",
  name: "John Doe",
  nickname: "johndoe",
  email: "user@domain.com",
};

const client = {
  id: "client-id",
  redirectUri: "http://localhost:3000/callback.html",
  secret: "s3cr3t",
  name: "Example client",
};

(async function () {
  try {
    const baseURL = "http://localhost:3000";

    let response;

    response = await axios({
      method: "get",
      url: "/.well-known",
      baseURL,
    });

    const {
      authorization_endpoint: authorizationEndpoint,
      token_endpoint: tokenEndpoint,
      revocation_endpoint: revocationEndpoint,
    } = response.data;

    // Generate a code verifier and code challenge
    const codeVerifier = crypto
      .randomBytes(8)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const codeChallenge = codeVerifier;

    const params = {
      client_id: client.id,
      response_type: "code",
      state: "xyz",
      code_challenge: codeChallenge,
    };

    response = await axios({
      method: "get",
      url: authorizationEndpoint,
      params,
      headers: {
        Cookie: response.headers["set-cookie"],
      },
    });

    response = await axios({
      method: "POST",
      url: "/oauth2/authenticate",
      baseURL,
      headers: {
        Cookie: response.request.getHeader("Cookie"),
      },
      data: {
        email: user.email,
      },
    });

    const code = new URL(response.request.path, baseURL).searchParams.get(
      "code"
    );

    response = await axios({
      method: "post",
      url: tokenEndpoint,
      data: {
        grant_type: "authorization_code",
        code,
        code_verifier: codeVerifier,
      },
    });

    const token = response.data.access_token;

    const decodedToken = jwt.decode(token);

    response = await axios({
      method: "get",
      url: `/api/users/${decodedToken.sub}`,
      baseURL: "http://localhost:4000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        token,
      },
    });

    response = await axios({
      method: "post",
      url: revocationEndpoint,
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
})();
