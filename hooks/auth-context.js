"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { getUserFromFireBase, getVendorByEmail } from "@/lib/firebaseFunc";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userInfo = useRef();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    try {
      const vendor = await getVendorByEmail(email);

      if (!vendor || vendor.length === 0) {
        return {
          status: false,
          message:
            "No Seller associated with this email. Kindly Register to access the Seller Panel.",
        };
      }

      if (vendor.isDisabled) {
        return {
          status: false,
          message:
            "This Seller Account has been restricted to login. Kindly connect with the Support Team for more information.",
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
            message: "Wrong Password, kindly try again.",
          };
        });

      return loginData;
    } catch (error) {
      return {
        status: false,
        message: "Error in login, kindly try after some time.",
      };
    }
  }

  function logout() {
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const vendorDetails = await getUserFromFireBase(user.uid);
          setCurrentUser(vendorDetails[0]);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [router]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  const value = {
    currentUser,
    login,
    logout,
    signup,
    userInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
