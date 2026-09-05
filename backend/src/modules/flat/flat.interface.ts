// model Flat {
//   id          String     @id @default(uuid()) @db.Uuid
//   buildingId  String     @db.Uuid
//   flatNumber  String     @db.VarChar(50)
//   floorNumber Int
//   bedrooms    Int
//   bathrooms   Int
//   balcony     Int        @default(0)
//   totalArea   Decimal    @db.Decimal(10, 2)
//   status      FlatStatus @default(AVAILABLE)
//   createdAt   DateTime   @default(now())
//   updatedAt   DateTime   @updatedAt

import { FlatStatus } from "../../../generated/prisma/enums";

//   building     Building      @relation(fields: [buildingId], references: [id], onDelete: Cascade)
//   rooms        Room[]
//   utilityBills UtilityBill[]

//   @@unique([buildingId, flatNumber])
//   @@index([buildingId])
//   @@index([status])
//   @@map("flats")
// }


export interface IFlat {
  id: string;
  buildingId: string;
  flatNumber: string;
  floorNumber: number;
  bedrooms: number;
  bathrooms: number;
  balcony?: number;
  totalArea: number;
  status?: FlatStatus;
}