import { db } from '@/firebase'; // Ensure correct path to Firebase configuration
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ error: 'vendorId is required' });
    }

    try {
      const queriesCollection = collection(db, 'vendorQueries');
      const queriesQuery = query(queriesCollection, where('vendorUId', '==', vendorId));
      const querySnapshot = await getDocs(queriesQuery);

      const queries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort the queries by createdAt in descending order
      queries.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      return res.status(200).json({ queries });
    } catch (error) {
      console.error('Error fetching queries:', error);
      return res.status(500).json({ error: 'Error fetching queries' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
