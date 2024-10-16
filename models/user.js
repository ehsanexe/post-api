import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
});

export default mongoose.model("User", userSchema);
