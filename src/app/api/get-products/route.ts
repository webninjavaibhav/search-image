import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import { connectDb } from "@/app/utils/db";

export async function GET(request: Request) {
  try {
    await connectDb();
    const product = await Product.find().exec();
    return NextResponse.json({ data: product });
  } catch (err) {
    return NextResponse.json({
      message: "Something went wrong, please try again",
    });
  }
}
