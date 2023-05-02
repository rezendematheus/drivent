import { prisma } from '@/config';

export function createBooking(params: { roomId: number; userId: number }) {
  return prisma.booking.create({
    data: params,
  });
}
