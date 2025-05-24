import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { couponTitle, discount, minPrice, timesUsed, vendorId } = req.body;
      if (!couponTitle || !discount || !vendorId) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const couponId = 'CID' + Math.floor(Date.now() / 1000);
      const newCoupon = { couponTitle, discount, vendorId, minPrice, timesUsed, createdAt: new Date(), status: "Active", global: false };

      await setDoc(doc(db, 'coupons', couponId), newCoupon);

      return res.status(201).json({ message: 'Coupon added successfully', data: { ...newCoupon, id: couponId } });
    } catch (error) {
      console.error('Error adding coupon:', error);
      return res.status(500).json({ error: 'Error adding coupon' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
