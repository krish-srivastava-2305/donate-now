import mongoose, { Schema, Document, Model } from "mongoose";

export interface Requests extends Document {
  name: string;
  description: string;
  postedBy: mongoose.Types.ObjectId;
}

const requestSchema: Schema<Requests> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const requestModel: Model<Requests> = mongoose.models.Request || mongoose.model<Requests>('Request', requestSchema);

export default requestModel;
