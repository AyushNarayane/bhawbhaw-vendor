import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, "serviceProviders"), {
      ...data,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: "Service provider registered successfully",
      providerId: docRef.id,
      success: true,
    });
  } catch (error) {
    console.error("Error registering service provider:", error);
    return NextResponse.json(
      { error: "Failed to register service provider" },
      { status: 500 }
    );
  }
}
