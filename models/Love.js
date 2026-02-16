const mongoose = require("mongoose");

const loveSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	him: String,
	her: String,
	score: Number,
});

module.exports = mongoose.model("Love", loveSchema);
