import { BuildingWhereInput }from "../../../generated/prisma/models";

export interface IBuilding{
    id: string;
    name: string;
    address: string;
    description?: string;
    numberOfFloors: number;
    city: string;
    buildingImage?: string;
    buildingImagePublicId?: string;
}


export interface IbuildingSearchQuery extends BuildingWhereInput {
page?: string;
  limit?: string;
  sortBy?: string;
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
}