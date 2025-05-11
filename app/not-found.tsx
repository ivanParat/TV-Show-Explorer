import Link from "next/link";

export default function NotFound() {
 return (
  <div>
    <h2>404 - Not Found</h2>
    <p>Page does not exist!</p>
    <Link href='/'>Go back to home page</Link>
  </div>
 );
}
