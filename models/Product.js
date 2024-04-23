import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: { type: String, required: true },
  embadding: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
