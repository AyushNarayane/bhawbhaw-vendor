import { db, storage } from "@/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

interface addVendorQueryProps {
  title: string;
  description: string;
  vendorUId: string;
  vendorId: string;
}

export async function getUserFromFireBase(vendorId: string) {
  try {
    const queriesCollection = collection(db, "vendors");
    const queriesQuery = query(
      queriesCollection,
      where("uid", "==", vendorId)
    );

    const querySnapshot = await getDocs(queriesQuery);

    const queries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return queries;
  } catch (error) {
    console.error("Error fetching queries by vendorId:", error);
    return [];
  }
}

export async function getDetailsFromFirestore() {
  try {
    const docRef = doc(db, "details", "detailsDocument");
    const docSnap = await getDoc(docRef);

    const queries = docSnap.data();

    return queries;
  } catch (error) {
    console.error("Error fetching details: ", error);
    return [];
  }
}

export async function getAllQueries(vendorId: string) {
  console.log(vendorId)
  try {
    const queriesCollection = collection(db, "vendorQueries");
    const queriesQuery = query(
      queriesCollection,
      where("vendorUId", "==", vendorId)
    );
    //GET ALL QUERY KO THIK KARNA HAI
    const querySnapshot = await getDocs(queriesQuery);

    const queries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    queries.sort((a, b) => {
      //@ts-ignore
      return b.createdAt - a.createdAt;
    });

    return queries;
  } catch (error) {
    console.error("Error fetching queries by sellerId:", error);
    return [];
  }
}

export async function reopenQuery(queryId: string) {
  try {
    const batch = writeBatch(db);
    const productRef = doc(db, "vendorQueries", queryId);
    batch.update(productRef, {
      status: "active",
      updatedAt: new Date(Date.now()),
    });
    await batch.commit();
  } catch (error) {
    console.log("Error in re-openign the query", error);
    return [];
  }
}

export async function getQueryFromIdFromFireStore(id: string) {
  try {
    const queryCollection = doc(db, "vendorQueries", id);

    const querySnapshot = await getDoc(queryCollection);

    const queries = querySnapshot.data();
    return queries;
  } catch (error) {
    console.error("Error fetching Query:", error);
    return {};
  }
}

export async function addVendorQueryToFirestore({
  vendorId,
  title,
  description,
  vendorUId,
}: addVendorQueryProps) {
  try {
    const QueryId = `VQ${Date.now()}`;
    const docRef = await setDoc(doc(db, "vendorQueries", QueryId), {
      queryId: QueryId,
      title,
      description,
      status: "active",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      vendorUId,
      vendorId,
    });
    console.log("Query written to firestore");
  } catch (error) {
    console.log("Error in adding query", error);
    return false;
  }
}

export interface addProductToFireStoreProps {
  gstPercentage: string;
  reportNo: string;
  vendorUId: string;
  category: string;
  description: string;
  diamondColor: string;
  diamondPricePerGram: string;
  diamondWeight: string;
  dod: string;
  goldPricePerGram: string;
  goldPurity: string;
  grossWeight: string;
  gstPrice: string;
  images: [] | undefined;
  makingCharges: string;
  metalOption: string;
  subCategory: string;
  maxRetailPrice: string;
  productId: string;
  size: string;
  title: string;
  vendorId: string;
  finalPrice: string;
  internationalPrice: string;
  gender: [] | ["All"];
  minOrderQty;
  sellingPrice;
  dispatchDays;
  material;
  warranty;
}

export async function addProductToFireStore({
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
}: addProductToFireStoreProps) {
  try {
    const docRef = await setDoc(doc(db, "products", productId), {
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
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      status: "disabled",
    });
    console.log("Product written with ID: ");
  } catch (error) {
    console.log("Error in adding Product", error);
    return false;
  }
}

export async function deleteProductsFromFirestore(productIds: []) {
  try {
    const batch = writeBatch(db);
    productIds.forEach((docId) => {
      const docRef = doc(db, "products", docId);
      batch.delete(docRef);
    });
    await batch.commit();
    console.log("Documents deleted successfully");
  } catch (error) {
    console.error("Error deleting products: ", error);
  }
}

export async function updateProductDetails(
  productId: string,
  data: {},
  docId: string
) {
  try {
    const batch = writeBatch(db);
    const productRef = doc(db, "products", docId);
    batch.update(productRef, { ...data, updatedAt: new Date(Date.now()) });
    await batch.commit();
  } catch (error) {
    console.log("Error in updating the product", error);
    return [];
  }
}

