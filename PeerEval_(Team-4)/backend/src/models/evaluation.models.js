import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    submitterId: {
      // The student who submitted the assignment
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    evaluatorId: {
      // The student assigned to evaluate this submission
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true, // One evaluation per submission
    },
    // Evaluation criteria and scores
    scores: [
      {
        criteriaName: {
          type: String,
          required: true,
          trim: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        maxScore: {
          type: Number,
          required: true,
          min: 1,
        },
        feedback: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        _id: false, // Disable _id for subdocuments
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
      min: 1,
    },
    overallFeedback: {
      type: String,
      required: [true, "Overall feedback is required"],
      trim: true,
      maxlength: 1000,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"],
    },
    evaluationType: {
      type: String,
      enum: ["peer", "instructor", "self"],
      required: true,
      default: "peer",
    },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "submitted", "reviewed", "finalized"],
      default: "assigned",
      index: true,
    },
    assignedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true, // Default to anonymous peer evaluation
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    // Graph coloring assignment data
    assignmentMetadata: {
      colorGroup: {
        type: Number,
        index: true,
      },
      assignmentRound: {
        type: Number,
        default: 1,
      },
      priority: {
        type: Number,
        default: 0,
      },
    },
    // Quality assurance
    qualityFlags: {
      isIncomplete: {
        type: Boolean,
        default: false,
      },
      isDisputed: {
        type: Boolean,
        default: false,
      },
      needsReview: {
        type: Boolean,
        default: false,
      },
      reviewNotes: String,
    },
  },
  {
    timestamps: true,
  }
);

// ======== INDEXES ======== //
// (Perform carefully)

// Compound indexes for efficient queries
// evaluationSchema.index({ assignmentId: 1, status: 1 });
// evaluationSchema.index({ evaluatorId: 1, status: 1, dueDate: 1 });
// evaluationSchema.index({ submitterId: 1, createdAt: -1 });
// evaluationSchema.index({ "assignmentMetadata.colorGroup": 1, assignmentId: 1 });

// Ensure no self-evaluation
evaluationSchema.pre("save", function (next) {
  if (this.submitterId.equals(this.evaluatorId)) {
    return next(new Error("Users cannot evaluate their own submissions"));
  }

  // Update status timestamps
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "in_progress":
        if (!this.startedAt) this.startedAt = now;
        break;
      case "submitted":
        if (!this.submittedAt) this.submittedAt = now;
        break;
      case "reviewed":
        if (!this.reviewedAt) this.reviewedAt = now;
        break;
    }
  }

  // Check if submission is late
  if (this.submittedAt && this.dueDate) {
    this.isLate = this.submittedAt > this.dueDate;
  }

  next();
});

// Virtual for evaluation progress percentage
evaluationSchema.virtual("progressPercentage").get(function () {
  const statusProgress = {
    assigned: 0,
    in_progress: 25,
    submitted: 75,
    reviewed: 90,
    finalized: 100,
  };
  return statusProgress[this.status] || 0;
});

// Virtual for score percentage
evaluationSchema.virtual("scorePercentage").get(function () {
  if (!this.maxTotalScore || this.maxTotalScore === 0) return 0;
  return Math.round((this.totalScore / this.maxTotalScore) * 100);
});

// Virtual for time remaining
evaluationSchema.virtual("timeRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  const timeDiff = this.dueDate - now;
  return timeDiff > 0 ? timeDiff : 0;
});

// Static method for graph coloring assignment
evaluationSchema.statics.assignEvaluationsUsingGraphColoring = async function (
  assignmentId,
  submissionIds
) {
  try {
    const submissions = await mongoose
      .model("Submission")
      .find({
        _id: { $in: submissionIds },
        assignmentId: assignmentId,
      })
      .populate("userId", "_id userName");

    if (submissions.length < 2) {
      throw new Error("Need at least 2 submissions for peer evaluation");
    }

    // Create adjacency list for graph coloring
    const users = submissions.map((sub) => sub.userId);
    const userIds = users.map((user) => user._id.toString());
    const n = users.length;

    // Graph coloring algorithm implementation
    const graph = new Array(n).fill(null).map(() => new Array(n).fill(false));

    // Create edges (conflicts) - users cannot evaluate their own work
    for (let i = 0; i < n; i++) {
      graph[i][i] = true; // Self-loop to prevent self-evaluation
    }

    // Assign evaluators using graph coloring approach
    const evaluatorAssignments = [];
    const submissionsPerEvaluator = Math.ceil(n / Math.max(1, n - 1));

    for (let i = 0; i < n; i++) {
      const submission = submissions[i];
      const availableEvaluators = [];

      // Find available evaluators (not the submitter)
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          // Cannot evaluate own submission
          availableEvaluators.push({
            userId: users[j]._id,
            userName: users[j].userName,
            index: j,
          });
        }
      }

      // Randomly assign evaluator to distribute workload
      if (availableEvaluators.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableEvaluators.length
        );
        const selectedEvaluator = availableEvaluators[randomIndex];

        evaluatorAssignments.push({
          submissionId: submission._id,
          submitterId: submission.userId._id,
          evaluatorId: selectedEvaluator.userId,
          colorGroup: i,
          assignmentRound: 1,
        });
      }
    }

    return evaluatorAssignments;
  } catch (error) {
    throw new Error(`Failed to assign evaluations: ${error.message}`);
  }
};

// Static method to create evaluations from assignments
evaluationSchema.statics.createEvaluationsFromAssignments = async function (
  assignmentId,
  evaluatorAssignments,
  dueDate
) {
  const evaluations = [];

  try {
    for (const assignment of evaluatorAssignments) {
      const evaluation = new this({
        assignmentId: assignmentId,
        submitterId: assignment.submitterId,
        evaluatorId: assignment.evaluatorId,
        submissionId: assignment.submissionId,
        scores: [], // Will be filled when evaluation is completed
        totalScore: 0,
        maxTotalScore: 100, // Default, should be set based on assignment criteria
        overallFeedback: "",
        evaluationType: "peer",
        status: "assigned",
        dueDate: dueDate,
        assignmentMetadata: {
          colorGroup: assignment.colorGroup,
          assignmentRound: assignment.assignmentRound,
          priority: 0,
        },
      });

      evaluations.push(evaluation);
    }

    // Save all evaluations
    const savedEvaluations = await this.insertMany(evaluations);
    return savedEvaluations;
  } catch (error) {
    throw new Error(`Failed to create evaluations: ${error.message}`);
  }
};

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;
