const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express"),
	swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/", (req, res) => {
	res.send("WELCOME !!!");
});

app.get("/api/hi", (req, res) => {
	res.send("Hello Ozodbek !!!");
});

try {
	app.post("/api/login", (req, res) => {
		try {
			const token = jwt.sign(req.body.username, "MY-SECRET-KEY");
			res.send({ ...req.body, TOKEN: token });
		} catch (error) {
			console.log(error);
			res.send("BITTA ERROR TUG'ILDI !!!");
		}
	});
} catch (error) {
	res.send("BITTA ERROR TUG'ILDI !!!");
	console.log("BITTA ERROR TUG'ILDI !!!");
}

app.listen(7000, () => {
	console.log("listening on port 7000");
});
