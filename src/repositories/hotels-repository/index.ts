import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

const hotelsRepository = {
  findManyHotels,
  findUniqueHotel,
  findBookingByUserId,
};

function findManyHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany({
    include: {
      Rooms: true,
    },
  });
}
function findUniqueHotel(id: number) {
  return prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}
function findBookingByUserId(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
  });
}

export default hotelsRepository;
