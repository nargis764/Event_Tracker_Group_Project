const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interestSchema = new Schema(
	{
		interested: {
			type: Boolean,
		},
		going: {
			type: Boolean,
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Interested", interestSchema);