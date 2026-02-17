require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const Love = require("./models/Love");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/admin", (req, res) => {
	res.render("admin");
});

app.post("/admin-login", (req, res) => {
	if (req.body.password === process.env.ADMIN_PASSWORD) {
		res.json({ success: true });
	} else {
		res.json({ success: false });
	}
});

app.post("/save-result", async (req, res) => {
	try {
		const { him, her, score } = req.body;

		const newResult = new Love({
			him,
			her,
			score,
		});

		await newResult.save();

		res.json({ message: "Saved successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error saving" });
	}
});

app.get("/admin-data", async (req, res) => {
	try {
		const data = await Love.find().sort({ date: -1 });
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: "Error fetching data" });
	}
});


app.delete("/delete-result/:id", async (req, res) => {
	try {
		await Love.findByIdAndDelete(req.params.id);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false });
	}
});

app.get("/how-it-works", (req, res) => {
	res.render("how-it-works");
});


app.listen(port, () => {
	console.log('server is running,', process.env.PORT)
});
