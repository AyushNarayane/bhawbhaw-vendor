import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    // Delete from teams collection
    await deleteDoc(doc(db, "teams", memberId));
    
    // Delete from team-vendor mapping
    await deleteDoc(doc(db, "team-vendor", memberId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
