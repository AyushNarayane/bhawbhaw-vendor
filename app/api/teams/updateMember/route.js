import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const { memberData } = await request.json();

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    await updateDoc(doc(db, "teams", memberId), {
      ...memberData,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}
