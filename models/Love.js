const mongoose = require("mongoose");

const loveSchema = new mongoose.Schema({
	hisName: String,
	herName: String,
	score: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Love", loveSchema);
