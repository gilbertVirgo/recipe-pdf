const express = require("express");
const app = express();

// Import routes
const recipeRoutes = require("./routes/recipeRoutes");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Use recipe routes
app.use("/", recipeRoutes);

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server running at http://localhost:${process.env.PORT}`);
});
