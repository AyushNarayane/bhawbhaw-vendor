import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(request) {
  try {
    const { bookingId, teamMemberId } = await request.json();

    if (!bookingId || !teamMemberId) {
      return NextResponse.json(
        { error: "Booking ID and Team Member ID are required" },
        { status: 400 }
      );
    }

    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      assignedTo: teamMemberId,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error assigning booking:", error);
    return NextResponse.json(
      { error: "Failed to assign booking" },
      { status: 500 }
    );
  }
}
