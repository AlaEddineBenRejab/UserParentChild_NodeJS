import mongoose from "mongoose";
const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    Name: {
      type: String
    },
    blocked: {
      type: Boolean,
      default:false,
    },
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'child'
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("application", applicationSchema);

export { Application };
