import { Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { newTicket } from '@/protocols';

const ticketsRepository = {
  findManyTicketType,
  findByEnrollmentId,
  findById,
  insert,
  update,
};

async function findById(
  ticketId: number,
  ticketType?: boolean,
): Promise<
  Ticket & {
    Enrollment: Enrollment;
    TicketType: TicketType;
  }
> {
  const result = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
      TicketType: ticketType,
    },
  });
  return result;
}

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

async function insert(Ticket: newTicket) {
  const result = await prisma.ticket.create({
    data: Ticket as Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>,
    include: {
      TicketType: true,
    },
  });
  return result;
}

async function update(Ticket: newTicket) {
  const result = await prisma.ticket.update({
    where: {
      id: Ticket.id,
    },
    data: {
      status: Ticket.status as TicketStatus,
    },
  });
  return result;
}

export default ticketsRepository;
