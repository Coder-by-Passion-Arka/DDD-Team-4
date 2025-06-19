import mongoose, { Schema, Document, Types, model } from "mongoose";

// 1. Define an interface for individual submission
interface ISubmission {
  student: Types.ObjectId;
  submittedOn?: Date;
}

// 2. Define the Assignment document interface
export interface IAssignment extends Document {
  title: string;
  description: string;
  points?: number;
  date?: Date;
  deadline: Date;
  submittedBy: ISubmission[];
}

// 3. Define schema for individual submissions
const submissionSchema = new Schema<ISubmission>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submittedOn: {
    type: Date,
    default: null,
  },
});

// 4. Define the main Assignment schema
const assignmentSchema = new Schema<IAssignment>({
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
  points: {
    type: Number,
  },
  date: {
    type: Date,
  },
  deadline: {
    type: Date,
    required: true,
  },
  submittedBy: {
    type: [submissionSchema], // Array of submission objects
    validate: {
      validator: function (v: ISubmission[]) {
        return v.length >= 1 && v.length <= 10;
      },
      message: "SubmittedBy must have between 1 and 10 entries.",
    },
    required: true,
  },
});

// 5. Export the model
const Assignment = model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;
