"use client";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useBooking,
  useBookingAction,
  useCreatePayment,
} from "@/hooks/use-domain";
export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const _router = useRouter();
  const query = useBooking(id);
  const cancel = useBookingAction("cancel");
  const complete = useBookingAction("complete");
  const pay = useCreatePayment();
  const startPayment = () => {
    pay.mutate(
      { bookingId: id },
      {
        onSuccess: (result) => {
          const paymentResult = result as {
            paymentUrl?: string;
            bkashURL?: string;
            redirectURL?: string;
          };
          const target =
            paymentResult.paymentUrl ??
            paymentResult.bkashURL ??
            paymentResult.redirectURL;
          if (target) window.location.assign(target);
        },
      },
    );
  };
  if (query.isLoading)
    return (
      <main className="page-wrap container">
        <div className="skeleton table-skeleton" />
      </main>
    );
  if (query.error || !query.data)
    return (
      <main className="page-wrap container">
        <div className="empty-state">
          <h2>Booking unavailable</h2>
          <p>{query.error?.message ?? "This booking could not be found."}</p>
          <Link className="text-link" href="/dashboard/tenant/bookings">
            <ArrowLeft size={15} /> Back to bookings
          </Link>
        </div>
      </main>
    );
  const booking = query.data;
  return (
    <main className="detail-page container">
      <Link className="text-link" href="/dashboard/tenant/bookings">
        <ArrowLeft size={15} /> Back to bookings
      </Link>
      <div className="booking-detail">
        <div>
          <p className="kicker">Booking {booking.id.slice(0, 8)}</p>
          <h1>{booking.room?.name ?? "Reserved room"}</h1>
          <p className="muted">
            <MapPin size={15} />
            {booking.room?.flat?.building?.address ?? "Residence details"}
          </p>
          <div className="detail-facts">
            <span>
              Start {new Date(booking.startDate).toLocaleDateString()}
            </span>
            <span>End {new Date(booking.endDate).toLocaleDateString()}</span>
            <span>{booking.rentType}</span>
            <span>{booking.amount ?? "Amount pending"}</span>
          </div>
          <span className={`status status-${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>
        <div className="booking-actions">
          <button
            type="button"
            className="button button-primary button-large"
            onClick={startPayment}
            disabled={pay.isPending}
          >
            {pay.isPending ? (
              "Opening bKash..."
            ) : (
              <>
                <CreditCard size={16} /> Pay with bKash
              </>
            )}
          </button>
          <button
            type="button"
            className="button button-outline"
            onClick={() => cancel.mutate(id)}
            disabled={cancel.isPending}
          >
            Cancel booking
          </button>
          <button
            type="button"
            className="button button-outline"
            onClick={() => complete.mutate(id)}
            disabled={complete.isPending}
          >
            Complete booking
          </button>
          {pay.error && <p className="form-error">{pay.error.message}</p>}
        </div>
      </div>
    </main>
  );
}
