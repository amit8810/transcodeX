import mongoose, { Schema, ObjectId } from 'mongoose';

export interface ISession extends Document {
  _id: ObjectId;
  token: string;
  userId: ObjectId;
  deviceInfo: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

const sessionSchema = new Schema<ISession>({
  token: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deviceInfo: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

export const SESSION_MODEL = mongoose.model<ISession>('Session', sessionSchema);
