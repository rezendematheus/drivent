import Joi from 'joi';

export const ticketTypeIdSchema = Joi.object<ticketTypeId>({
  ticketTypeId: Joi.number().min(1).required(),
});

type ticketTypeId = {
  ticketTypeId: number;
};
