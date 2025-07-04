// import mongoose from "mongoose";

// const evaluationSchema = new mongoose.Schema(
//   {
//     courseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     assignmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Assignment",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       maxlength: 100,
//       trim: true,
//     },
//     description: {
//       type: String,
//       maxlength: 1000,
//       trim: true,
//     },
//     totalPoints: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 1000,
//     },
//     assignedOn: {
//       // Fixed typo from 'asignedOn'
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     deadline: {
//       type: Date,
//       required: true,
//     },
//     studentsEnrolled: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User", // Changed from "Student" to "User"
//         required: true,
//       },
//     ],
//     submissions: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User", // Changed from "Student" to "User"
//           required: true,
//         },
//         submissionId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Submission",
//         },
//         submittedOn: {
//           type: Date,
//         },
//         grade: {
//           type: Number,
//           min: 0,
//           max: 100,
//         },
//         feedback: {
//           type: String,
//           maxlength: 1000,
//         },
//         isLate: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//     evaluationType: {
//       type: String,
//       enum: ["assignment", "quiz", "exam", "project", "presentation"],
//       default: "assignment",
//     },
//     allowLateSubmission: {
//       type: Boolean,
//       default: false,
//     },
//     latePenalty: {
//       type: Number, // Percentage penalty per day
//       min: 0,
//       max: 100,
//       default: 0,
//     },
//     maxAttempts: {
//       type: Number,
//       min: 1,
//       max: 10,
//       default: 1,
//     },
//     isPublished: {
//       type: Boolean,
//       default: false,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes for better performance
// evaluationSchema.index({ courseId: 1 });
// evaluationSchema.index({ assignmentId: 1 });
// evaluationSchema.index({ deadline: 1 });
// evaluationSchema.index({ createdBy: 1 });

// // Virtual for submission count
// evaluationSchema.virtual("submissionCount").get(function () {
//   return this.submissions.length;
// });

// // Virtual for enrollment count
// evaluationSchema.virtual("enrollmentCount").get(function () {
//   return this.studentsEnrolled.length;
// });

// // Virtual for checking if evaluation is overdue
// evaluationSchema.virtual("isOverdue").get(function () {
//   return new Date() > this.deadline;
// });

// export default mongoose.model("Evaluation", evaluationSchema);

// ============================== // 
import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    evaluatedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    scores: [
      {
        criteriaName: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        maxScore: {
          type: Number,
          required: true,
        },
        feedback: String,
      },
    ],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
    maxTotalScore: {
      type: Number,
      required: true,
    },
    overallFeedback: {
      type: String,
      required: [true, "Overall feedback is required"],
      trim: true,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"],
    },
    evaluationType: {
      type: String,
      enum: ["peer", "instructor", "self"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed", "final"],
      default: "draft",
    },
    evaluatedAt: {
      type: Date,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
evaluationSchema.index({ evaluatedUserId: 1, createdAt: -1 });
evaluationSchema.index({ evaluatorId: 1, createdAt: -1 });
evaluationSchema.index({ assignmentId: 1 });

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;