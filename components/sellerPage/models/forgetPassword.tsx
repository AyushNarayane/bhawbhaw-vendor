"use client";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       Modal.setAppElement("#__next");
//     }
//   }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email for further instructions");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Forgot Password"
    >
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ForgotPasswordModal;
