import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema({
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
  points: Number,
  date: Date,
  deadline: {
    type: Date,
    required: true,
  },
  submittedBy: {
    type: Array,
    required: true,
    minlength: 1,
    maxlength: 10,
    students: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      submittedOn: Date,
    },
  },
});

export default mongoose.model("Assignment", assignmentSchema);