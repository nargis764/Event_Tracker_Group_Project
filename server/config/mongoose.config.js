const mongoose = require("mongoose");

mongoose
	.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log(`Established a connection to the ${process.env.DB_NAME} database.`))
	.catch((err) => console.log("Something went wrong connecting to the database.", err));