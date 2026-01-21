const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/createEvent", createEvent);

router.post("/getEvent", getEvents);

router.get("/getEvent/:id", getEventById);

router.put("/updateEvent/:id", updateEvent);

router.delete("/deleteEvent/:id", deleteEvent);

module.exports = router;
