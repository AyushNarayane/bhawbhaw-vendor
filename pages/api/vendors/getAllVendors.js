import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const vendorsCollection = collection(db, "vendors");
    const querySnapshot = await getDocs(vendorsCollection);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "No vendors found" });
    }

    const vendors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return res.status(500).json({ error: "Failed to fetch vendors" });
  }
}
