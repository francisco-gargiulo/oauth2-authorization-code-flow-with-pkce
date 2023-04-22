const { Router } = require("express");

const checkAuthorization = require("../middlewares/checkAuthorization");

const UserService = require("../domain/UserService");
const Repository = require("../infrastructure/Repository");

const repository = new Repository("user");

const userService = new UserService(repository);

const router = Router();

router.post("/", async function postUserController(req, res, next) {
  try {
    const newUser = await userService.create(req.body);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  checkAuthorization,
  async function getUserByIdController(req, res, next) {
    try {
      const user = await userService.findById(req.params.id);

      if (user === null) {
        res.sendStatus(404);
      } else {
        res.json(user);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkAuthorization,
  async function putUserController(req, res, next) {
    try {
      const updatedUser = await userService.update(req.body);

      if (updatedUser === null) {
        res.sendStatus(404);
      } else {
        res.json(updatedUser);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  checkAuthorization,
  async function deleteUser(req, res, next) {
    try {
      const result = await userService.delete(req.params.id);
      if (result === false) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
