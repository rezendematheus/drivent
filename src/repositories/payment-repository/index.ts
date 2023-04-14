import { Payment } from '@prisma/client';
import { prisma } from '@/config';

const paymentRepository = {
  findByTicketId,
  insert,
};
function findByTicketId({ ticketId }: { ticketId: number }) {
  const result = prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return result;
}

function insert(paymentInfo: Payment) {
  const result = prisma.payment.upsert({
    where: {
      id: paymentInfo.id || 0,
    },
    create: paymentInfo as Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
    update: paymentInfo,
  });
  return result;
}

export default paymentRepository;
