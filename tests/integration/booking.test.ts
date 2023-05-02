import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createBooking } from '../factories/booking-factory';
import { createEnrollmentWithAddress, createHotel, createRoomWithHotelId, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 403 if the user does not have a enrollment', async () => {
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
    it('should respoond with status 404 if the user does not have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should respond with status 200 if the use have a booking', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({ userId: user.id, roomId: room.id });

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        bookingId: booking.id,
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 403 if users does not have enrollment', async () => {
      const token = await generateValidToken();

      const response = await server.post('/booking').set('Authorization', `Bearar ${token}`);
      expect(response.status).toBe(403);
    });
    it('should respond with status 404 when given invalid partition roomId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);
      const body = {
        roomId: 0,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(404);
    });
    it('should respond with status 404 when theres no room to match valid partition roomId', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);
      const body = {
        roomId: faker.datatype.number(),
      };

      const response = await server.post('/booking').set('Authorization', `Bearar ${token}`).send(body);
      expect(response.status).toBe(404);
    });
    it('should respond with status 403 when the room is already booked', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const body = {
        roomId: room.id,
      };
      await createBooking({ roomId: room.id, userId: user.id });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(403);
    });

    it('should respond with status 201 when the booking is sucessfully created', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const body = {
        roomId: room.id,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put(`/booking/${faker.datatype.number}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put(`/booking/${faker.datatype.number}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put(`/booking/${faker.datatype.number}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user does not have an enrollment', async () => {
      const token = await generateValidToken();
      const body = {
        roomId: faker.datatype.number(),
      };
      const response = await server
        .put(`/booking/${faker.datatype.number()}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(response.status).toBe(403);
    });
    it('should respond with status 404 given unexistent valid bookingId', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({ roomId: room.id, userId: user.id });
      const body = {
        roomId: faker.datatype.number(),
      };

      const response = await server
        .put(`/booking/${booking.id + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(response.status).toBe(404);
    });

    it('should respond with status 404 given invalid partition bookingId', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({ roomId: room.id, userId: user.id });
      const body = {
        roomId: faker.datatype.number(),
      };

      const response = await server.put(`/booking/-1`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(404);
    });

    it('should respond with status 404 when given roomId does not exist', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({ roomId: room.id, userId: user.id });
      const body = {
        roomId: room.id + faker.datatype.number({ min: 1 }),
      };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(404);
    });

    it('should respond with status 403 when given room is already booked', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({ roomId: room.id, userId: user.id });
      const body = {
        roomId: room.id,
      };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(403);
    });

    it('should respond with status 200 when given valid update info', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const another_room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({ roomId: room.id, userId: user.id });
      const body = {
        roomId: another_room.id,
      };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(200);
    });
  });
});
