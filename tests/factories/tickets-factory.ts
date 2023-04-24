import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(params?: Partial<TicketType>) {
  let isRemote = true;
  let includesHotel = true;
  if(params?.isRemote !== undefined && !params.isRemote){
    isRemote = false;
  } else if (params?.isRemote){
    isRemote = true;
  } else {
    isRemote = faker.datatype.boolean();
  }
  if(params?.includesHotel !== undefined && !params.includesHotel){
    includesHotel = false;
  } else if (params?.includesHotel){
    includesHotel = true;
  } else {
    includesHotel = faker.datatype.boolean();
  }

  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote,
      includesHotel: includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
