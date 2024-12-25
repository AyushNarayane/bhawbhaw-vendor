import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ error: 'vendorId is required' });
    }

    try {
      const couponsCollection = collection(db, 'coupons');
      const couponsQuery = query(couponsCollection, where('vendorId', '==', vendorId));
      const querySnapshot = await getDocs(couponsQuery);

      const coupons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      coupons.sort((a, b) => {
        const aCreatedAt = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const bCreatedAt = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return bCreatedAt - aCreatedAt;
      });

      return res.status(200).json({ coupons });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return res.status(500).json({ error: 'Error fetching coupons' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
