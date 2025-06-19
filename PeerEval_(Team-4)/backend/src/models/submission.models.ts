import mongoose, { Schema, Document, model } from "mongoose";

// Define an interface for the Submission document
export interface ISubmission extends Document {
  // Add fields later as needed
}

// Define the schema with typing
const submissionSchema: Schema<ISubmission> = new Schema({});

// Export the model
export default model<ISubmission>("Submission", submissionSchema);
