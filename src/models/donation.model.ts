import mongoose, { Schema, Document } from "mongoose";

export interface Donation extends Document {
  name: string;
  description: string
  donor: mongoose.Types.ObjectId;
  acquirer: mongoose.Types.ObjectId;
  image: string;
}

const donationSchema: Schema<Donation> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    acquirer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    image : String,
  },
  {
    timestamps: true,  
  }
);

const donationModel = mongoose.models.Donation as mongoose.Model<Donation> || mongoose.model<Donation>('Donation', donationSchema);

export default donationModel;
