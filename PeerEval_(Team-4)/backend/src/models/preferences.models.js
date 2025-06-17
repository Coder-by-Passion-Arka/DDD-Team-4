import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
    preferenceHolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Each user has one preference document
    },
    defaultTheme: {
        type: String,
        enum: ["dark", "light", "system"],
        default: "system",
    },
    workingHours: {
        startTime: {
            type: String, // Use String (e.g., "09:00") instead of Date for time of day
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

export default mongoose.model("Preference", preferenceSchema);
