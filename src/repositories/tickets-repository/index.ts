import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

const ticketsRepository = {
  findManyTicketType,
  findByEnrollmentId,
  insert,
};

async function findManyTicketType(): Promise<TicketType[]> {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function findByEnrollmentId({ enrollmentId }: { enrollmentId: number }) {
  const result = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId || 0,
    },
    include: {
      TicketType: true,
    },
  });
  return result;
}

async function insert(Ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await prisma.ticket.create({
    data: Ticket,
    include: {
      TicketType: true,
    },
  });

  return result;
}

export default ticketsRepository;
