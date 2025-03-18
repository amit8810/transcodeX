import mongoose, { ObjectId, Schema } from 'mongoose';

export interface IPlan extends Document {
  _id: ObjectId;
  name: string;
  deviceLimit: number;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    deviceLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const PLAN_MODEL = mongoose.model<IPlan>('Plan', planSchema);
