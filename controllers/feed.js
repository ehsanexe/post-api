import Post from "../models/post.js";

export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "/images/shoe1.png",
        creator: {
          name: "Bruce",
        },
        date: new Date(),
      },
    ],
  });
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      imageUrl: "/images/shoe1.png",
      creator: "Bruce",
    });

    const result = await post.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  } catch (error) {
    next(error);
  }
};
