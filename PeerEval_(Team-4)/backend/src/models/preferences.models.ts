import mongoose, { Schema, Document, Types, model } from "mongoose";

// 1. Define enums and types
type ThemeOption = "dark" | "light" | "system";
type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// 2. Define interface for the document
export interface IPreference extends Document {
  preferenceHolder: Types.ObjectId;
  defaultTheme: ThemeOption;
  workingHours: {
    startTime: string;
    endTime: string;
    daysOfWeek: WeekDay[];
    isFlexible: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundNotifications: boolean;
    messageNotifications: boolean;
  };
}

// 3. Define the schema
const preferenceSchema = new Schema<IPreference>({
  preferenceHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One preference per user
  },
  defaultTheme: {
    type: String,
    enum: ["dark", "light", "system"],
    default: "system",
  },
  workingHours: {
    startTime: {
      type: String,
      required: true,
      default: "09:00",
    },
    endTime: {
      type: String,
      required: true,
      default: "17:00",
    },
    daysOfWeek: {
      type: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    isFlexible: {
      type: Boolean,
      default: false,
    },
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    soundNotifications: {
      type: Boolean,
      default: true,
    },
    messageNotifications: {
      type: Boolean,
      default: true,
    },
  },
});

// 4. Export the model
const Preference = model<IPreference>("Preference", preferenceSchema);
export default Preference;
