import { syncAndSignOut } from "../lib/auth";
import NavButton from "./layout/NavButton";

export default function SignOutButton({userId}: {userId: string}){
  return (
    <NavButton onClick={() => syncAndSignOut(userId)}> 
      Sign Out
    </NavButton>
  );
}