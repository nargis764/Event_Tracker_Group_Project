const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
	register: (req, res) => {
		const user = new User(req.body);

		user.save()
			.then((newUser) => {
				console.log(newUser);
				console.log("Registration successful!");
				res.json({
					successMessage: "Thank you for registering.",
					user: newUser,
				});
			})
			.catch((err) => {
				console.log("Registration unsuccussful!");
				res.status(400).json(err);
			});
	},

	login: (req, res) => {
		User.findOne({ email: req.body.email })
			.then((userRecord) => {
				if (userRecord === null) {
					res.status(400).json({ message: "Invalid Login Attempt" });
				} else {
					bcrypt
						.compare(req.body.password, userRecord.password)
						.then((isPasswordValid) => {
							if (isPasswordValid) {
								console.log("Password is Valid.");
								res.cookie(
									"usertoken",
									jwt.sign(
										{
											id: userRecord._id,
											email: userRecord.email,
											name: userRecord.name,
										},
										process.env.JWT_SECRET
									),
									{
										httpOnly: true,
										expires: new Date(Date.now() + 9000000000),
									}
								).json({
									message: "Succussfully logged in.",
									userLoggedIn: userRecord.name,
									userId: userRecord._id,
								});
							} else {
								res.status(400).json({ message: "Invalid Login Attempt" });
							}
						})
						.catch((err) => {
							console.log(err);
							res.status(400).json({ message: "Invalid Login Attempt" });
						});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json({ message: "Invalid Login Attempt" });
			});
	},

	logout: (req, res) => {
		console.log("Logging Out");
		res.clearCookie("usertoken");
		res.json({
			message: "You have succussfully logged out.",
		});
	},

	getLoggedInUser: (req, res) => {
		User.findOne({ _id: req.jwtpayload.id })
			.then((user) => {
				console.log(user);
				res.json(user);
			})
			.catch((err) => {
				console.log(err);
			});
	},
};