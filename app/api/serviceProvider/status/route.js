import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return new NextResponse("Vendor ID is required", { status: 400 });
    }

    const serviceProvidersRef = collection(db, "serviceProviders");
    const q = query(serviceProvidersRef, where("vendorId", "==", vendorId));
    const querySnapshot = await getDocs(q);

    let status = 'Not Registered';
    
    if (!querySnapshot.empty) {
      status = querySnapshot.docs[0].data().status;
    }

    return NextResponse.json({ status });

  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
