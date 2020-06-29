const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const userValidate = require("../validate/user.validate");
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });

router.get("/", usersController.index);
router.get("/create", usersController.create);
router.post(
  "/create",
  upload.single("avatar"),
  userValidate.postCreate,
  usersController.postCreate
);
router.get("/:id/delete", usersController.delete);
router.get("/search", usersController.search);

module.exports = router;
