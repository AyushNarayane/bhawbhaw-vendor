"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@/hooks/auth-context";
import { auth } from "@/firebase";

const Protected = (WrappedComponent, allowedRoles) => {
  const WithAuth = (props) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const checkAuthorization = async () => {
        if (currentUser && currentUser.personalDetails) {
          try {
            const { isEcommerce, isService } = currentUser.personalDetails;
            
            if (
              (isEcommerce && allowedRoles.includes("Ecommerce")) ||
              (isService && allowedRoles.includes("Service"))
            ) {
              setIsAuthorized(true);
            } else {
              await auth.signOut();
              toast.error("Unauthorized access.");
              router.push("/signin");
            }
          } catch (error) {
            console.error("Error checking user authorization:", error);
            toast.error("An error occurred. Please try again.");
            await auth.signOut();
            router.push("/signin");
          } finally {
            setAuthChecked(true);
          }
        } else if (currentUser === null) {
          router.push("/signin");
          setAuthChecked(true);
        }
      };

      if (currentUser !== undefined) {
        checkAuthorization();
      }
    }, [currentUser, router, allowedRoles]);

    if (!authChecked) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader size={50} color={"#00704a"} loading />
        </div>
      );
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default Protected;
