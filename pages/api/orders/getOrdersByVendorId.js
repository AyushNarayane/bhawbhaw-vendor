import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { vendorId } = req.query;

  if (!vendorId) {
    return res.status(400).json({ error: 'Missing vendorId parameter' });
  }

  try {
    const ordersRef = collection(db, 'orders');

    const ordersQuery = query(
      ordersRef,
      where('vendorIds', 'array-contains', vendorId)
    );

    const querySnapshot = await getDocs(ordersQuery);

    const orders = [];

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      
      const vendorProducts = (orderData.products || orderData.items || []).filter(
        (product) => product.vendorId === vendorId
      );      

      orders.push({
        shippingDetails: orderData.shippingDetails || {},
        products: vendorProducts,
        status:orderData.status,
        totalAmount:orderData.totalAmount,
        createdAt:orderData.createdAt,
        orderId: doc.id
      });
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
