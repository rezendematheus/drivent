import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';

const bookingService = {
  getBookingByUserId,
  createBooking,
  updateBookingRoom,
};

async function getBookingByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const booking = await bookingRepository.getBookingByUserId(userId);

  if (!booking) throw notFoundError();
  return { bookingId: booking.id };
}

async function createBooking(params: bookingCreateParams) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(params.userId);
  if (!enrollment) throw forbiddenError();

  const roomExists = await hotelRepository.findRoomById(params.roomId);
  if (!roomExists) throw notFoundError();

  const bookingExists = await bookingRepository.findBookingByRoomId(params.roomId);
  if (bookingExists) throw forbiddenError();

  const createdBooking = await bookingRepository.createBooking(params);
  return { bookingId: createdBooking.id };
}
async function updateBookingRoom(params: updateBookingParams & { userId: number }) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(params.userId);
  if (!enrollment) throw forbiddenError();
  const bookingExists = await bookingRepository.findBookingbyId(params.bookingId);
  if (!bookingExists) throw notFoundError();

  if (bookingExists.userId !== params.userId) throw forbiddenError();

  const roomExists = await hotelRepository.findRoomById(params.roomId);
  if (!roomExists) throw notFoundError();

  const roomOcuppied = await bookingRepository.findBookingByRoomId(params.roomId);
  if (roomOcuppied) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(params);
  return { bookingId: updatedBooking.id };
}

export type bookingCreateParams = {
  userId: number;
  roomId: number;
};

export type updateBookingParams = {
  bookingId: number;
  roomId: number;
};

export default bookingService;
