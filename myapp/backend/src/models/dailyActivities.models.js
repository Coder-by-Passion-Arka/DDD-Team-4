import mongoose from "mongoose";

// This mongoose schema is used to keep a track of the daily activities of the students. //

const dailyActivitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity: [
    {
      activityType: String,
      required: true,
      duration: Number,
      comment: String,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("DailyActivity", dailyActivitySchema);
