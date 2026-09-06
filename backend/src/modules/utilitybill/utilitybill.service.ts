import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { IutilityBill } from "./utilitybill.interface";
import { format, startOfMonth } from 'date-fns';
import httpStatus from "http-status";

const createUtilityBill = async (utilityBillData: IutilityBill, ownerId: string) => {
  const { flatId,currentBill,gasBill,othersBill } = utilityBillData;
  const billingMonth = startOfMonth(utilityBillData.billingMonth); // Set billingMonth to the first day of the month
  const totalBill = currentBill + gasBill + othersBill;

  const utilityBill = await prisma.$transaction(async (tx) => {
    const flat = await tx.flat.findUnique({
      where: { id: flatId },
      include: {
        building: true,
        rooms: true,
      },
    });

    if (!flat) {
      throw new Error("Flat not found");
    }

    if (flat.building.ownerId !== ownerId) {
      throw new Error("You are not authorized to create a utility bill for this flat");
    }

    const existingUtilityBill = await tx.utilityBill.findFirst({
      where: {
        flatId,
        billingMonth
      },
    });



    if (existingUtilityBill) {
       if(format(existingUtilityBill?.billingMonth, 'yyyy-MM') === format(billingMonth, 'yyyy-MM')){
        throw new AppError(httpStatus.CONFLICT, "Utility bill already exists for this month");
    }
    }

    if(format(billingMonth, 'yyyy-MM') !== format(new Date(), 'yyyy-MM')){
      throw new Error("Utility bill can only be created for the current month");
    }
     

    

     //calculate total teanants in the flat .. per room  total tenants are room.maxOccupied - room.availableBed
    const totalTenant = flat.rooms.reduce((acc, room) => acc + (room.maxOccupants - room.availableBed), 0);

    const perTenantBill = totalTenant > 0 ? totalBill / totalTenant : 0;
    console.log("totalTenant", totalTenant);

     const newUtilityBill = await tx.utilityBill.create({
      data: {
        flatId,
        ownerId,
        billingMonth,
        currentBill,
        gasBill,
        othersBill,
        totalBill:(currentBill + gasBill + othersBill),
        totalTenant,
        perTenantBill,
      },
    });




    return newUtilityBill;
  });

  return utilityBill;
};


export const utilityBillService = {
  createUtilityBill,
};