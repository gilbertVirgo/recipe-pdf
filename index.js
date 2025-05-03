const express = require("express");
const app = express();

// Import routes
const recipeRoutes = require("./routes/recipeRoutes");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Use recipe routes
app.use("/", recipeRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server running at http://localhost:${process.env.PORT}`);
});
