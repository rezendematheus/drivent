import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

const ticketsRepository = {
  findManyTicketType,
  findByEnrollmentId,
};

async function findManyTicketType(): Promise<TicketType[]> {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function findByEnrollmentId({ enrollmentId }: { enrollmentId: number }) {
  const result = await prisma.ticket.findMany({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
  return result;
}

export default ticketsRepository;
