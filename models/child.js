import mongoose from "mongoose";
const { Schema } = mongoose;

const childSchema = new Schema(
  {
    Name: {
      type: String
    },
    BuildId: {
      type: String,
    },
    Linked: {
      type: Boolean,
      default:false,
    },
    Parents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    applications:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'application'
    }]
  },
  {
    timestamps: true,
  }
);

const Child = mongoose.model("child", childSchema);

export { Child };
