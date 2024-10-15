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
    postId: mongoose.Types.ObjectId,
    ref: "Post",
  },
});

export default mongoose.model("User", userSchema);
