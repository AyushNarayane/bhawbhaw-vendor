import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is missing' });
  }

  try {
    const vendorsCollection = collection(db, 'vendors');
    const vendorQuery = query(vendorsCollection, where('email', '==', email));
    const querySnapshot = await getDocs(vendorQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'No vendor found with the specified email' });
    }

    await sendPasswordResetEmail(auth, email);
    return res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}
