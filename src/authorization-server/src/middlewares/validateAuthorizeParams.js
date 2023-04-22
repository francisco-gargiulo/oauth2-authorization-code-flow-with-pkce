const validateAuthorizeParams = (req, res, next) => {
  const {
    query: { response_type, client_id, state, code_challenge },
    session,
  } = req;

  try {
    if (!response_type) {
      throw new Error("response_type is required");
    }

    if (!client_id) {
      throw new Error("client_id is required");
    }

    session.params = {
      response_type,
      client_id,
      state,
      code_challenge,
    };

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: "invalid_request",
      error_description: error.message || "Invalid request",
    });
  }
};

module.exports = validateAuthorizeParams;
