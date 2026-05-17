const express = require("express");
const router = express.Router();
const Course = require("../models/course");

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Course route working");
});

// ✅ GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE COURSE
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
