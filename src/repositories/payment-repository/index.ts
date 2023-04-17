import { Payment } from '@prisma/client';
import { prisma } from '@/config';

const paymentRepository = {
  findByTicketId,
  insert,
};
async function findByTicketId({ ticketId }: { ticketId: number }): Promise<Payment> {
  const result = await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return result;
}

async function insert(paymentInfo: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
  const result = await prisma.payment.create({
    data: paymentInfo as Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  });
  return result;
}

export default paymentRepository;
