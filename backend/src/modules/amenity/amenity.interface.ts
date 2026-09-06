// model Amenity {
//   id          String   @id @default(uuid()) @db.Uuid
//   buildingId  String   @db.Uuid
//   name        String   @db.VarChar(100)
//   description String?  @db.VarChar(500)
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt

//   building Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)

//   @@unique([buildingId, name])
//   @@index([buildingId])
//   @@map("amenities")
// }


export interface IAmenity {
  id: string;
  buildingId: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}