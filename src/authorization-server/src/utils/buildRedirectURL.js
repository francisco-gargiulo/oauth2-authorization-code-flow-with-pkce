function buildRedirectURL(client, code, state) {
  const redirectURL = new URL(client.redirectUri);

  redirectURL.searchParams.append("code", code);

  if (state) {
    redirectURL.searchParams.append("state", state);
  }

  return redirectURL;
};

module.exports = buildRedirectURL;
