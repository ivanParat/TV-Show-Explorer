import { signIn } from "next-auth/react";
import NavButton from "./layout/NavButton";

export default function SignInButton(){
  return (
    <NavButton onClick={() => signIn('github')} ariaLabel="Sign in"> 
      Sign In
    </NavButton>
  );
}