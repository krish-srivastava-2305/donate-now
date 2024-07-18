import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  projectMaster: mongoose.Types.ObjectId;
  projectEmployee: mongoose.Types.ObjectId;
  isVerified: boolean;
  verifyCode: number
  verifyCodeExpiry: number;
  passwordRecoveryCode: number;
  passwordRecoveryCodeExpiry: number;
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    projectMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', 
    },
    projectEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',  
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: Number,
      required: true
    },
    verifyCodeExpiry: {
      type: Number,
    },
    passwordRecoveryCode: {
      type: Number,
    },
    passwordRecoveryCodeExpiry: {
      type: Number,
    },
  },
  {
    timestamps: true, 
  }
);

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema);

export default userModel;
