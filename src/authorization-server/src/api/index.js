const { Router } = require("express");

const authorizeRouter = require("./authorize");
const authenticateRouter = require("./authenticate");
const tokenRouter = require("./token");
const introspectRouter = require("./introspect");
const usersRouter = require("./users");
const revokeRouter = require("./revoke");

const router = Router();

router.use("/authorize", authorizeRouter);
router.use("/authenticate", authenticateRouter);
router.use("/token", tokenRouter);
router.use("/introspect", introspectRouter);
router.use("/revoke", revokeRouter);
router.use("/users", usersRouter);

module.exports = router;
