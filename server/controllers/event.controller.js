const Event = require("../models/event.model");

module.exports = {
	createEvent: (req, res) => {
		const newEventObject = new Event(req.body);
		// console.log(req);
		newEventObject.createdBy = req.jwtpayload.id;
		newEventObject
			.save()
			.then((event) => {
				return res.json(event);
			})
			.catch((err) => {
				return res.status(400).json(err);
			});
	},

	getAllEvents: (req, res) => {
		Event.find({})
			.populate("createdBy", "name")
			.then((events) => {
				res.json(events);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong finding all the events.", error: err });
			});
	},
	findAllEventsByUser: (req, res) => {
		Event.find({ createdBy: req.params.id })
			.populate("createdBy", "name")
			.then((events) => {
				res.json(events);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong finding all the events.", error: err });
			});

		// if (req.jwtpayload.id !== req.params.createdBy) {
		// 	console.log("not the user");
		// 	User.findOne({ _id: req.params.createdBy })
		// 		.then((userNotLoggedIn) => {
		// 			Event.find({ postedBy: userNotLoggedIn._id })
		// 				.populate("postedBy", "username")
		// 				.then((allEventsByUser) => {
		// 					// console.log(allEventsByUser)
		// 					res.json(allEventsByUser);
		// 				})
		// 				.catch((err) => {
		// 					console.log(err);
		// 					res.status(400).json(err);
		// 				});
		// 		})
		// 		.catch((err) => {
		// 			console.log(err);
		// 			res.status(400).json(err);
		// 		});
		// } else {
		// 	console.log("current user");
		// 	console.log("req.jwtpayload.id:", req.jwtpayload.id);
		// 	Trip.find({ postedBy: req.jwtpayload.id })
		// 		.populate("postedBy", "username email")
		// 		.then((allEventsByLoggedInUser) => {
		// 			// console.log(allEventsByLoggedInUser)
		// 			res.json(allEventsByLoggedInUser);
		// 		})
		// 		.catch((err) => {
		// 			console.log(err);
		// 			res.status(400).json(err);
		// 		});
		// }
	},

	getOneEvent: (req, res) => {
		Event.find({ _id: req.params.id })
			.populate({
				path: "going",
				populate: { path: "createdBy" },
			})
			.populate({
				path: "interested",
				populate: { path: "createdBy" },
			})
			.then((event) => {
				return res.json(event);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong finding that event.", error: err });
			});
	},

	updateOneEvent: (req, res) => {
		// console.log(req.body);
		Event.findOneAndUpdate({ createdBy: req.jwtpayload.id, _id: req.params.id }, req.body, { new: true, runValidators: true })
			.then((event) => {
				return res.json(event);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong updating that event.", error: err });
			});
	},

	deleteOneEvent: (req, res) => {
		// console.log(req.params.id);
		Event.deleteOne({ createdBy: req.jwtpayload.id, _id: req.params.id })
			.then((deleted) => {
				return res.json(deleted);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong deleting that event.", error: err });
			});
	},
};