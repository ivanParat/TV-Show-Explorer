"use client";
import { logout } from "@/app/lib//auth";

export const SignOutButton = () => {
  return <button onClick={() => logout()}> Sign Out</button>;
};
