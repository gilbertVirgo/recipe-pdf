const express = require("express");
const router = express.Router();
const ejs = require("ejs"),
	fs = require("fs");
const path = require("path");
const randomstring = require("randomstring");
const { execSync } = require("child_process");

// Middleware to parse URL-encoded bodies
router.use(express.urlencoded({ extended: true }));

// Route to render the form template
router.get("/", (req, res) => {
	res.render("index");
});

// POST route to handle form submission and generate HTML
router.post("/pdf", async (req, res) => {
	const {
		title,
		portions,
		prepTime,
		cookingTime,
		ingredients,
		method,
		notes,
	} = req.body;

	let template = fs.readFileSync(
			path.join(__dirname, "..", "views", "pdf.ejs"),
			"utf8"
		),
		HTMLFileContents = ejs.render(template, {
			title,
			portions,
			prepTime,
			cookingTime,
			ingredients: ingredients
				.split("\n")
				.map((item) => `<li>${item}</li>`)
				.join(""),
			method: method
				.split("\n")
				.map((step) => `<li>${step}</li>`)
				.join(""),
			notes,
		}),
		generatedFileKey = randomstring.generate({
			length: 12,
			charset: "alphabetic",
		}),
		generatedPDFsDirectoryPath = path.join(
			__dirname,
			"..",
			"generatedPDFs"
		),
		generatedHTMLFilePath = path.join(
			generatedPDFsDirectoryPath,
			generatedFileKey + ".html"
		),
		generatedPDFFilePath = path.join(
			generatedPDFsDirectoryPath,
			generatedFileKey + ".pdf"
		);

	fs.writeFileSync(generatedHTMLFilePath, HTMLFileContents);

	try {
		execSync(
			`cd ${process.env.ROOT_URI}/generatedPDFs; npx html-export-pdf-cli ./` +
				generatedFileKey +
				".html" +
				" -s A5 -l -o ./" +
				generatedFileKey +
				".pdf"
		);
	} catch (error) {
		console.error("Error generating PDF:", error);
		res.status(500).send("Failed to generate PDF");
		return;
	}

	res.setHeader("Content-Type", "application/pdf");
	res.download(generatedPDFFilePath);

	// Render the pdf.ejs view with the form data
	// res.render("pdf", {
	// 	title,
	// 	portions,
	// 	prepTime,
	// 	cookingTime,
	// 	ingredients: ingredients
	// 		.split("\n")
	// 		.map((item) => `<li>${item}</li>`)
	// 		.join(""),
	// 	method: method
	// 		.split("\n")
	// 		.map((step) => `<li>${step}</li>`)
	// 		.join(""),
	// 	notes,
	// });
});

module.exports = router;
