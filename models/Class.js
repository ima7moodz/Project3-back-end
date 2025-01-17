const mongoose = require("mongoose")

const classSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classStyle: {
      type: String,
      enum: ["kick boxing", "boxing", "muay thai", "grappling", "kowat alrami"],
      required: true,
    },
    duration: { type: Number, required: true }, //duration in minutes
    time: { type: Date, required: true },
    traineesInClass: { type: Number },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Class", classSchema)
