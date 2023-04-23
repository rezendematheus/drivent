import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import { paymentRequest } from '@/protocols';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const paymentService = {
  getPaymentInfo,
  postPaymentInfo,
};

async function getPaymentInfo({ userId, ticketId }: { userId: number; ticketId: number }) {
  const ticket = await ticketsRepository.findById(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket?.Enrollment?.userId !== userId) throw unauthorizedError();

  const paymentInfo = await paymentRepository.findByTicketId({ ticketId });
  return paymentInfo;
}

async function postPaymentInfo({ userId, paymentRequest }: { userId: number; paymentRequest: paymentRequest }) {
  const ticket = await ticketsRepository.findById(paymentRequest.ticketId, true);
  if (!ticket) throw notFoundError();
  if (ticket?.Enrollment?.userId !== userId) throw unauthorizedError();

  const paymentBody: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
    ticketId: paymentRequest.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: paymentRequest.cardData.issuer,
    cardLastDigits: paymentRequest.cardData.number.toString().slice(-4),
  };
  const createdPayment = await paymentRepository.insert(paymentBody);
  const updatedTicket = await ticketsRepository.update({ id: ticket.id, status: 'PAID' });
  return createdPayment;
}

export default paymentService;
