import { db } from '@/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      title,
      category,
      subCategory,
      maxRetailPrice,
      description,
      minOrderQty,
      sellingPrice,
      dispatchDays,
      size,
      material,
      warranty,
      images,
      productId,
      vendorId,
    } = req.body;

    if (
      !title ||
      !category ||
      !subCategory ||
      !maxRetailPrice ||
      !description ||
      !minOrderQty ||
      !sellingPrice ||
      !dispatchDays ||
      !size ||
      !material ||
      !images ||
      !productId ||
      !vendorId
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      await setDoc(doc(db, 'products', productId), {
        title,
        category,
        subCategory,
        maxRetailPrice,
        description,
        minOrderQty,
        sellingPrice,
        dispatchDays,
        size,
        material,
        warranty,
        images,
        productId,
        vendorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'disabled',
      });
      return res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
