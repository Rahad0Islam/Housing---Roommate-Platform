import { BookingStatus, UserRole } from "../../../generated/prisma/enums";
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


// find all Utlity bills for using rbac

const findAllUtilityBills = async (userId: string, role: string) => {
  
    let utilityBills;
    if(role === UserRole.OWNER){
         utilityBills = await prisma.utilityBill.findMany({
            where: { ownerId: userId },
            include: {
                flat: true,
            },
        });
    }
    else if(role === UserRole.TENANT){
        utilityBills = await prisma.utilityBill.findMany({
            where: {
                flat: {
                    rooms: {
                        some: {
                            bookings: {
                                some: {
                                    tenantId: userId,
                                    status: BookingStatus.CONFIRMED,
                                },
                            },
                        },
                    },
                },
            },
            include: {
                flat: true,
            },
        });
    }
    else {
        utilityBills = await prisma.utilityBill.findMany({
            include: {
                flat: true,
            },
        });
    }
       
    

  return utilityBills;
};




const getUtilityBillById = async (utilityBillId: string,role: string,userId : string) => {
  //check rbac for owner and tenant
  let utilityBill;
  if(role === UserRole.OWNER){
    utilityBill = await prisma.utilityBill.findUnique({
      where: { id: utilityBillId,ownerId: userId },
      include: {
        flat: true,
      },
    });
  }
  else if(role === UserRole.TENANT){
    utilityBill = await prisma.utilityBill.findUnique({
      where: {
        id: utilityBillId,
        flat: {
          rooms: {
            some: {
              bookings: {
                some: {
                  tenantId: userId,
                  status: BookingStatus.CONFIRMED,
                },
              },
            },
          },
        },
      },
      include: {
        flat: true,
      },
    });
  }
  else{
    utilityBill = await prisma.utilityBill.findUnique({
      where: { id: utilityBillId },
      include: {
        flat: true,
      },
    });
  }

  if (!utilityBill) {
    throw new AppError(httpStatus.NOT_FOUND, "Utility bill not found");
  }

  return utilityBill;
};
  

const getUtilityBillbyFlatId = async (flatId: string,userId: string) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === UserRole.OWNER) {
        const flat = await prisma.flat.findUnique({
            where: { id: flatId },
            include: {
                building: true,
            },
        });

        if (!flat) {
            throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
        }

        if (flat.building.ownerId !== userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view utility bills for this flat");
        }
    }else if (user.role === UserRole.TENANT) {
        const flat = await prisma.flat.findFirst({
            where: {
                id: flatId,
                rooms: {
                    some: {
                        bookings: {
                            some: {
                                tenantId: userId,
                                status: BookingStatus.CONFIRMED,
                            },
                        },
                    },
                },
            },
        });

        if (!flat) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view utility bills for this flat");
        }
    }   
  const utilityBill = await prisma.utilityBill.findMany({
    where: { flatId },
    include: {
      flat: true,
    },
  });

  if (!utilityBill) {
    throw new AppError(httpStatus.NOT_FOUND, "Utility bill not found");
  }

  return utilityBill;
};
export const utilityBillService = {
  createUtilityBill,
  findAllUtilityBills,
  getUtilityBillById,
    getUtilityBillbyFlatId,
};
