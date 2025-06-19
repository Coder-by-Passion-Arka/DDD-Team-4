import mongoose, { Schema, Document, Types, model } from "mongoose";

// 1. Define interface for a single activity entry
interface IActivityEntry {
  activityType: string;
  duration?: number;
  comment?: string;
}

// 2. Define the full document interface for DailyActivity
export interface IDailyActivity extends Document {
  studentId: Types.ObjectId;
  activity: IActivityEntry[];
  date: Date;
}

// 3. Define schema for activity array items
const activityEntrySchema = new Schema<IActivityEntry>(
  {
    activityType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    comment: {
      type: String,
    },
  },
  { _id: false } // prevent automatic _id creation for subdocuments
);

// 4. Define the main schema
const dailyActivitySchema = new Schema<IDailyActivity>({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity: {
    type: [activityEntrySchema],
    required: true,
    validate: {
      validator: (arr: IActivityEntry[]) => arr.length > 0,
      message: "At least one activity must be provided.",
    },
  },
  date: {
    type: Date,
    required: true,
  },
});

// 5. Export the model
const DailyActivity = model<IDailyActivity>("DailyActivity", dailyActivitySchema);
export default DailyActivity;
