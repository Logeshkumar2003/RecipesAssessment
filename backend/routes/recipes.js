const express = require("express");
const Recipe = require("../models/recipe");
const router = express.Router();

// GET /api/recipes (pagination + sorting)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  const total = await Recipe.countDocuments();
  const data = await Recipe.find()
    .sort({ rating: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ page, limit, total, data });
});

// GET /api/recipes/search
router.get("/search", async (req, res) => {
  const { title, cuisine, total_time, rating, calories } = req.query;
  const query = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (cuisine) query.cuisine = cuisine;
  if (total_time) query.total_time = { $lte: parseInt(total_time) };
  if (rating) query.rating = { $gte: parseFloat(rating) };
  if (calories) query["nutrients.calories"] = { $lte: parseInt(calories) };

  const data = await Recipe.find(query);
  res.json({ data });
});

module.exports = router;
