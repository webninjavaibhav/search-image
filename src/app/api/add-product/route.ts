import { NextResponse } from "next/server";
import Replicate from "replicate";
import Product from "../../../../models/Product";
import { connectDb } from "@/app/utils/db";
import { uploadFileToS3 } from "@/app/utils/s3";

const replicate = new Replicate();

export async function POST(request: Request) {
  try {
    await connectDb();
    const data = await request.formData();
    const file: any = data.get("file");
    const fileName = file?.name;
    const imageUrl = await uploadFileToS3(file, fileName);

    const input = {
      input: imageUrl,
    };

    //@ts-ignore
    const output = await replicate.run(process.env.REPLICATE_EMBEDDED_KEY, {
      input,
    });

    const createProduct = new Product({
      name: fileName,
      url: imageUrl,
      embadding: output,
    });
    await createProduct.save();
    return NextResponse.json({ message: "Product created successfully" });
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({
      message: "Something went wrong, please try again",
    });
  }
}
