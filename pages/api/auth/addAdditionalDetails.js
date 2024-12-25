import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { personalDetails, businessDetails, bankDetails, documents, userId } = req.body;

    try {
      const userDocRef = doc(db, 'vendors', userId);

      await updateDoc(userDocRef, {
        'personalDetails.isEcommerce': personalDetails.isEcommerce,
        'personalDetails.isService': personalDetails.isService,
        businessDetails: {
          ...businessDetails,
        },
        bankDetails: {
          ...bankDetails,
        },
        documents: {
          ...documents,
        },
      });

      res.status(200).json({ message: 'Additional details added successfully', id: userId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add additional details', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
