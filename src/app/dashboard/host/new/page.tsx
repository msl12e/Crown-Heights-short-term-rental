"use client";

import { useActionState } from "react";
import {
  createPropertyAction,
  type FormState,
} from "@/lib/actions/properties";

const initialState: FormState = {};

export default function NewPropertyPage() {
  const [state, formAction, pending] = useActionState(
    createPropertyAction,
    initialState,
  );

  return (
    <div className="form-wrap wide">
      <h2>List a property</h2>
      <p className="sub">
        Your listing will be reviewed by an admin before it goes live.
      </p>

      {state.error && <div className="alert alert-error">{state.error}</div>}

      <form action={formAction}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Crown Heights, Brooklyn"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="pricePerNight">Price per night (USD)</label>
            <input
              id="pricePerNight"
              name="pricePerNight"
              type="number"
              min={1}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={1}
              defaultValue={1}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="maxGuests">Max guests</label>
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min={1}
              defaultValue={2}
            />
          </div>
          <div className="field">
            <label htmlFor="imageUrl">Photo URL (optional)</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://…"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-block" disabled={pending}>
          {pending ? "Submitting…" : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
