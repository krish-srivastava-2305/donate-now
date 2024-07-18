import mongoose, { Schema, Document } from "mongoose";

export interface Project extends Document {
  name: string;
  projectMaster: mongoose.Types.ObjectId;
  projectEmployee: mongoose.Types.ObjectId;
  images: string[];
}

const ProjectSchema: Schema<Project> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    projectEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,  
  }
);

const projectModel = mongoose.models.Project as mongoose.Model<Project> || mongoose.model<Project>('Project', ProjectSchema);

export default projectModel;
