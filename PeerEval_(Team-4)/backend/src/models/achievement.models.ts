import mongoose, { Document, Schema, model } from 'mongoose';

// 1. Define a TypeScript interface for the Achievement document
export interface IAchievement extends Document {
  title: string;
  description: string;
  date: Date;
  achievementHolder: mongoose.Types.ObjectId;
}

// 2. Create a Mongoose schema using the interface
const achievementSchema: Schema<IAchievement> = new Schema({
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
  date: {
    type: Date,
    required: true,
  },
  achievementHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// 3. Export the model with typing
const Achievement = model<IAchievement>('Achievement', achievementSchema);
export default Achievement;
