const { authenticate } = require("../config/jwt.config");
const EventController = require("../controllers/event.controller");

module.exports = (app) => {
	app.post("/api/events/create", authenticate, EventController.createEvent);
	app.get("/api/events", EventController.getAllEvents);
	app.get("/api/events/user/:id", EventController.findAllEventsByUser);
	app.get("/api/events/:id", EventController.getOneEvent);
	app.put("/api/events/:id", authenticate, EventController.updateOneEvent);
	app.delete("/api/events/:id", authenticate, EventController.deleteOneEvent);
};