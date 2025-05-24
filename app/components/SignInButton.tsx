import { signIn } from "next-auth/react";
import NavButton from "./layout/NavButton";

export default function SignInButton(){
  return (
    <NavButton onClick={() => signIn('github')}> 
      Sign In
    </NavButton>
  );
}