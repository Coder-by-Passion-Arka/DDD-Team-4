import mongoose, { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------------
// 1. Interfaces
// ----------------------

interface ISocialMediaProfile {
  platform: string;
  profileLink: string;
}

interface IAcademicInfo {
  universityName?: string;
  degree?: string;
  major?: string;
  grade?: number;
  graduationYear?: Date;
  startDate?: Date;
  endDate?: Date;
}

interface IUserLocation {
  homeAddress: string;
  currentAddress: string;
}

interface IUserPhoneNumber {
  number: string;
  countryCode: string;
}

export interface IUser extends Document {
  userName: string;
  userEmail: string;
  userPhoneNumber: IUserPhoneNumber;
  userLocation: IUserLocation;
  userBio?: string;
  userProfileImage?: string;
  userAcademicInformation?: IAcademicInfo;
  userSkills?: string[];
  userSocialMediaProfiles?: ISocialMediaProfile[];
  userJoiningDate?: Date;
  userLastLogin?: Date;
  userPassword: string;

  isPasswordCorrect(trialPassword: string): Promise<boolean>;
  generateAccessToken(): string;
}

// ----------------------
// 2. Schema Definition
// ----------------------

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
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
    number: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
    },
    countryCode: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 3,
    },
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
    minlength: 10,
    maxlength: 500,
  },
  userProfileImage: {
    type: String,
  },
  userAcademicInformation: {
    universityName: {
      type: String,
      minlength: 10,
      maxlength: 50,
    },
    degree: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    major: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    grade: {
      type: Number,
      min: 0,
      max: 10,
    },
    graduationYear: Date,
    startDate: Date,
    endDate: Date,
  },
  userSkills: {
    type: [String],
    minlength: 1,
    maxlength: 100,
  },
  userSocialMediaProfiles: [
    {
      platform: {
        type: String,
        minlength: 5,
        maxlength: 50,
      },
      profileLink: {
        type: String,
        minlength: 10,
        maxlength: 100,
      },
    },
  ],
  userJoiningDate: Date,
  userLastLogin: Date,
  userPassword: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 20,
  },
});

// ----------------------
// 3. Methods
// ----------------------

userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (user.isModified("userPassword")) {
    user.userPassword = await bcrypt.hash(user.userPassword, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  trialPassword: string
): Promise<boolean> {
  return await bcrypt.compare(trialPassword, this.userPassword);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      email: this.userEmail,
      id: this._id,
      userName: this.userName,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
};

// ----------------------
// 4. Export Model
// ----------------------

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
