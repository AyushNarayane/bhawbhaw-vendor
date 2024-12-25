import { db } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { productId, data } = req.body;

    if (!productId || !data) {
      return res.status(400).json({ error: 'Product ID and data are required' });
    }

    try {
      const batch = writeBatch(db);
      const productRef = doc(db, 'products', productId);

      batch.update(productRef, { ...data, updatedAt: new Date() });
      await batch.commit();

      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
