const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("hello");
});

app.listen(7000, () => {
	console.log("listening on port 7000");
});
