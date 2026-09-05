
// id             String     @id @default(uuid()) @db.Uuid
//   ownerId        String     @db.Uuid
//   name           String     @db.VarChar(255)
//   address        String     @db.VarChar(500)
//   description    String?    @db.Text
//   numberOfFloors Int
//   city           String     @db.VarChar(100)
//   createdAt      DateTime   @default(now())
//   updatedAt      DateTime   @updatedAt

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