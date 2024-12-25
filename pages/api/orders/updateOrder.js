import { db } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { orderId, data } = req.body;

    if (!orderId || !data) {
      return res.status(400).json({ error: 'Order ID and data are required' });
    }

    try {
      const batch = writeBatch(db);
      const orderRef = doc(db, 'orders', orderId);

      batch.update(orderRef, { ...data, updatedAt: new Date() });
      await batch.commit();

      return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error('Error updating Order:', error);
      return res.status(500).json({ error: 'Failed to update Order' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
