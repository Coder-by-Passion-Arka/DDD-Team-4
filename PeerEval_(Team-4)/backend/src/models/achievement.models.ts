import mongoose from "mongoose";

const achivementsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  date: {
    type: Date,
    required: true,
  },
  achievementHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Achievement", achivementsSchema);
