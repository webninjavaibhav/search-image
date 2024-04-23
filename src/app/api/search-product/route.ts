import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { connectDb } from "../../utils/db";
import { uploadFileToS3 } from "../../utils/s3";
import Product from "@/../models/Product";
import { readFile } from "node:fs/promises";

const replicate = new Replicate();

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = await request.formData();
    const imageUrl: any = data.get("url");

    console.log("image", imageUrl);

    const input = {
      input: imageUrl,
    };

    //@ts-ignore
    const output = await replicate.run(process.env.REPLICATE_EMBEDDED_KEY, {
      input,
    });
    console.log("output", output);

    //Create product logic

    // const createProduct = new Product({
    //   name: fileName,
    //   url: imageUrl,
    //   embadding: output,
    // });
    // await createProduct.save();

    const searchRes = await Product.aggregate([
      {
        $vectorSearch: {
          index: "search_vector_index",
          path: "embadding",
          //@ts-ignore
          queryVector: output,
          numCandidates: 1024,
          limit: 1,
        },
      },
    ]);
    if (searchRes) {
      console.log("Product found:", searchRes);
      return NextResponse.json({ product: searchRes });
    } else {
      console.log("Product not found");
      return NextResponse.json({ message: "No data found" });
    }
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: "Something went wrong" });
  }
}
