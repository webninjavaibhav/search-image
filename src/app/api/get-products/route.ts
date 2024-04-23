import { NextResponse } from "next/server";
import Product from "../../../../models/Product";

export async function GET(request: Request) {
  const product = await Product.find().exec();
  return NextResponse.json({ data: product });
}
