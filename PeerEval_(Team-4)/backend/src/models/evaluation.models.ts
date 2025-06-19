import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  asignedOn: {
    type: Date,
    required: true,
  },
  deadline: Date,
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
  submittedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
});

export default mongoose.model("Evaluation", evaluationSchema);
