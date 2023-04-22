function validateRevokeParams(req, res, next) {
  const {
    body: { token },
  } = req;

  try {
    if (!token) {
      throw new Error("token is required");
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

module.exports = validateRevokeParams;
