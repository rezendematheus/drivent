import { notFoundError, paymentRequired } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const hotelsService = {
  getAllHotels,
  getHotelById,
};

async function getAllHotels() {
  return await hotelsRepository.findManyHotels();
}

async function getHotelById(params: { hotelId: number; userId: number }) {
  const { hotelId, userId } = params;

  const enrollment = await enrollmentRepository.findById(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID')
    throw paymentRequired();

  const booking = await hotelsRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return await hotelsRepository.findUniqueHotel(hotelId);
}

export default hotelsService;
