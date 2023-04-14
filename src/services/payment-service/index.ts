import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const paymentService = {
  getPaymentInfo,
};

async function getPaymentInfo({ userId, ticketId }: { userId: number; ticketId: number }) {
  const ticket = await ticketsRepository.findById(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket?.Enrollment?.userId !== userId) throw unauthorizedError();

  const paymentInfo = await paymentRepository.findByTicketId({ ticketId });
  return paymentInfo;
}

export default paymentService;
