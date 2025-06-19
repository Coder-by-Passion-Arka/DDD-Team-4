import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionText: {
      type: String,
      maxlength: 5000,
      required: false,
    },
    submissionFiles: [
      {
        fileName: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number, // in bytes
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
      required: false,
    },
    feedback: {
      type: String,
      maxlength: 1000,
      required: false,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teacher who graded
      required: false,
    },
    gradedAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "returned", "resubmitted"],
      default: "submitted",
    },
    attempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ student: 1 });
submissionSchema.index({ submittedAt: -1 });

// Ensure unique submission per student per assignment (unless multiple attempts allowed)
submissionSchema.index(
  { assignment: 1, student: 1, attempts: 1 },
  { unique: true }
);

export default mongoose.model("Submission", submissionSchema);
