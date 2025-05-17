import { syncAndSignOut } from "../lib/auth";

export default function SignOutButton({userId}: {userId: string}){
  return <button onClick={() => syncAndSignOut(userId)}> Sign Out</button>;
}