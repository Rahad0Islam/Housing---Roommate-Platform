export interface IOwner {
  id: string;
  name: string;
  email: string;
}

export interface IAmenity {
  id: string;
  name: string;
}

export interface IRoom {
  id: string;
  flatId: string;
  name: string;
  roomType: string;
  monthlyRent: string; 
  dailyRent: string;
  maxOccupants: number;
  availableBed: number;
  furnished: boolean;
  availableFrom: string;
  status: string;
  roomImage: string | null;
  roomImagePublicId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IFlat {
  id: string;
  buildingId: string;
  flatNumber: string;
  floorNumber: number;
  bedrooms: number;
  bathrooms: number;
  balcony: number;
  totalArea: string; 
  status: string;
  createdAt: string;
  updatedAt: string;
  rooms: IRoom[];
}

export interface IBuilding {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  description: string;
  numberOfFloors: number;
  numberOfFlats: number;
  city: string;
  buildingImage: string | null;
  buildingImagePublicId: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: IOwner;
  amenities: IAmenity[];
  flats: IFlat[];
}

export interface IBuildingSearchQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  name?: string;
  description?: string;
  id?: string;
  city?: string;
  numberOfFloors?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}
