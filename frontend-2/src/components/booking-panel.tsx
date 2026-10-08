"use client";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateBooking, useRooms } from "@/hooks/use-domain";
import { asList } from "@/lib/contracts";
export function BookingPanel({
  flats = [],
}: {
  flats?: { id: string; flatNumber: string }[];
}) {
  const router = useRouter();
  const [flatId, setFlatId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rentType, setRentType] = useState<"SHORT_TERM" | "LONG_TERM">(
    "SHORT_TERM",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const rooms = useRooms(flatId);
  const create = useCreateBooking();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    create.mutate(
      { roomId, rentType, startDate, endDate },
      {
        onSuccess: (booking) =>
          router.push(
            `/dashboard/tenant/bookings/${(booking as { id: string }).id}`,
          ),
      },
    );
  };
  return (
    <form className="booking-panel" onSubmit={submit}>
      <div className="booking-panel-heading">
        <div>
          <p className="kicker">Ready when you are</p>
          <h2>Make this place yours.</h2>
        </div>
        <CalendarDays size={21} />
      </div>
      <label>
        Flat
        <select
          required
          value={flatId}
          onChange={(event) => {
            setFlatId(event.target.value);
            setRoomId("");
          }}
        >
          <option value="">Choose a flat</option>
          {flats.map((flat) => (
            <option key={flat.id} value={flat.id}>
              {flat.flatNumber}
            </option>
          ))}
        </select>
      </label>
      <label>
        Room
        <select
          required
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        >
          <option value="">Choose a room</option>
          {asList(rooms.data).map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} - {room.monthlyRent}/month
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Rent type
          <select
            value={rentType}
            onChange={(event) =>
              setRentType(event.target.value as "SHORT_TERM" | "LONG_TERM")
            }
          >
            <option value="SHORT_TERM">Short term</option>
            <option value="LONG_TERM">Long term</option>
          </select>
        </label>
        <label>
          Start date
          <input
            required
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <label>
          End date
          <input
            required
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
      </div>
      {create.error && <p className="form-error">{create.error.message}</p>}
      <button
        type="button"
        className="button button-primary button-large"
        disabled={create.isPending || !roomId}
      >
        {create.isPending ? "Creating booking..." : "Create booking"}
      </button>
      <p className="muted">
        <CheckCircle2 size={14} /> Your booking is validated by the backend
        before it is created.
      </p>
    </form>
  );
}
