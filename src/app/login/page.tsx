"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="form-wrap">
      <h2>Welcome back</h2>
      <p className="sub">Log in to manage your listings and bookings.</p>

      {state.error && <div className="alert alert-error">{state.error}</div>}

      <form action={formAction}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit" className="btn btn-block" disabled={pending}>
          {pending ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="form-foot">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
