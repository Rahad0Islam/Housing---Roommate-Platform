import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config/config";
import { bkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { IBkashPayment } from "./bkashPayment.interface";
import httpStatus from "http-status";

const createBkashPayment = async (payload: IBkashPayment, userId: string) => {
  // Implementation for creating a Bkash payment

  const transactionResult = await prisma.$transaction(async (tx) => {
       const {bookingId,paymentType} = payload;

   const booking = await tx.booking.findUnique({
    where: { id: bookingId },
  });
  
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create a payment for this booking");
  }

  if (booking.status !== BookingStatus.PENDING ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment can only be created for Pending bookings");
  }
   
   const user = await tx.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
   const  amount = booking.amount;

   const token = await bkashIdToken();

		console.log("TOKEN:", token);

		const url = `${config.bkash_base_url}/tokenized/checkout/create`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: token,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
				mode: "0011",
				payerReference: "01770618575",
				callbackURL: `${config.bkash_callback_url}/bkash-payment/booking_payment/callback`,
				merchantAssociationInfo: "MI05MID54RF09123456One",
				amount: amount,
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: booking.id,
			}),
		});

		const result = await response.json();

    const isPaymentExists = await tx.payment.findUnique({
    where: { 
        tenantId: userId,
        merchantInvoiceNumber: result.merchantInvoiceNumber,
    },
    
  });
     
  if( isPaymentExists){
     await tx.payment.update({
        where: { 
            tenantId: userId,
            merchantInvoiceNumber: result.merchantInvoiceNumber,
        },
        data: {
            paymentType:paymentType,
            paymentGateway: "BKASH",
            amount,
            gatewayResponse: result,
            payerReference: user.email,
            bkashPaymentId: result.paymentID,
        },
    });
     return {paymentUrl: result.bkashURL};
  }
    const payment = await tx.payment.create({
    data: {
        tenantId: userId,
        bookingId: bookingId,
        paymentType:paymentType,
        paymentGateway: "BKASH",
        amount,
        merchantInvoiceNumber: result.merchantInvoiceNumber,
        gatewayResponse: result,
        payerReference: user.email,
        bkashPaymentId: result.paymentID,
        
    },
  });
    console.log("Bkash Payment Created:", payment);
    const paymentUrl = result.bkashURL;
    return {paymentUrl};
  });
  return transactionResult;
   
};


const bkashCallback = async (query: Record<string, any>)  => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const paymentID = query.paymentID;
		if (!paymentID) {
			throw new Error("Missing paymentID in callback query");
		}

		const status = query.status;

		if (!status) {
			throw new Error("Missing status in callback query");
		}

		const bkashToken = await bkashIdToken();
		const excutePayment = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					paymentID: paymentID,
				}),
			},
		);

		const excutePaymentResult = await excutePayment.json();

        if (!excutePayment.ok) {
			throw new Error(
				`Bkash execute payment failed: ${excutePayment.status} ${excutePayment.statusText}`,
			);
		}
        if(status === "failure"){
            await tx.payment.update({
                where: { bkashPaymentId: paymentID },
                data: {
                    status:  PaymentStatus.FAILED,
                    gatewayResponse: excutePaymentResult,
                },
            });
             return { redirectUrl: `${config.frontend_url}/dashboard/bookings?status=cancelled` };
        }
        else if (status === "cancel") {
            await tx.payment.update({
                where: { bkashPaymentId: paymentID },
                data: {
                    status:  PaymentStatus.CANCELLED,
                    gatewayResponse: excutePaymentResult,
                },
            });
             return { redirectUrl: `${config.frontend_url}/dashboard/bookings?status=cancelled` };
        }
        else if (status === "success") {

            await tx.payment.update({
                where: { bkashPaymentId: paymentID },
                data: {
                    status:  PaymentStatus.SUCCESS,
                    bkashTrxId: excutePaymentResult.trxID,
                    gatewayResponse: excutePaymentResult,
                    paidAt: excutePaymentResult.paymentExecuteTime,

                },
            });

            await tx.booking.update({
                where: { id: excutePaymentResult.merchantInvoiceNumber },
                data: {
                    status: BookingStatus.CONFIRMED,
                    room:{
                        update:{
                            availableBed: {
                                decrement: 1,
                            },
                        }
                    }
                },
            });

          
          return { redirectUrl: `${config.frontend_url}/dashboard/bookings?status=success` };

        }  

    })
    return transactionResult;
};

export default {
  createBkashPayment,
  bkashCallback,
};