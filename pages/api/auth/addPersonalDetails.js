import { db } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { personalDetails, userId, uid } = req.body;

    try {
      const userDocRef = doc(db, 'vendors', userId);

      await setDoc(userDocRef, {
        personalDetails: {
          name: personalDetails.fullName,
          email: personalDetails.email,
          phoneNumber: personalDetails.phoneNumber,
        },
        uid: uid,
        status: 'initiated',
        createdAt: serverTimestamp(),
      });

      res.status(200).json({ message: 'Personal details added successfully', id: userId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add personal details', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}