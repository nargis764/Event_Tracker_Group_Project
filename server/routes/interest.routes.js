const { authenticate } = require("../config/jwt.config");
const InterestController = require("../controllers/interest.controller");

module.exports = (app) => {
	app.post("/api/events/:eventId/interests/create", authenticate, InterestController.createInterest);
	app.get("/api/interests", InterestController.getAllInterests);
	app.put("/api/events/:eventId/interests/:id", authenticate, InterestController.updateOneInterest);
	app.delete("/api/events/:eventId/interests/:id", authenticate, InterestController.deleteOneInterest);
};