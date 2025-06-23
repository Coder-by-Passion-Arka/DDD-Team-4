// import mongoose from "mongoose";

// const submissionSchema = new mongoose.Schema(
//   {
//     assignment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Assignment",
//       required: true,
//     },
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     submissionText: {
//       type: String,
//       maxlength: 5000,
//       required: false,
//     },
//     submissionFiles: [
//       {
//         fileName: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         fileUrl: {
//           type: String,
//           required: true,
//         },
//         fileSize: {
//           type: Number, // in bytes
//           required: true,
//           min: 0,
//           max: 50 * 1024 * 1024, // 50MB limit
//         },
//         mimeType: {
//           type: String,
//           required: true,
//         },
//         uploadedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     submittedAt: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     isLate: {
//       type: Boolean,
//       default: false,
//     },
//     grade: {
//       type: Number,
//       min: 0,
//       max: 100,
//       required: false,
//     },
//     feedback: {
//       type: String,
//       maxlength: 1000,
//       required: false,
//     },
//     gradedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Teacher who graded
//       required: false,
//     },
//     gradedAt: {
//       type: Date,
//       required: false,
//     },
//     status: {
//       type: String,
//       enum: ["submitted", "graded", "returned", "resubmitted"],
//       default: "submitted",
//     },
//     attempts: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     maxAttempts: {
//       type: Number,
//       default: 1,
//       min: 1,
//       max:3,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes for better performance
// submissionSchema.index({ assignment: 1, student: 1 });
// submissionSchema.index({ student: 1 });
// submissionSchema.index({ submittedAt: -1 });

// // Ensure unique submission per student per assignment (unless multiple attempts allowed)
// submissionSchema.index(
//   { assignment: 1, student: 1, attempts: 1 },
//   { unique: true }
// );

// // Checking if submission can be resubmitted
// submissionSchema.virtual('canResubmit').get(function() {
//   return this.attempts < this.maxAttempts;
// });

// // Pre-save middleware to check if submission is late
// submissionSchema.pre('save', async function(next) {
//   if (this.isNew && this.assignment) {
//     try {
//       const assignment = await mongoose.model('Assignment').findById(this.assignment);
//       if (assignment && assignment.dueDate) {
//         this.isLate = this.submittedAt > assignment.dueDate;
//       }
//     } catch (error) {
//       console.error('Error checking due date:', error);
//     }
//   }
//   next();
// });


// export default mongoose.model("Submission", submissionSchema);

// ================================ // 

import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Submission content is required"],
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        originalName: String,
        url: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "evaluated", "returned"],
      default: "draft",
    },
    submittedAt: {
      type: Date,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
    evaluations: [
      {
        evaluationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Evaluation",
        },
        evaluatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        score: Number,
        feedback: String,
        evaluatedAt: Date,
      },
    ],
    finalScore: {
      type: Number,
      min: 0,
    },
    finalGrade: {
      type: String,
      enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"],
    },
    feedback: {
      instructor: String,
      peer: [String],
      automated: String,
    },
    plagiarismCheck: {
      status: {
        type: String,
        enum: ["pending", "checked", "flagged"],
        default: "pending",
      },
      score: Number,
      report: String,
      checkedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ assignmentId: 1, userId: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;