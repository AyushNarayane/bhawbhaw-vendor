"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { getUserFromFireBase, getVendorByEmail } from "@/lib/firebaseFunc";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [laoding, setLoading] = useState(true);
  const userInfo = useRef();

  function signup(email, password) {
    createUserWithEmailAndPassword(auth, email, password);
    return;
  }

  async function login(email, password) {
    try {
      const vendor = await getVendorByEmail(email);
      console.log(vendor)
  
      if (!vendor || vendor === undefined || vendor.length === 0) {
        return {
          status: false,
          message:
            "No Seller associated with this email. Kindly Register to access the Seller Panel",
        };
      }
  
      if (!vendor.isVerified) {
        return {
          status: false,
          message:
            "Seller Account is not verified. Kindly wait or contact our Support Team",
        };
      }
  
      if (vendor.isDisabled) {
        return {
          status: false,
          message:
            "This Seller Account has been restricted to login. Kindly connect the Support Team for more information.",
        };
      }
  
      const loginData = await signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          if (auth.currentUser) {
            const vendorDetails = await getUserFromFireBase(auth.currentUser.uid);
  
            setCurrentUser(vendorDetails[0]);
            return { status: true, message: "Login successfully" };
          }
        })
        .catch(() => {
          return {
            status: false,
            message: "Wrong Password, kindly try again",
          };
        });
  
      return loginData;
    } catch (error) {
      return {
        status: false,
        message: "Error in login, Kindly try after sometime",
      };
    }
  }

  function logout() {
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const vendorDetails = await getUserFromFireBase(user.uid);
        setCurrentUser(vendorDetails[0]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    userInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
