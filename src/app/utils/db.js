import mongoose from "mongoose";

export const connectDb = async () => {
  mongoose
    .connect(process.env.NEXT_PUBLIC_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {})
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
    });
};
