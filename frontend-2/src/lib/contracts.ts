export type Role = "TENANT" | "OWNER" | "ADMIN";
export type RentType = "SHORT_TERM" | "LONG_TERM";
export type Building = {
  id: string;
  name: string;
  address: string;
  description?: string;
  numberOfFloors?: number;
  city?: string;
  buildingImage?: string;
  ownerId?: string;
  flats?: Flat[];
  amenities?: Amenity[];
};
export type Flat = {
  id: string;
  buildingId: string;
  flatNumber: string;
  floorNumber: number;
  bedrooms: number;
  bathrooms: number;
  balcony?: number;
  totalArea: number;
  status: string;
  rooms?: Room[];
};
export type Room = {
  id: string;
  flatId: string;
  name: string;
  roomType: string;
  monthlyRent: number | string;
  dailyRent: number | string;
  maxOccupants: number;
  availableBed?: number;
  furnished: boolean;
  availableFrom?: string;
  status: string;
};
export type Amenity = {
  id: string;
  buildingId: string;
  name: string;
  description?: string;
};
export type Booking = {
  id: string;
  roomId: string;
  tenantId?: string;
  startDate: string;
  endDate: string;
  rentType: RentType;
  amount?: number | string;
  status: string;
  room?: Room & { flat?: Flat & { building?: Building } };
  payment?: Payment[];
};
export type Payment = {
  id: string;
  bookingId?: string;
  monthlyPaymentId?: string;
  amount: number | string;
  paymentType?: string;
  transactionId?: string;
  status: string;
  createdAt?: string;
};
export type UtilityBill = {
  id: string;
  flatId: string;
  billingMonth: string;
  currentBill: number | string;
  gasBill: number | string;
  othersBill: number | string;
  totalBill: number | string;
  totalTenant: number;
  perTenantBill: number | string;
  flat?: Flat;
};
export type MonthlyPayment = {
  id: string;
  roomId: string;
  utilityId?: string;
  tenantId: string;
  status: string;
  amount: number | string;
  billingMonth: string;
  flatId?: string;
  room?: Room;
};
export type RoommateProfile = {
  id: string;
  userId: string;
  bio?: string;
  budgetMin: number;
  budgetMax: number;
  genderPreference?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  cleanlinessLevel?: string;
  noiseTolerance?: string;
  sleepTime: string;
  wakeTime: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: string;
  profileImage?: string;
};
export type ListResult<T> = T[] | { data?: T[]; results?: T[]; meta?: unknown };
export function asList<T>(value: ListResult<T> | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value?.data ?? value?.results ?? [];
}
