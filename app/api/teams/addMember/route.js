import { NextResponse } from "next/server";
import { db } from "../../../../firebase";  // Fix the import path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const { vendorId, memberData } = await request.json();

    if (!vendorId || !memberData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add member to teams collection
    const teamMember = {
      ...memberData,
      vendorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: memberData.status || 'active'
    };

    const docRef = await addDoc(collection(db, "teams"), teamMember);

    return NextResponse.json({ 
      success: true, 
      memberId: docRef.id,
      message: "Team member added successfully" 
    });

  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member", details: error.message },
      { status: 500 }
    );
  }
}
