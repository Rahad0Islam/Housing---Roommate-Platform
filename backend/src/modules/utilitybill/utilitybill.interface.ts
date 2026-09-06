// model UtilityBill {
//   id      String @id @default(uuid()) @db.Uuid
//   flatId  String @db.Uuid
//   ownerId String @db.Uuid

//   billingMonth DateTime
//   currentBill  Decimal  @db.Decimal(10, 2)
//   gasBill      Decimal  @db.Decimal(10, 2)
//   othersBill   Decimal  @db.Decimal(10, 2)
//   totalBill    Decimal  @db.Decimal(10, 2)

//   totalTenant   Int
//   perTenantBill Decimal @db.Decimal(10, 2)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   flat            Flat         @relation(fields: [flatId], references: [id], onDelete: Cascade)
//   owner           User         @relation(fields: [ownerId], references: [id], onDelete: Restrict)
//   monthlyPayments MonthlyPay[]

//   @@unique([flatId, billingMonth])
//   @@index([flatId])
//   @@index([ownerId])
//   @@index([billingMonth])
//   @@map("utility_bills")
// }

export interface IutilityBill {
  id: string;
  flatId: string;
  ownerId: string;
  billingMonth: Date;
  currentBill: number;
  gasBill: number;
  othersBill: number;
  totalBill: number;
  totalTenant: number;
  perTenantBill: number;
  createdAt: Date;
  updatedAt: Date;
}