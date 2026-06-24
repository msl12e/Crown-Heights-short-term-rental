import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <h1>
        <Link href="/">Crown Heights Rentals</Link>
      </h1>

      <nav className="site-nav">
        <Link href="/">Home</Link>
        <Link href="/properties">Properties</Link>

        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}

        {user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <span className="nav-user">{user.name}</span>
            <form action={logoutAction}>
              <button type="submit">Logout</button>
            </form>
          </>
        )}
      </nav>
    </header>
  );
}
