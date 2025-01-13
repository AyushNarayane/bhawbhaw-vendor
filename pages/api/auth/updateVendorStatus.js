import { db } from '@/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, status } = req.body;

  if (!userId || !status) {
    console.log('User ID and status are required:', userId, status);
    return res.status(400).json({ error: 'Missing required fields' });
    
  }
  
  try {
    const userDocRef = doc(db, 'vendors', userId);
    
    // Check if document exists
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Update the status and documents
    await updateDoc(userDocRef, { 
      status,
      documents: req.body.documents,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ 
      message: 'Status updated successfully',
      status
    });
  } catch (error) {
    console.error('Error updating vendor status:', error);
    res.status(500).json({ 
      error: 'Failed to update status', 
      details: error.message,
      code: error.code
    });
  }
}
