const checkAuthentication = (req, res, next) => {
  const {
    session: { user },
  } = req;

  if (!user) {
    const loginURL = new URL("http://localhost:3000/oauth2/authenticate");

    return res.redirect(loginURL);
  }

  next();
};

module.exports = checkAuthentication;
