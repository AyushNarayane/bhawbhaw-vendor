import { NextResponse } from "next/server";
import { db } from "../../../../firebase";  // Fix the import path
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    const teamsQuery = query(
      collection(db, "teams"),
      where("vendorId", "==", vendorId)
    );

    const querySnapshot = await getDocs(teamsQuery);
    const teamMembers = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      teamMembers.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
      });
    });

    console.log("Found team members:", teamMembers); // Debug log
    return NextResponse.json(teamMembers);

  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team", details: error.message },
      { status: 500 }
    );
  }
}
