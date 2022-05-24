const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const ytdlController = require("../controllers/ytdl-controller");
const roomController = require("../controllers/room-controller");
const broadcastController = require("../controllers/broadcast-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/registration",
  body("username").isLength({ min: 4, max: 12 }),
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.get("/listen", authMiddleware, ytdlController.listen);
router.post("/rooms/create", authMiddleware, roomController.create);
router.get("/rooms", roomController.getRooms);
router.get("/play/:room", broadcastController.play);

module.exports = router;
