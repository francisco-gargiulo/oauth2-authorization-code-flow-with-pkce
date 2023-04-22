function validateTokenParams(req, res, next) {
  const {
    body: { code, grant_type, code_verifier },
  } = req;

  try {
    if (!grant_type) {
      throw new Error("grant_type is required");
    }

    if (!code) {
      throw new Error("code is required");
    }

    if (!code_verifier) {
      throw new Error("code_verifier is required");
    }

    next();
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: "invalid_request",
      error_description: error.message || "Invalid request",
    });
  }
}

module.exports = validateTokenParams;
