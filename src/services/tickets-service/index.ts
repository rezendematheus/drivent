import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const ticketsService = {
  getAllTicketType,
  getAllUserTicket,
};

async function getAllTicketType(): Promise<TicketType[]> {
  const manyTicketType = await ticketsRepository.findManyTicketType();
  return manyTicketType;
}

async function getAllUserTicket({ userId }: { userId: number }) {
  const enrollmentId = await enrollmentRepository.findByUserId({ userId });
  if (!enrollmentId) throw notFoundError();
  const tickets = await ticketsRepository.findByEnrollmentId({ enrollmentId: enrollmentId.id });
  if (!tickets) throw notFoundError();
  return tickets;
}

export default ticketsService;
