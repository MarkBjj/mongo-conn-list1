// Load environment variables from .env file
const { MongoClient } = require("mongodb");
require("dotenv").config();

const express = require("express");
const Recipe = require("./db");
const cors = require("cors");

const app = express(); // Initialize the Express framework
const PORT = 3000;

app.use(cors()); // Allows your browser (Live Server) to talk to this backend.
app.use(express.json()); // Allows the server to read JSON data sent in the body of a POST request.

// GET Route: Fetches all recipes from the database
app.get("/recipes", async (req, res) => {
  try {
    // Recipe.find({}) is the Mongoose version of "SELECT * FROM recipes"
    const results = await Recipe.find({}).sort({ name: 1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 means "Internal Server Error"
  }
});

// POST Route: Receives new recipe data from your form and saves it to Atlas
app.post("/recipes", async (req, res) => {
  try {
    // Create a new instance of the Recipe model using the data from the request body
    const newRecipe = new Recipe({
      name: req.body.name,
      descShort: req.body.descShort,
      category: req.body.category,
      ingredients: req.body.ingredients,
      cooking_method: req.body.cooking_method,
    });
    const savedRecipe = await newRecipe.save(); // The actual save command to the DB
    res.json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE Route: Removes a recipe based on its unique MongoDB ID
app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(
    `[${new Date().toLocaleTimeString()}] Server active at http://localhost:${PORT}`,
  ),
);
