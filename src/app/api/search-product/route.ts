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

    const input = {
      input: imageUrl,
    };

    //@ts-ignore
    const output = await replicate.run(process.env.REPLICATE_EMBEDDED_KEY, {
      input,
    });

    const searchRes = await Product.aggregate([
      {
        $vectorSearch: {
          index: "search_vector_index",
          path: "embadding",
          //@ts-ignore
          queryVector: output,
          numCandidates: 1024,
          limit: 5,
        },
      },
    ]);
    if (searchRes) {
      return NextResponse.json({ product: searchRes });
    } else {
      return NextResponse.json({ message: "No data found" });
    }
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
