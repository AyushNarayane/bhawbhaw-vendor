import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';  // Assuming db is your Firestore instance

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.body;
  console.log(email);

  if (!email) {
    return res.status(400).json({ error: 'Email is missing' });
  }

  try {
    console.log("Received request to send password reset email to:", email);

    const vendorsCollection = collection(db, 'vendors');

    const vendorQuery = query(vendorsCollection, where('personalDetails.email', '==', email));  

    const querySnapshot = await getDocs(vendorQuery);

    if (querySnapshot.empty) {
      console.log(`No vendor found with email: ${email}`);
      return res.status(404).json({ error: 'No vendor found with the specified email' });
    }

    console.log(`Vendor found. Sending password reset email to: ${email}`);
    
    // Send password reset email
    await sendPasswordResetEmail(auth, email);

    console.log(`Password reset email sent successfully to: ${email}`);
    return res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}
