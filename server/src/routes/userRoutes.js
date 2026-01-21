const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/userController");

router.get("/getAllUsers", getAllUsers);
router.post("/createUser", createUser);

module.exports = router;
