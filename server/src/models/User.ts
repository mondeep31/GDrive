import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email?: string;
  name?: string;
  avatar?: string;
  profilePicture?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  avatar: String,
  profilePicture: String,
}, { timestamps: true });

export default model<IUser>('User', userSchema);
