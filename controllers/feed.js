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

export const createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.status(201).json({
    message: "Post created successfully!",
    post: { _id: new Date().toISOString(), title, content },
    creator: {
      name: "Bruce",
    },
    createdAt: new Date(),
  });
};
