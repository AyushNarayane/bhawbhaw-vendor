import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'DELETE') { 
    const { bookingID } = req.body;

    if (!bookingID) {
      return res.status(400).json({ error: 'Booking ID is required.' });
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingID);

      await updateDoc(bookingRef, { status: 'cancelled' });
  
      res.status(200).json({ success: true, message: 'Booking cancelled successfully.' });
    } catch (error) {
      console.error('Error cancelling service:', error);
      res.status(500).json({ error: 'An error occurred while updating the booking status.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
