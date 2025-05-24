import { db } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      vendorId, 
      title, 
      description, 
      vendorUId, 
      vendorDetails,
      attachmentUrl 
    } = req.body;

    // Log the received data
    console.log("Received query data:", {
      vendorId,
      title,
      description,
      vendorUId,
      vendorDetails,
      attachmentUrl
    });

    if (!vendorId || !title || !description || !vendorUId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const QueryId = `VQ${Date.now()}`;
    try {
      const queryData = {
        queryId: QueryId,
        title,
        description,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        vendorUId,
        vendorId,
        attachmentUrl: attachmentUrl || null,
        vendorDetails: {
          ...vendorDetails,
          updatedAt: serverTimestamp()
        },
        resolvedBy: null,
        resolveDate: null,
        resolveMsg: null,
        reopenMsg: null,
        closeMsg: null
      };

      // Log the data being saved
      console.log("Saving query data:", queryData);

      await setDoc(doc(db, 'vendorQueries', QueryId), queryData);

      return res.status(200).json({ 
        message: 'Query added successfully',
        queryId: QueryId,
        savedData: queryData // Return saved data for verification
      });
    } catch (error) {
      console.error('Error adding query:', error);
      return res.status(500).json({ 
        error: 'Error adding query',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