export async function updateStatusOfProducts(productsIds: [], status: string) {
  try {
    const batch = writeBatch(db);
    productsIds.forEach((productId) => {
      const productRef = doc(db, "products", productId);
      batch.update(productRef, { status, updatedAt: new Date(Date.now()) });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error updating products status", error);
    return [];
  }
}

export async function getVendorByEmail(vendorEmail: string) {
  try {
    const vendorEmailLowerCase = vendorEmail.toLowerCase();
    const vendorCollection = collection(db, "vendors");
    const vendorQuery = query(
      vendorCollection,
      where("personalDetails.email", "==", vendorEmailLowerCase)
    );
    
    const querySnapshot = await getDocs(vendorQuery);
    const vendors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(vendors)
    return vendors;
  } catch (error) {
    console.error("Error fetching vendor by Email:", error);
    return [];
  }
}

export async function getProductsBySellerIdFromFireStore(sellerId: string) {
  try {
    const productsCollection = collection(db, "products");
    const productsQuery = query(
      productsCollection,
      where("vendorId", "==", sellerId)
    );

    const querySnapshot = await getDocs(productsQuery);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    products.sort((a, b) => {
      //@ts-ignore
      return b.updatedAt - a.updatedAt;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products by sellerId:", error);
    return [];
  }
}

export async function getAllImages() {
  listAll(ref(storage, "images")).then((imgs) => {
    imgs.items.forEach((val) => {
      console.log(val.fullPath);
    });
  });
}

interface registerVendorToFireStoreProps {
  ownerName: string;
  primanyEmail: string;
  alternativeEmail: string;
  primaryPhoneNo: string;
  alternativePhoneNo: string;
  buissnessName: string;
  brandName: string;
  gstNumber: string;
  panNumber: string;
  pickUpAddress: string;
  pinCode: string;
  YOE: string;
  IFSC: string;
  bankHolderName: string;
  accountNumber: string;
  contractAggrement: any;
  panCardFile: any;
  aadharCardFile: any;
  GSTCertificate: any;
  O1: boolean;
  O2: boolean;
  O3: boolean;
  O4: boolean;
  uspDetails: string;
  referralNumber: string;
  vendorUId: string;
}

export async function registerVendorToFireStore({
  referralNumber,
  ownerName,
  primanyEmail,
  alternativeEmail,
  primaryPhoneNo,
  alternativePhoneNo,
  buissnessName,
  brandName,
  gstNumber,
  panNumber,
  pickUpAddress,
  pinCode,
  YOE,
  IFSC,
  bankHolderName,
  accountNumber,
  contractAggrement,
  panCardFile,
  aadharCardFile,
  GSTCertificate,
  O1,
  O2,
  O3,
  O4,
  uspDetails,
  vendorUId,
}: registerVendorToFireStoreProps) {
  try {
    const vendorId = `VE${Date.now()}`;
    const documents = [
      { title: "ContractAggrement", file: contractAggrement },
      { title: "AadharCard", file: aadharCardFile },
      { title: "GST_Certificate", file: GSTCertificate },
      { title: "PAN_CardFile", file: panCardFile },
    ];
    //@ts-ignore
    let DocumentLinks = [];

    await Promise.all(
      documents.map(async ({ title, file }) => {
        const storageRef = ref(storage, `vendors/${vendorId}/${title}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot: any) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },

          (error: any) => {
            console.error(`Error uploading ${title}:`, error);
          }
          //   async () =>
          //     //@ts-ignore
          //     await getDownloadURL(uploadTask.snapshot.ref).then(
          //       (downloadURL) => {
          //         DocumentLinks.push({ title, url: downloadURL });
          //       }
          //     )
        );

        return uploadTask;
      })
    );

    await Promise.all(
      documents.map(async (file) => {
        const storageRef = ref(storage, `vendors/${vendorId}/${file.title}`); // Specify the path where each file is stored
        const downloadUrl = await getDownloadURL(storageRef);
        DocumentLinks.push({ title: file.title, url: downloadUrl });
      })
    );

    //@ts-ignore
    console.log(DocumentLinks);

    const docRef = await setDoc(doc(db, "vendors", vendorId), {
      vendorUId: vendorUId,
      vendorId: vendorId,
      ownerName,
      primanyEmail,
      alternativeEmail,
      primaryPhoneNo,
      alternativePhoneNo,
      buissnessName,
      brandName,
      gstNumber,
      panNumber,
      pickUpAddress,
      pinCode,
      YOE,
      IFSC,
      bankHolderName,
      accountNumber,
      //@ts-ignore
      DocumentLinks,
      Do_you_provide_customisation: O1,
      Are_you_willing_to_sell_globally: O2,
      Do_you_deal_with_lab_grown_cvd_diamond_jewelry: O3,
      Do_you_cater_to_coloured_diamonds: O4,
      uspDetails,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      isVerified: false,
      isActive: true,
      referralNumber,
    });
    return true;
  } catch (error) {
    console.log("Error in adding Product", error);
    return false;
  }
}

export async function getOrdersFromFireStore(status: string) {
  try {
    const productCollection = collection(db, "orders");
    const productQuery = query(
      productCollection,
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(productQuery);
    if (querySnapshot.size === 0) {
      return [];
    }
    const productList: any[] = [];

    querySnapshot.forEach((doc) => {
      productList.push({ id: doc.id, ...doc.data() });
    });

    return productList;
  } catch (error) {
    console.log("Error getting product from status", error);
    return [];
  }
}
