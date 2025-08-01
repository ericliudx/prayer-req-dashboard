"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/utils/crypto";
import { apiClient } from "@/utils/api-util";
import { isAxiosError } from "axios";

export default function RegisterPage() {
  const abortController = new AbortController();
  const { isLoading } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Refs for keyboard navigation
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords don't match");
      return;
    }
    if (!emailInput || !passwordInput || !confirmPasswordInput) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      const hashedPassword = hashPassword(passwordInput);
      const response = await apiClient.post("REGISTER_ACCOUNT", abortController.signal, {
        displayName: emailInput,
        email: emailInput,
        password: hashedPassword,
      });
      if (response.success) {
        router.push("/");
      }
    } catch (e) {
      if (isAxiosError(e)) {
        console.error(e.message);
      }
    }
  };
  return (
    <div className="flex-1 p-4 bg-surface">
      <div className="justify-center items-center text-bold text-center text-lg text-accent p-2">Welcome Back</div>
      <div className="flex-1 justify-center w-full max-w-[400px] mx-auto">
        {error && <div className="text-error mb-4 text-center">{error}</div>}
        <input
          className="w-full h-12 rounded-lg px-4 mb-4 text-base bg-surface text-primary border"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          autoCapitalize="none"
          type="email"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") emailInputRef.current?.focus();
          }}
        />
        <input
          ref={passwordInputRef}
          className="w-full h-12 rounded-lg px-4 mb-4 text-base bg-surface text-primary border"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          type="password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRegister();
          }}
        />
        <input
          ref={confirmPasswordInputRef}
          className="w-full h-12 rounded-lg px-4 mb-4 text-base bg-surface text-primary border"
          placeholder="Confirm Password"
          value={confirmPasswordInput}
          onChange={(e) => setConfirmPasswordInput(e.target.value)}
          type="password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRegister();
          }}
        />
        <button
          className="w-full h-12 rounded-lg justify-center items-center my-4 bg-accent text-primary font-semibold disabled:opacity-70"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? <span>Loading...</span> : "Register"}
        </button>
        <div className="flex flex-row justify-center items-center pb-5">
          <a href="/reset-password" className="text-sm font-semibold text-accent">
            Forgot Password?
          </a>
        </div>
        <button
          className="w-full h-12 rounded-lg justify-center items-center my-4 bg-accent text-primary font-semibold disabled:opacity-70"
          disabled={isLoading}
        >
          <a href="/" className="">
            {isLoading ? <span>Loading...</span> : "Already have an account? Log in"}
          </a>
        </button>
      </div>
    </div>
  );
}
