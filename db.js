const mongoose = require("mongoose");

// The Schema defines the "shape" of your data. Think of it as the blueprint for your table.
const recipeSchema = new mongoose.Schema({
  name: String,
  descShort: String,
  category: String,
  ingredients: [String],
  cooking_method: String,
});

// The Model is the actual object you use to talk to the DB (find, save, delete).
// "Recipe" is the name in your code, "recipes-data" is the actual collection name in Atlas.
const Recipe = mongoose.model("Recipe", recipeSchema, "recipes-data");

// Simplified "KISS" connection logic
const connectionString = (process.env.DATABASE_URL || "")
  .trim()
  .replace(/^["']|["']$/g, "");

if (!connectionString) {
  console.error("CRITICAL ERROR: DATABASE_URL not found in .env file.");
} else {
  mongoose
    .connect(connectionString, {
      dbName: "wings-recipes",
      authSource: "admin",
    })
    .catch((err) => console.error("MongoDB Connection Error:", err.message));
}

module.exports = Recipe;
