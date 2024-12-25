import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    try {
      const productsCollection = collection(db, 'products');
      const productsQuery = query(productsCollection, where('vendorId', '==', vendorId));
      const querySnapshot = await getDocs(productsQuery);

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      products.sort((a, b) => b.updatedAt - a.updatedAt);

      return res.status(200).json({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
