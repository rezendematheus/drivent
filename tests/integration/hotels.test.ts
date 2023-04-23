import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel, createHotelRoom, createHotelRoomBooking } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

afterAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should return status 401 when no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should return status 401 when invalid token is given', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should return status 401 when there is no active session for the given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('Should return empty array when there are no hotels created', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveLength(0);
    });

    it('Should responde with status 200 and the existing Hotels data', async () => {
      const token = await generateValidToken();

      const hotel = await createHotel();
      const Room = await createHotelRoom({ hotelId: hotel.id });

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: [
            {
              id: Room.id,
              name: Room.name,
              capacity: Room.capacity,
              hotelId: Room.hotelId,
              createdAt: Room.createdAt.toISOString(),
              updatedAt: Room.updatedAt.toISOString(),
            },
          ],
        },
      ]);
    });
  });
});
describe('GET /hotels/:id', () => {
  it('Should return status 401 when no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should return status 401 when invalid token is given', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should return status 401 when there is no active session for the given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('Should return status 404 when enrollment does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should return status 404 when ticket does not exist', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      await createTicketType({ isRemote: true, includesHotel: false });
      const token = await generateValidToken();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should return status 402 when ticket is remote', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const TicketType = await createTicketType({ isRemote: true, includesHotel: false });
      await createTicket(enrollment.id, TicketType.id, 'PAID');
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(402);
    });

    it('Should return status 402 when ticket does not includes hotel', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const TicketType = await createTicketType({ isRemote: false, includesHotel: false });
      await createTicket(enrollment.id, TicketType.id, 'PAID');
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(402);
    });

    it('Should return status 402 when the ticket status is not PAID', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const TicketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, TicketType.id, 'RESERVED');
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(402);
    });

    it('Should return status 404 when booking does not exist', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const TicketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, TicketType.id, 'PAID');
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it('Should return status 200 and the found hotel data', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const TicketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, TicketType.id, 'PAID');
      const booking = await createHotelRoomBooking(user.id);
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/${booking.Room.Hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: booking.Room.Hotel.id,
          name: booking.Room.Hotel.name,
          image: booking.Room.Hotel.image,
          createdAt: booking.Room.Hotel.createdAt.toISOString(),
          updatedAt: booking.Room.Hotel.updatedAt.toISOString(),
          Rooms: [
            {
              id: booking.Room.id,
              name: booking.Room.name,
              capacity: booking.Room.capacity,
              hotelId: booking.Room.hotelId,
              createdAt: booking.Room.createdAt.toISOString(),
              updatedAt: booking.Room.updatedAt.toISOString(),
            },
          ],
        },
      ]);
    });
  });
});
