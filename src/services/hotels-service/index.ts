import { notFoundError, paymentRequired } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const hotelsService = {
  getAllHotels,
  getHotelById,
};

async function getAllHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote) throw paymentRequired();
  if (!ticket.TicketType.includesHotel) throw paymentRequired();
  if (ticket.status !== 'PAID') throw paymentRequired();

  const hotels = await hotelsRepository.findManyHotels();
  if (!hotels[0]) throw notFoundError();
  return hotels;
}

async function getHotelById(params: { hotelId: number; userId: number }) {
  const { hotelId, userId } = params;

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote) throw paymentRequired();
  if (!ticket.TicketType.includesHotel) throw paymentRequired();
  if (ticket.status !== 'PAID') throw paymentRequired();

  const booking = await hotelsRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return await hotelsRepository.findUniqueHotel(hotelId);
}

export default hotelsService;
