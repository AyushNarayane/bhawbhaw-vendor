import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { vendorId, serviceData, vendorName, vendorEmail, vendorPhoneNumber} = req.body;

    try {
      const serviceID = `SID${Date.now()}`;

      const serviceRef = doc(db, 'services', serviceID);

      await setDoc(serviceRef, {
        ...serviceData,
        vendorId,
        vendorName,
        vendorEmail,
        vendorPhoneNumber,
        serviceId:serviceID,
        createdAt: new Date().toISOString(),
      });
      
      res.status(201).json({ success: true, serviceId:serviceID, serviceData });
    } catch (error) {
      res.status(500).json({ message: 'Error adding service', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
