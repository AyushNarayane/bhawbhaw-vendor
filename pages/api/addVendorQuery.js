import { db } from '@/firebase'; // Ensure correct path to Firebase configuration
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      vendorId, 
      title, 
      description, 
      vendorUId, 
      vendorDetails // New: vendor details object
    } = req.body;

    if (!vendorId || !title || !description || !vendorUId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const QueryId = `VQ${Date.now()}`;
    try {
      await setDoc(doc(db, 'vendorQueries', QueryId), {
        queryId: QueryId,
        title,
        description,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        vendorUId,
        vendorId,
        // Add vendor details to query document
        vendorDetails: {
          name: vendorDetails?.name || '',
          email: vendorDetails?.email || '',
          phoneNumber: vendorDetails?.phoneNumber || '',
          address: vendorDetails?.address || '',
          businessName: vendorDetails?.businessName || ''
        },
        // Add query tracking fields
        resolvedBy: null,
        resolveDate: null,
        resolveMsg: null,
        reopenMsg: null,
        closeMsg: null
      });

      return res.status(200).json({ 
        message: 'Query added successfully',
        queryId: QueryId 
      });
    } catch (error) {
      console.error('Error adding query:', error);
      return res.status(500).json({ error: 'Error adding query' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
