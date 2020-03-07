const router = require("express").Router();

const authMiddleware = require("./middlewares/auth");

const userController = require("./controllers/user");
const otherController = require("./controllers/other");

// user
router.post("/login", userController.login);
router.post("/register", userController.register);

router.get("/users", userController.index);
router.get("/users/:username", authMiddleware, userController.show);

router.put("/users", authMiddleware, userController.update);
router.put("/users/password", authMiddleware, userController.updatePassword);

router.delete("/users", authMiddleware, userController.destroy);

// other
router.get("/", otherController.index);

module.exports = {
  config(app) {
    app.use(router);
  }
};
