import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { serviceID } = req.query;

  if (req.method === 'PUT') {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No data provided to update' });
      }

      const serviceRef = doc(db, 'bookings', serviceID);

      const { serviceData } = req.body;
      
      await updateDoc(serviceRef, {
        ...serviceData,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
