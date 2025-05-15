"use client";
import { login } from "@/app/lib//auth";

export const SignInButton = () => {
  return <button onClick={() => login()}> Sign In With Github</button>;
};
