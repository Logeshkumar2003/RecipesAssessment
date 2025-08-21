const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./utils/db");
const recipeRoutes = require("./routes/recipes");
const fs = require("fs");
const Recipe = require("./models/recipe");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

// Seed DB with JSON (one-time run)
async function seedDB() {
  if ((await Recipe.countDocuments()) === 0) {
    const raw = fs.readFileSync("US_recipes.json");
    const data = JSON.parse(raw);

    // Convert object with numeric keys into an array
    const arr = Object.values(data);

    const cleaned = arr.map((r) => ({
      ...r,
      rating: isNaN(r.rating) ? null : r.rating,
      prep_time: isNaN(r.prep_time) ? null : r.prep_time,
      cook_time: isNaN(r.cook_time) ? null : r.cook_time,
      total_time: isNaN(r.total_time) ? null : r.total_time,
    }));

    await Recipe.insertMany(cleaned);
    console.log("✅ DB Seeded with", cleaned.length, "recipes");
  }
}
seedDB();


app.use("/api/recipes", recipeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));