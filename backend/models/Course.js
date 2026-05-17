const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  difficulty: String,
  thumbnailUrl: String,
  lessons: [
    {
      title: String,
      contentHtml: String,
      videoUrl: String,
      order: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", courseSchema);
