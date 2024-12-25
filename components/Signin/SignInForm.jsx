"use client";
import React, { useEffect, useState } from "react";
import logo from "../../public/logoHeader.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth-context";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password is too short; it should be at least 5 characters" }),
});

const SignInForm = () => {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [loading, setLoading] = useState('')
  const [showPassword, setShowPassword] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    console.log(currentUser)
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser]);

  async function onSubmit(values) {
    const { email, password } = form.getValues();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }    
    try {
      setLoading(true);
  
      const res = await login(values.email, values.password);
  
      if (res.status) {
        console.log(res);
        router.push("/dashboard");
      } else {
        console.error(res.message);
        toast.error(res.message)
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword= async (e) => {
    e.preventDefault();
    const { email } = form.getValues();

      if(!email){
      toast.error("Email is required")
      return
      }
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email");
        return;
      }
  
    try {
        const response = await fetch("/api/auth/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            toast.success(data.message);
        } else {
          toast.error(data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
  
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-16">
      <div className="flex justify-start mb-3">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={80}
          className="h-20 w-auto"
        />
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">
        Welcome back !!!
      </h2>
      <h1 className="text-left text-4xl font-bold mb-3">Sign in</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative mt-10 mb-10">
        <div className="mb-4">
          <label
            className="block text-black text-sm mb-2 font-poppins"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="bhawbhaw@gmail.com"
            {...form.register("email")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          />
        </div>
        <div className="mb-4 relative">
        <label
            className="block text-black text-sm mb-2 font-poppins"
            htmlFor="password"
        >
          Password
        </label>
        <div className="flex justify-between items-center relative">
          <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              {...form.register("password")}
              className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
              required
            />
            <span
              className="absolute right-3 cursor-pointer text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline size={20} color="black" />}
            </span>
        </div>
          <div className="text-right mt-4">
          <button type="button" onClick={handleForgotPassword} className="text-sm text-gray-500 hover:text-gray-800">
            Forgot Password?
          </button>
        </div>
        </div>
          
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-baw-red text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-baw-yellow"
          >
            {loading ? <ClipLoader size={17} color={"#fff"} loading={loading} className="mx-8 my-1"/> : (
              <>
                <span>SIGN IN</span>
                <span className="ml-2">➔</span>
              </>
            )}
          </button>
        </div>
        <label
          className="absolute text-nowrap -bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm mb-2 font-poppins flex justify-center"
          htmlFor="password"
        >
          Don&apos;t have an account?
          <Link href="/signup" className="text-sm text-red-500 ml-2">
            Signup
          </Link>
        </label>
      </form>
    </div>
  );
};

export default SignInForm;
