export interface ResponseEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export enum UserRole {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  TENANT = "TENANT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingWithDetails extends Building {
  flats?: any[];
  rooms?: any[];
}

export interface Flat {
  id: string;
  buildingId: string;
  flatNumber: string;
  floor: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export enum RoomType {
  SINGLE = "SINGLE",
  SHARED = "SHARED",
}

export interface Room {
  id: string;
  flatId: string;
  roomNumber: string;
  type: RoomType;
  rentAmount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  ON_GOING = "ON_GOING",
}

export interface Booking {
  id: string;
  tenantId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}
