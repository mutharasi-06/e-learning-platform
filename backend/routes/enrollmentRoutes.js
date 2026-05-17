const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const auth = require("../middleware/authMiddleware");

/* =========================
   TEST ROUTE (IMPORTANT)
========================= */
router.get("/test", (req, res) => {
  res.send("Enrollment route working");
});

/* =========================
   ENROLL IN COURSE
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId required" });
    }

    const exists = await Enrollment.findOne({ userId, courseId });
    if (exists) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      progress: 0
    });

    res.json({
      message: "Enrollment successful",
      enrollment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   MY COURSES
========================= */
router.get("/my", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.user.id
    }).populate("courseId");

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE PROGRESS
========================= */
router.put("/progress/:id", auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { progress: req.body.progress },
      { new: true }
    );

    res.json({
      message: "Progress updated",
      enrollment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
