export const errorHandler = (error, req, res, next) => {
  console.log({ error });
  const message = error.message;
  const status = error.statusCode ?? 500;

  res.status(status).json({ message });
};

export const generateError = (msg, statusCode) => {
  const err = new Error(msg);
  err.statusCode = statusCode;
  throw err;
};
