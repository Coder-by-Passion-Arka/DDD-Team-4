import mongoose, { Schema, Document, Types, model } from "mongoose";

// 1. Define the TypeScript interface for the Evaluation document
export interface IEvaluation extends Document {
  courseId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  grade: number;
  asignedOn: Date;
  deadline?: Date;
  studentsEnrolled: Types.ObjectId[];
  submittedBy: Types.ObjectId[];
}

// 2. Define the Evaluation schema
const evaluationSchema = new Schema<IEvaluation>({
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
  deadline: {
    type: Date,
  },
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

// 3. Export the model
const Evaluation = model<IEvaluation>("Evaluation", evaluationSchema);
export default Evaluation;
