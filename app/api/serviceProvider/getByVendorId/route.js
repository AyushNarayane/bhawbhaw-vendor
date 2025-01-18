import { NextResponse } from "next/server";
import { db } from "../../../firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return new NextResponse("Vendor ID is required", { status: 400 });
    }

    // Find in serviceprovider table (note the lowercase)
    const provider = await db.serviceProvider.findFirst({
      where: {
        vendorId: vendorId
      }
    });

    return NextResponse.json(provider || { status: 'Not Registered' });

  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
