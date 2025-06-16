import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// This is the User schema for the User model //
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: false,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    minlength: 12,
    maxlength: 100,
  },
  userPhoneNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 15,
    countryCode: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 3,
    }, // Need to add some more meta data for country codes
  },
  userLocation: {
    homeAddress: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    currentAddress: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
  },
  userBio: {
    type: String,
    required: false,
    minlength: 10,
    maxlength: 500,
  },
  userProfileImage: {
    // Have to fill this with schema for image //
    type: String,
    required: false,
  },
  userAcademicInformation: {
    universityName: {
      type: String,
      required: false,
      minlength: 10,
      maxlength: 50,
      degree: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 50,
        major: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        grade: {
          type: Number,
          required: true,
          minlength: 1,
          maxlength: 3,
        },
        graduationYear: Date,
        startDate: Date,
        endDate: Date,
      },
    },
  },
  userSkills: {
    type: Array,
    required: false,
    minlength: 1,
    maxlength: 100,
    skills: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 50,
    },
  },
  userSocialMediaProfiles: {
    type: Array,
    required: false,
    minlength: 1,
    maxlength: 5,
    socialMediaProfiles: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 50,
      platform: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      profileLink: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 100,
      },
    },
  },
  userJoiningDate: Date,
  userLastLogin: Date,
  userPassword: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 20,
  },
});

// Hook to hash the pasword before saving  using bcrypt //
userSchema.pre("save", async function (next) {
  // Hash the password before saving it to the database
  const user = this;
  // Check if password is modified and hashing it, if so.
  if (user.isModified("userPassword")) {
    user.userPassword = await bcrypt.hash(user.userPassword, 12);
  }
  // Continue to next middleware or save the user to the database.
  next();
});

// To authenticate a new user login we have to check if the entered password matches the hashed password in the database.
userSchema.methods.isPasswordCorrect = async function (trialPassword) {
  // Compare the hashed password from the database with the given password.
  return await bcrypt.compare(trialPassword, this.userPassword);
}

// Generate Access Token using JWT
userSchema.methods.generateAccessToken = function () {
  // Generate a JWT token using the user's email and a secret key.
  return jwt.sign({ 
      email: this.userEmail,
      id: this._id,
      userName: this.userName,
    }, 
    process.env.JWT_SECRET || "secret", // Replace with your custom secret key before deployment
    { expiresIn: "1h" });
}

// Generate Refresh Token using JWT

export default mongoose.model("User", userSchema);
