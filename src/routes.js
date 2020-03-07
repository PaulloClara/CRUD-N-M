const router = require("express").Router();

const authMiddleware = require("./middlewares/auth");

const userController = require("./controllers/user");
const otherController = require("./controllers/other");

// user
router.post("/login", userController.login);
router.post("/register", userController.register);

router.get("/user", authMiddleware, userController.getUser);
router.get("/users", userController.getUsers);

router.put("/user", authMiddleware, userController.update);
router.put("/user/password", authMiddleware, userController.updatePassword);

router.delete("/user", authMiddleware, userController.delete);

// other
router.get("/", otherController.home);

module.exports = {
  config(app) {
    app.use(router);
  }
};
