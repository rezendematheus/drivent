import { prisma } from '@/config';
import { bookingCreateParams } from '@/services/booking-service';

const bookingRepository = {
  getBookingByUserId,
  createBooking,
  updateBooking,
  findBookingByRoomId,
  findBookingbyId,
};

function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

function createBooking(params: bookingCreateParams) {
  return prisma.booking.create({
    data: params,
    select: {
      id: true,
    },
  });
}

function updateBooking(params: { bookingId: number; roomId: number }) {
  return prisma.booking.update({
    where: {
      id: params.bookingId,
    },
    data: {
      roomId: params.roomId,
    },
    select: {
      id: true,
    },
  });
}

function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

function findBookingbyId(bookingId: number) {
  return prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
}

export default bookingRepository;
