import { db } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      personalDetails,
      businessDetails,
      bankDetails,
      documents,
      userId,
      uid
    } = req.body;
    
    try {
      const userDocRef = doc(db, 'vendors', userId);

      await setDoc(userDocRef, {
        personalDetails: {
          name: personalDetails.name,
          email: personalDetails.email,
          phoneNumber: personalDetails.phoneNumber,
          isEcommerce: personalDetails.isEcommerce,
          isService: personalDetails.isService,  
        },
        businessDetails: {
          ...businessDetails
        },
        bankDetails: {
          ...bankDetails
        },
        documents: {
          ...documents
        },
        uid: uid,
        isVerified:false,
        isDisabled:false,
        active:true,
        createdAt: serverTimestamp(),
      });

      res.status(200).json({ message: 'User data saved successfully', id: userId });
    } catch (error) {
      if (error.code === 'permission-denied') {
        res.status(403).json({ error: 'Permission denied to write data' });
      } else if (error.code === 'not-found') {
        res.status(404).json({ error: 'Document not found' });
      } else if (error.code === 'invalid-argument') {
        console.log("Invalid input data")
        res.status(400).json({ error: 'Invalid input data' });
      } else {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Failed to save user data', details: error.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
