import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import { ImonthlyPayment } from "./monthlypayment.interface";
import httpStatus from "http-status";
import { format, startOfMonth } from 'date-fns';
import { BookingStatus } from "../../../generated/prisma/client";

const createMonthlyPayment = async (payload: ImonthlyPayment, userId: string) => {

    if(!payload.billingMonth){
     throw new AppError(httpStatus.BAD_REQUEST, "Billing month is required");
    }

  const { flatId, utilityId } = payload;
   const billingMonth = startOfMonth(payload.billingMonth);
   console.log("billingMonth", billingMonth, "flatId", flatId, "utilityId", utilityId);

  const monthlyPayment = await prisma.$transaction(async (tx) => {
     const flat = await tx.flat.findUnique({
      where: { id: flatId },
      include: {
        building: true,
        rooms: {
            include: {
                bookings: {
                    where: {
                        status: BookingStatus.CONFIRMED,
                    },
                },
            }
        },
      },
    });

    if (!flat) {
      throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
    }

    if (flat.building.ownerId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create a monthly payment for this flat");
    }

    const existingMonthlyPayment = await tx.monthlyPay.findFirst({
      where: {
        utilityId,
        billingMonth,
      },
    });

    if (existingMonthlyPayment) {
       if(format(existingMonthlyPayment?.billingMonth, 'yyyy-MM') === format(billingMonth, 'yyyy-MM')){
        throw new AppError(httpStatus.CONFLICT, "Monthly bill already exists for this month");
    }
    }

    const utilityBill = await tx.utilityBill.findFirst({
      where: {
        flatId,
        billingMonth,
      },
    });
      

    if (!utilityBill) {
      throw new AppError(httpStatus.NOT_FOUND, "Utility bill not found for this month");
    }

    
    const monthlyPayments = []; 
    for (const room of flat.rooms) {
      for (const booking of room.bookings) {
         const tenant = booking.tenantId
        // Create a monthly payment for the tenant
        const amount = Number(utilityBill.perTenantBill) + Number(room.monthlyRent);
        const monthlyPayment = await tx.monthlyPay.create({

          data: {
            tenantId: tenant,
            utilityId,
            billingMonth,
            amount,
            roomId: room.id,
            

          },
        });
        monthlyPayments.push(monthlyPayment);
      }
    }

    return monthlyPayments;
  });

  return monthlyPayment;
};



const getMonthlyPaymentById = async (monthlyPaymentId: string, userId: string ,role: string) => {
  
   
  const monthlyPayment = await prisma.monthlyPay.findUnique({
    where: { id: monthlyPaymentId },
    include: {
      room: true,
      utility: true,
      tenant: true,
    },
  });

  if (!monthlyPayment) {
    throw new AppError(httpStatus.NOT_FOUND, "Monthly payment not found");
  }

  
  if (role === "TENANT" && monthlyPayment.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this monthly payment");
  }

  if (role === "OWNER" && monthlyPayment.utility?.ownerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this monthly payment");
  }

  return monthlyPayment;
};


//get all monthly payments using rbac

const getAllMonthlyPayments = async (userId: string, role: string) => {
  let monthlyPayments;
  if (role === "TENANT") {
    monthlyPayments = await prisma.monthlyPay.findMany({
      where: { tenantId: userId },
      include: {
        room: true,
        utility: true,
        tenant: true,
      },
    });
  } else if (role === "OWNER") {
    monthlyPayments = await prisma.monthlyPay.findMany({
      where: { utility: { ownerId: userId } },
      include: {
        room: true,
        utility: true,
        tenant: true,
      },
    });
  } else if (role === "ADMIN") {
    monthlyPayments = await prisma.monthlyPay.findMany({
      include: {
        room: true,
        utility: true,
        tenant: true,
      },
    });
  }

  return monthlyPayments;
};


export const monthlyPaymentService = {
  createMonthlyPayment,
  getMonthlyPaymentById,
  getAllMonthlyPayments,
};