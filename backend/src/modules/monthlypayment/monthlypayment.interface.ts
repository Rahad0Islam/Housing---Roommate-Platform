import { MonthlyPaymentStatus } from "../../../generated/prisma/client";
import { MonthlyPayWhereInput } from "../../../generated/prisma/models";

// model MonthlyPay {
//   id        String  @id @default(uuid()) @db.Uuid
//   roomId    String  @db.Uuid
//   utilityId String? @db.Uuid
//   tenantId  String  @db.Uuid


//   status       MonthlyPaymentStatus @default(PENDING)
//   amount       Decimal              @db.Decimal(10, 2)
//   billingMonth DateTime

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   room    Room         @relation(fields: [roomId], references: [id], onDelete: Restrict)
//   utility UtilityBill? @relation(fields: [utilityId], references: [id], onDelete: SetNull)
//   tenant  User         @relation(fields: [tenantId], references: [id], onDelete: Restrict)

//   payments Payment[]

//   @@unique([roomId, tenantId, billingMonth])
//   @@index([tenantId])
//   @@index([roomId])
//   @@index([utilityId])
//   @@index([status])
//   @@index([billingMonth])
//   @@map("monthly_payments")
// }

export interface ImonthlyPayment {
  id: string;
  roomId: string;
  utilityId?: string | null;
  tenantId: string;
  status: MonthlyPaymentStatus;
  amount: number;
  billingMonth: Date;
  createdAt: Date;
  updatedAt: Date;
  flatId: string; // Added flatId property
}


export interface ImonthlyPaymentSearchQuery extends MonthlyPayWhereInput {
page?: string;
  limit?: string;
  sortBy?: string;
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
}