const { Router } = require("express");

const UserService = require("../domain/services/UserService");
const Repository = require("../infrastructure/Repository");

const repository = new Repository("user");

const userService = new UserService(repository);

const router = Router();

router.get("/", async function getUsersController(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function getUserByIdController(req, res, next) {
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
});

router.post("/", async function postUserController(req, res, next) {
  try {
    const newUser = await userService.create(req.body);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async function putUserController(req, res, next) {
  try {
    const updatedUser = await userService.update(req.params.id, req.body);

    if (updatedUser === null) {
      res.sendStatus(404);
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function deleteUser(req, res, next) {
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
});

module.exports = router;
