"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, CircleAlert, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useAnalytics,
  useBookingAction,
  useBookings,
  useBuilding,
  useBuildings,
  useCreateAmenity,
  useCreateBuilding,
  useCreateFlat,
  useCreateMonthly,
  useCreateRoom,
  useCreateUtility,
  useDeleteAmenity,
  useDeleteBuilding,
  useDeleteFlat,
  useDeleteRoom,
  useDeleteRoommate,
  useFlats,
  useMonthlyPayments,
  useOwnerApplicationAction,
  useOwnerApplications,
  useRoommateProfile,
  useRooms,
  useSaveRoommate,
  useUtilities,
} from "@/hooks/use-domain";
import { paymentApi } from "@/lib/api/domain";
import { asList } from "@/lib/contracts";

const buildingSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  numberOfFloors: z.coerce.number().int().positive(),
  description: z.string().optional(),
});
type Props = { role: "tenant" | "owner" | "admin"; section: string };
type FormValues = z.input<typeof buildingSchema>;
function Feedback({
  error,
  success,
}: {
  error?: Error | null;
  success?: string;
}) {
  return (
    <>
      {error && (
        <p className="form-error">
          <CircleAlert size={14} /> {error.message}
        </p>
      )}
      {success && (
        <p className="form-success">
          <Check size={14} /> {success}
        </p>
      )}
    </>
  );
}
function BuildingForm() {
  const create = useCreateBuilding();
  const form = useForm<FormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: { numberOfFloors: 1 },
  });
  return (
    <form
      className="inline-form"
      onSubmit={form.handleSubmit((body) =>
        create.mutate(body, {
          onSuccess: () => form.reset({ numberOfFloors: 1 }),
        }),
      )}
    >
      <input placeholder="Building name" {...form.register("name")} />
      <input placeholder="Address" {...form.register("address")} />
      <input placeholder="City" {...form.register("city")} />
      <input
        type="number"
        min="1"
        placeholder="Floors"
        {...form.register("numberOfFloors")}
      />
      <button
        type="submit"
        className="button button-primary"
        disabled={create.isPending}
      >
        <Plus size={15} /> {create.isPending ? "Saving..." : "Add building"}
      </button>
      <Feedback error={create.error} />
    </form>
  );
}
function BuildingsView() {
  const query = useBuildings(true);
  const remove = useDeleteBuilding();
  const data = asList(query.data);
  return (
    <Section title="Buildings" description="The places you own and manage.">
      <BuildingForm />
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="No buildings yet. Add your first building above."
        headers={["Name", "Address", "City", "Floors", ""]}
      >
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.address}</td>
            <td>{item.city ?? "-"}</td>
            <td>{item.numberOfFloors ?? "-"}</td>
            <td>
              <button
                type="button"
                className="table-action danger"
                onClick={() => remove.mutate(item.id)}
                disabled={remove.isPending}
              >
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
function BuildingSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const query = useBuildings(true);
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Choose building</option>
      {asList(query.data).map((building) => (
        <option key={building.id} value={building.id}>
          {building.name}
        </option>
      ))}
    </select>
  );
}
function FlatForm({ buildingId }: { buildingId: string }) {
  const create = useCreateFlat();
  const [values, setValues] = useState({
    flatNumber: "",
    floorNumber: 1,
    bedrooms: 1,
    bathrooms: 1,
    balcony: 0,
    totalArea: 0,
    status: "AVAILABLE",
  });
  return (
    <form
      className="inline-form"
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate({ buildingId, body: values });
      }}
    >
      <input
        required
        placeholder="Flat number"
        value={values.flatNumber}
        onChange={(e) => setValues({ ...values, flatNumber: e.target.value })}
      />
      <input
        required
        type="number"
        placeholder="Floor"
        value={values.floorNumber}
        onChange={(e) =>
          setValues({ ...values, floorNumber: Number(e.target.value) })
        }
      />
      <input
        required
        type="number"
        placeholder="Area"
        value={values.totalArea}
        onChange={(e) =>
          setValues({ ...values, totalArea: Number(e.target.value) })
        }
      />
      <button
        type="submit"
        className="button button-primary"
        disabled={!buildingId || create.isPending}
      >
        <Plus size={15} /> Add flat
      </button>
      <Feedback error={create.error} />
    </form>
  );
}
function FlatsView() {
  const [buildingId, setBuildingId] = useState("");
  const query = useFlats(buildingId);
  const remove = useDeleteFlat();
  return (
    <Section
      title="Flats"
      description="Organize the spaces inside your buildings."
    >
      <BuildingSelect value={buildingId} onChange={setBuildingId} />
      <FlatForm buildingId={buildingId} />
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="Choose a building to view flats."
        headers={["Flat", "Floor", "Bedrooms", "Bathrooms", "Status", ""]}
      >
        {asList(query.data).map((item) => (
          <tr key={item.id}>
            <td>{item.flatNumber}</td>
            <td>{item.floorNumber}</td>
            <td>{item.bedrooms}</td>
            <td>{item.bathrooms}</td>
            <td>
              <Status value={item.status} />
            </td>
            <td>
              <button
                type="button"
                className="table-action danger"
                onClick={() => remove.mutate(item.id)}
              >
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
function RoomForm({ flatId }: { flatId: string }) {
  const create = useCreateRoom();
  const [values, setValues] = useState({
    name: "",
    roomType: "SINGLE",
    monthlyRent: 0,
    dailyRent: 0,
    maxOccupants: 1,
    furnished: false,
    availableFrom: new Date().toISOString().slice(0, 10),
    status: "AVAILABLE",
  });
  return (
    <form
      className="inline-form"
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate({ flatId, body: values });
      }}
    >
      <input
        required
        placeholder="Room name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <select
        value={values.roomType}
        onChange={(e) => setValues({ ...values, roomType: e.target.value })}
      >
        <option>SINGLE</option>
        <option>SHARED</option>
        <option>MASTER</option>
      </select>
      <input
        required
        type="number"
        placeholder="Monthly rent"
        value={values.monthlyRent}
        onChange={(e) =>
          setValues({ ...values, monthlyRent: Number(e.target.value) })
        }
      />
      <input
        required
        type="number"
        placeholder="Daily rent"
        value={values.dailyRent}
        onChange={(e) =>
          setValues({ ...values, dailyRent: Number(e.target.value) })
        }
      />
      <button
        type="submit"
        className="button button-primary"
        disabled={!flatId || create.isPending}
      >
        <Plus size={15} /> Add room
      </button>
      <Feedback error={create.error} />
    </form>
  );
}
function RoomsView() {
  const [flatId, setFlatId] = useState("");
  const query = useRooms(flatId);
  const remove = useDeleteRoom();
  const buildings = useBuildings(true);
  const [buildingId, setBuildingId] = useState("");
  const flats = useFlats(buildingId);
  return (
    <Section
      title="Rooms"
      description="Control availability and pricing room by room."
    >
      <BuildingSelect
        value={buildingId}
        onChange={(value) => {
          setBuildingId(value);
          setFlatId("");
        }}
      />
      <select
        value={flatId}
        onChange={(event) => setFlatId(event.target.value)}
      >
        <option value="">Choose flat</option>
        {asList(flats.data).map((flat) => (
          <option key={flat.id} value={flat.id}>
            {flat.flatNumber}
          </option>
        ))}
      </select>
      <RoomForm flatId={flatId} />
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="Choose a flat to view rooms."
        headers={["Name", "Type", "Monthly rent", "Capacity", "Status", ""]}
      >
        {asList(query.data).map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.roomType}</td>
            <td>{item.monthlyRent}</td>
            <td>{item.maxOccupants}</td>
            <td>
              <Status value={item.status} />
            </td>
            <td>
              <button
                type="button"
                className="table-action danger"
                onClick={() => remove.mutate(item.id)}
              >
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <span className="sr-only">
        {buildings.isLoading ? "Loading buildings" : ""}
      </span>
    </Section>
  );
}
function AmenitiesView() {
  const [buildingId, setBuildingId] = useState("");
  const query = useBuilding(buildingId);
  const create = useCreateAmenity();
  const remove = useDeleteAmenity();
  const [values, setValues] = useState({ name: "", description: "" });
  const amenities = query.data?.amenities ?? [];
  return (
    <Section
      title="Amenities"
      description="Keep property features accurate for residents."
    >
      <BuildingSelect value={buildingId} onChange={setBuildingId} />
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate({ ...values, buildingId });
        }}
      >
        <input
          required
          placeholder="Amenity name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <button
          type="submit"
          className="button button-primary"
          disabled={!buildingId || create.isPending}
        >
          <Plus size={15} /> Add amenity
        </button>
      </form>
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="Choose a building to view amenities."
        headers={["Name", "Description", ""]}
      >
        {amenities.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.description ?? "-"}</td>
            <td>
              <button
                type="button"
                className="table-action danger"
                onClick={() => remove.mutate(item.id)}
              >
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
function BookingsView({ role }: { role: string }) {
  const query = useBookings();
  const action = useBookingAction(
    role === "owner" || role === "admin" ? "ongoing" : "cancel",
  );
  const complete = useBookingAction("complete");
  return (
    <Section
      title="Bookings"
      description="Track real reservation activity and status changes."
    >
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="No bookings have been recorded yet."
        headers={["Booking", "Room", "Dates", "Rent type", "Status", "Actions"]}
      >
        {asList(query.data).map((item) => (
          <tr key={item.id}>
            <td className="mono">{item.id.slice(0, 8)}</td>
            <td>{item.room?.name ?? item.roomId.slice(0, 8)}</td>
            <td>
              {new Date(item.startDate).toLocaleDateString()} -{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </td>
            <td>{item.rentType}</td>
            <td>
              <Status value={item.status} />
            </td>
            <td className="action-row">
              <button
                type="button"
                className="table-action"
                onClick={() => action.mutate(item.id)}
              >
                {role === "tenant" ? "Cancel" : "Start"}
              </button>
              <button
                type="button"
                className="table-action"
                onClick={() => complete.mutate(item.id)}
              >
                Complete
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
function PaymentsView() {
  return (
    <Section
      title="Payments"
      description="Payment records are created and verified by the backend bKash flow."
    >
      <div className="empty-state">
        <h2>Verified payment history</h2>
        <p>
          Payment records are returned through booking and monthly payment
          relationships. Start from a booking or rent bill to create a verified
          bKash payment.
        </p>
        <Link className="text-link" href="/properties">
          Find a room <ArrowUpRight size={15} />
        </Link>
      </div>
    </Section>
  );
}
function BillsView({
  monthly = false,
  role,
}: {
  monthly?: boolean;
  role: string;
}) {
  const monthlyQuery = useMonthlyPayments();
  const utilityQuery = useUtilities();
  const createUtility = useCreateUtility();
  const _createMonthly = useCreateMonthly();
  const [body, setBody] = useState({
    flatId: "",
    billingMonth: new Date().toISOString().slice(0, 10),
    currentBill: 0,
    gasBill: 0,
    othersBill: 0,
  });
  const data = monthly ? asList(monthlyQuery.data) : asList(utilityQuery.data);
  return (
    <Section
      title={monthly ? "Monthly rent" : "Utility bills"}
      description={
        monthly
          ? "Review rent bills and their verified payment status."
          : "Review or issue current-month utility bills."
      }
    >
      {role === "owner" && !monthly && (
        <form
          className="inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            createUtility.mutate(body);
          }}
        >
          <input
            required
            placeholder="Flat ID"
            value={body.flatId}
            onChange={(e) => setBody({ ...body, flatId: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Current bill"
            value={body.currentBill}
            onChange={(e) =>
              setBody({ ...body, currentBill: Number(e.target.value) })
            }
          />
          <input
            required
            type="number"
            placeholder="Gas bill"
            value={body.gasBill}
            onChange={(e) =>
              setBody({ ...body, gasBill: Number(e.target.value) })
            }
          />
          <input
            required
            type="number"
            placeholder="Other bill"
            value={body.othersBill}
            onChange={(e) =>
              setBody({ ...body, othersBill: Number(e.target.value) })
            }
          />
          <button
            type="submit"
            className="button button-primary"
            disabled={createUtility.isPending}
          >
            <Plus size={15} /> Issue bill
          </button>
        </form>
      )}
      {role === "owner" && monthly && (
        <p className="muted">
          Monthly bills are generated from confirmed room bookings by the
          backend. Use the bill creation workflow when a tenant is assigned.
        </p>
      )}
      <DataTable
        loading={monthly ? monthlyQuery.isLoading : utilityQuery.isLoading}
        error={monthly ? monthlyQuery.error : utilityQuery.error}
        empty={`No ${monthly ? "monthly rent bills" : "utility bills"} found.`}
        headers={["Bill", "Period", "Amount", "Status", ""]}
      >
        {data.map((item) => (
          <tr key={item.id}>
            <td className="mono">{item.id.slice(0, 8)}</td>
            <td>{new Date(item.billingMonth).toLocaleDateString()}</td>
            <td>{"totalBill" in item ? item.totalBill : item.amount}</td>
            <td>
              <Status
                value={
                  ("status" in item ? item.status : "PENDING") ?? "PENDING"
                }
              />
            </td>
            <td>
              {monthly && (
                <button
                  type="button"
                  className="table-action"
                  onClick={() =>
                    void paymentApi.createMonthlyPayment({
                      monthlyPaymentId: item.id,
                    })
                  }
                >
                  Pay with bKash
                </button>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
function RoommatesView() {
  const query = useRoommateProfile();
  const save = useSaveRoommate(Boolean(query.data));
  const remove = useDeleteRoommate();
  const [body, setBody] = useState({
    bio: query.data?.bio ?? "",
    budgetMin: query.data?.budgetMin ?? 0,
    budgetMax: query.data?.budgetMax ?? 0,
    genderPreference: query.data?.genderPreference ?? "ANY",
    sleepTime: query.data?.sleepTime ?? "22:00",
    wakeTime: query.data?.wakeTime ?? "07:00",
  });
  return (
    <Section
      title="Roommates"
      description="Maintain your profile for compatible household discovery."
    >
      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate(body);
        }}
      >
        <textarea
          placeholder="A little about your living style"
          value={body.bio}
          onChange={(e) => setBody({ ...body, bio: e.target.value })}
        />
        <div className="form-grid">
          <input
            type="number"
            placeholder="Minimum budget"
            value={body.budgetMin}
            onChange={(e) =>
              setBody({ ...body, budgetMin: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Maximum budget"
            value={body.budgetMax}
            onChange={(e) =>
              setBody({ ...body, budgetMax: Number(e.target.value) })
            }
          />
          <select
            value={body.genderPreference}
            onChange={(e) =>
              setBody({ ...body, genderPreference: e.target.value })
            }
          >
            <option>ANY</option>
            <option>MALE</option>
            <option>FEMALE</option>
          </select>
          <input
            type="time"
            value={body.sleepTime}
            onChange={(e) => setBody({ ...body, sleepTime: e.target.value })}
          />
          <input
            type="time"
            value={body.wakeTime}
            onChange={(e) => setBody({ ...body, wakeTime: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="button button-primary"
          disabled={save.isPending}
        >
          {save.isPending ? "Saving..." : "Save roommate profile"}
        </button>
        <Feedback error={save.error} />
      </form>
      {query.data && (
        <button
          type="button"
          className="button button-outline danger-button"
          onClick={() => remove.mutate()}
        >
          Delete profile
        </button>
      )}
    </Section>
  );
}
function DashboardView({ role }: { role: "tenant" | "owner" | "admin" }) {
  const query = useAnalytics(role);
  const data = query.data ?? {};
  return (
    <Section
      title="A clearer view of home."
      description={`Live ${role} analytics from the backend.`}
    >
      <div className="stats-grid">
        <Metric
          label="Bookings"
          value={data.bookings ?? data.totalBookings ?? 0}
        />
        <Metric
          label="Revenue"
          value={data.revenue ?? data.totalRevenue ?? 0}
        />
        <Metric
          label="Occupancy"
          value={data.occupancy ?? data.occupancyRate ?? 0}
        />
      </div>
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="No analytics are available yet."
        headers={["Metric", "Value"]}
      >
        {Object.entries(data)
          .slice(0, 12)
          .map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </td>
            </tr>
          ))}
      </DataTable>
    </Section>
  );
}
function Metric({ label, value }: { label: string; value: unknown }) {
  return (
    <article>
      <span className="muted">{label}</span>
      <strong>{String(value)}</strong>
    </article>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className={`status status-${value.toLowerCase()}`}>{value}</span>
  );
}
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-view">
      <div className="section-view-heading">
        <div>
          <p className="kicker">Live workspace</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
function DataTable({
  headers,
  children,
  loading,
  error,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  loading: boolean;
  error: Error | null;
  empty: string;
}) {
  if (loading) return <div className="skeleton table-skeleton" />;
  if (error)
    return (
      <div className="empty-state">
        <h2>Could not load this view</h2>
        <p>{error.message}</p>
      </div>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {!children && (
        <div className="empty-state">
          <p>{empty}</p>
        </div>
      )}
    </div>
  );
}
function OwnerApplicationsView() {
  const query = useOwnerApplications();
  const approve = useOwnerApplicationAction("approve");
  const reject = useOwnerApplicationAction("reject");
  return (
    <Section
      title="Owner applications"
      description="Review applications submitted through the backend owner workflow."
    >
      <DataTable
        loading={query.isLoading}
        error={query.error}
        empty="No owner applications found."
        headers={["Applicant", "Email", "Status", "Actions"]}
      >
        {asList(query.data).map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>
              <Status value={item.status ?? "PENDING"} />
            </td>
            <td className="action-row">
              <button
                type="button"
                className="table-action"
                onClick={() => approve.mutate(item.id)}
                disabled={approve.isPending}
              >
                Approve
              </button>
              <button
                type="button"
                className="table-action danger"
                onClick={() => reject.mutate(item.id)}
                disabled={reject.isPending}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Section>
  );
}
export function WorkspaceView({ role, section }: Props) {
  const normalized = section.toLowerCase();
  if (!normalized || normalized === "dashboard")
    return <DashboardView role={role} />;
  if (normalized === "buildings") return <BuildingsView />;
  if (normalized === "flats") return <FlatsView />;
  if (normalized === "rooms") return <RoomsView />;
  if (normalized === "amenities") return <AmenitiesView />;
  if (normalized === "bookings") return <BookingsView role={role} />;
  if (normalized === "payments") return <PaymentsView />;
  if (normalized === "rent" || normalized === "monthlypay")
    return <BillsView monthly role={role} />;
  if (normalized === "utilities") return <BillsView role={role} />;
  if (normalized === "roommates") return <RoommatesView />;
  if (normalized === "analytics") return <DashboardView role={role} />;
  if (normalized === "owners") return <OwnerApplicationsView />;
  if (
    normalized === "profile" ||
    normalized === "settings" ||
    normalized === "users"
  )
    return (
      <Section
        title={normalized[0].toUpperCase() + normalized.slice(1)}
        description="This view is governed by the current account and backend permissions."
      >
        <div className="empty-state">
          <h2>Account controls</h2>
          <p>
            The backend does not expose a general list or update contract for
            this section yet. Existing supported actions remain available
            through the authenticated modules.
          </p>
        </div>
      </Section>
    );
  return <DashboardView role={role} />;
}
