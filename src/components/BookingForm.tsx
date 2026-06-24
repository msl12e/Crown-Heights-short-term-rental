"use client";

import { useActionState } from "react";
import { createBookingAction, type FormState } from "@/lib/actions/bookings";
import { formatPrice } from "@/lib/format";

const initialState: FormState = {};

export default function BookingForm({
  propertyId,
  pricePerNight,
  maxGuests,
}: {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
}) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    initialState,
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-box">
      <p className="price" style={{ fontSize: 22, marginBottom: 16 }}>
        {formatPrice(pricePerNight)} <span>/ night</span>
      </p>

      {state.error && <div className="alert alert-error">{state.error}</div>}

      <form action={formAction}>
        <input type="hidden" name="propertyId" value={propertyId} />
        <div className="field-row">
          <div className="field">
            <label htmlFor="checkIn">Check-in</label>
            <input id="checkIn" name="checkIn" type="date" min={today} required />
          </div>
          <div className="field">
            <label htmlFor="checkOut">Check-out</label>
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              min={today}
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={maxGuests}
            defaultValue={1}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="message">Message to host (optional)</label>
          <textarea id="message" name="message" />
        </div>
        <button type="submit" className="btn btn-block" disabled={pending}>
          {pending ? "Sending request…" : "Request to Book"}
        </button>
      </form>
    </div>
  );
}
