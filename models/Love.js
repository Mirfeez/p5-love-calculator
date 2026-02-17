const mongoose = require("mongoose");

const loveSchema = new mongoose.Schema({
	him: { type: String, required: true },
	her: { type: String, required: true },
	score: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Love", loveSchema);
