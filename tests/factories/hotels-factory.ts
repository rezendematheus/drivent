import faker from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel(params?: Partial<Hotel>): Promise<Hotel> {
  const hotel = {
    name: faker.lorem.word() || params.name,
    image: faker.image.imageUrl() || params.image,
  };
  return prisma.hotel.create({
    data: hotel,
  });
}

export async function createHotelRoom(params?: { hotelId: number } & Partial<Room>): Promise<Room> {
  const room = {
    name: faker.lorem.word() || params.name,
    capacity: Number(faker.random.numeric()) || params.capacity,
    hotelId: params.hotelId,
  };
  return prisma.room.create({
    data: room,
  });
}

export async function createBooking(params: { userId: number; roomId: number }) {
  return prisma.booking.create({
    data: params,
    include: {
      Room: {
        include: {
          Hotel: true,
        },
      },
    },
  });
}

export async function createHotelRoomBooking(userId: number) {
  const hotel = await createHotel();
  const room = await createHotelRoom({ hotelId: hotel.id });
  return await createBooking({ userId, roomId: room.id });
}
