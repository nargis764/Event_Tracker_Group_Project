const Interest = require("../models/interest.model");
const Event = require("../models/event.model");

module.exports = {
	createInterest: (req, res) => {
		const newInterestObject = new Interest(req.body);
		const id = req.params.eventId;
		newInterestObject.event = id;
		newInterestObject.createdBy = req.jwtpayload.id;

		Event.findById(id) // finds the event that will get updated
			.populate("createdBy", "name")
			.then((event) => {
				// looks at the type of interest then pushes it to the array of the event.
				if (newInterestObject.interested) {
					event.interested
						.push(newInterestObject._id)
						.then(event.save())
						.catch((err) => console.log(err));
				} else {
					event.going
						.push(newInterestObject._id)
						.then(event.save())
						.catch((err) => console.log(err));
				}
				event.save((err) => {
					if (err) {
						console.log(err);
					}
				});
			})

			.catch((err) => {});

		newInterestObject
			.save()
			.then((interest) => {
				return res.json(interest);
			})
			.catch((err) => {
				return res.status(400).json(err);
			});
	},

	getAllInterests: (req, res) => {
		const id = req.params.eventId;
		console.log(id);
		Interest.find({})
			.populate("createdBy", "name")
			.populate("event")
			.then((interests) => {
				res.json(interests);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong finding who is going to this event.", error: err });
			});
	},

	updateOneInterest: (req, res) => {
		console.log(req.body);
		Interest.findOneAndUpdate({ createdBy: req.jwtpayload.id, _id: req.params.id }, req.body, { new: true, runValidators: true })
			.then((interest) => {
				return res.json(interest);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong updating.", error: err });
			});
	},

	deleteOneInterest: (req, res) => {
		console.log(req.params.id);
		Interest.deleteOne({ createdBy: req.jwtpayload.id, _id: req.params.id })
			.then((deleted) => {
				return res.json(deleted);
			})
			.catch((err) => {
				return res.status(400).json({ message: "Something went wrong updating.", error: err });
			});
	},
};