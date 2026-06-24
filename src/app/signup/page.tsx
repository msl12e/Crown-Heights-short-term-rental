"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  return (
    <div className="form-wrap">
      <h2>Create your account</h2>
      <p className="sub">Join as a guest to book stays, or as a host to list.</p>

      {state.error && <div className="alert alert-error">{state.error}</div>}

      <form action={formAction}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="role">I want to join as a</label>
          <select id="role" name="role" defaultValue="GUEST">
            <option value="GUEST">Guest — book stays</option>
            <option value="HOST">Host — list properties</option>
          </select>
        </div>
        <button type="submit" className="btn btn-block" disabled={pending}>
          {pending ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="form-foot">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
