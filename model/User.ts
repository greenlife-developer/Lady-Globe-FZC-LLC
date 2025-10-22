import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
}, { timestamps: { createdAt: true, updatedAt: true } });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
