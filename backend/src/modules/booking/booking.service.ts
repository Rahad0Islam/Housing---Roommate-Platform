import { BookingStatus, RentType, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status";
import { differenceInDays } from "date-fns";

const createBooking = async (payload: IBooking, userId: string) => {
  
    console.log({payload, userId});
  const { roomId, rentType, startDate, endDate } = payload;
   
  if (!roomId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room ID is required");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found");
  }

  if (room.availableBed <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No available beds in this room");
  }

  if (!rentType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rent type is required");
  }

  if (!startDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "Start date is required");
  }

  if (!endDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "End date is required");
  }

  if (startDate >= endDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "Start date must be before end date");
  }

  const days = differenceInDays(endDate, startDate);
  if(rentType === RentType.SHORT_TERM && days > 30){
    throw new AppError(httpStatus.BAD_REQUEST, "Short term booking cannot exceed 30 days");
  }

  if(rentType === RentType.LONG_TERM && days < 90){
    throw new AppError(httpStatus.BAD_REQUEST, "Long term booking must be at least 90 days");
  }
  const amount = rentType === RentType.LONG_TERM ? room.monthlyRent : Number(room.dailyRent)*days;


  const oldBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      tenantId: userId,
    }
  });
   
  if(oldBooking){
      if(oldBooking.status === BookingStatus.PENDING){
        throw new AppError(httpStatus.BAD_REQUEST, "You already have a pending booking for this room");
      }
      if(oldBooking.status === BookingStatus.CONFIRMED){
        throw new AppError(httpStatus.BAD_REQUEST, "You already have a confirmed booking for this room");
      }
      if(oldBooking.status === BookingStatus.ON_GOING){
        throw new AppError(httpStatus.BAD_REQUEST, "You already have an ongoing booking for this room");
      }
  }
  const booking = await prisma.booking.create({
    data: {
        roomId, 
        rentType,
        startDate,
        endDate,
        amount,
        status: BookingStatus.PENDING,
        tenantId: userId,
    },
  });

  // Decrease the availableBed count in the room
//   await prisma.room.update({
//     where: { id: roomId },
//     data: {
//       availableBed: room.availableBed - 1,
//     },
//   });

  return booking;
};


const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the user is an admin or owner of the flat associated with the booking
  if (user.role === UserRole.ADMIN) {
    return booking; // Admin can view any booking
  }

  if (user.role === UserRole.OWNER) {
     
     const findRoomOwner = await prisma.booking.findUnique({
        where: { 
            id: bookingId,
            room: {
                flat: {
                    building: {
                        ownerId: userId,
                    },
                },
            },  
        },
     })

    return booking;
  }

  // If the user is a tenant, check if they are the one who made the booking
  if (booking.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this booking");
  }

  return booking;
};

const getAllbooking = async (userId: string) => {

   const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }


  //find all bookings using RBAC. tenant show their own bookings, owner show the bookings of their flats, admin show all bookings
  let AllBookings;
    if (user.role === UserRole.OWNER) {
         AllBookings = await prisma.booking.findMany({
            where: {
                room: {
                    flat: {
                        building: {
                            ownerId: userId,
                        },
                    },
                },
            },
        });
    }
    if( user.role === UserRole.ADMIN) {
        AllBookings = await prisma.booking.findMany();
    }
    if(user.role === UserRole.TENANT) {
        AllBookings = await prisma.booking.findMany({
            where: {
                tenantId: userId,
            },
        });
    }

  if (!AllBookings || AllBookings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No bookings found");
  }

  return AllBookings;
};
   

const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to cancel this booking");
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only pending bookings can be cancelled");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  });

  
  return updatedBooking;
};


const onGoingBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the user is an admin or owner of the flat associated with the booking
   if(user.role !==UserRole.ADMIN && user.role !== UserRole.OWNER){
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to mark this booking as ongoing");
   }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only confirmed bookings can be marked as ongoing");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.ON_GOING },
  });

  
  return updatedBooking;
}
const completeBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the user is an admin or owner of the flat associated with the booking
   if(user.role !==UserRole.ADMIN && user.role !== UserRole.OWNER){
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to mark this booking as completed");
   }

  if (booking.status !== BookingStatus.ON_GOING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only ongoing bookings can be completed");
  }
   //also availableBed should be increased by 1 in the room when booking is completed
   const room = await prisma.room.findUnique({
    where: { id: booking.roomId },
  });

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.COMPLETED },
  });

  await prisma.room.update({
    where: { id: room.id },
    data: {
      availableBed: room.availableBed + 1,
      availableFrom: room.availableFrom > new Date() ? room.availableFrom : new Date(),
    },
  });

  
  return updatedBooking;
};

export const bookingService = {
  createBooking,
  getBookingById,
  getAllbooking,
  cancelBooking,
  onGoingBooking,
  completeBooking,
};