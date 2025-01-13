import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const vendorsRef = collection(db, 'vendors');
    const q = query(vendorsRef, where('personalDetails.email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(200).json({ exists: false });
    }

    const vendorDoc = querySnapshot.docs[0];
    const vendorData = vendorDoc.data();

    return res.status(200).json({
      exists: true,
      status: vendorData.status,
      uid: vendorData.uid
    });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to check user status' });
  }
}
