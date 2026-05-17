const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");
const auth = require("../middleware/authMiddleware");

/* =========================
   GENERATE CERTIFICATE
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      progress: 100
    });

    if (!enrollment) {
      return res.status(400).json({
        message: "Course not completed"
      });
    }

    const existing = await Certificate.findOne({ userId, courseId });
    if (existing) {
      return res.json({
        message: "Certificate already generated",
        certificate: existing
      });
    }

    const certificate = await Certificate.create({
      userId,
      courseId
    });

    res.json({
      message: "Certificate generated successfully",
      certificate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET MY CERTIFICATES ✅
========================= */
router.get("/my", auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: req.user.id
    }).populate("courseId", "title category difficulty");

    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
