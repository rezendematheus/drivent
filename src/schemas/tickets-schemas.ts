import Joi from 'joi';

export const ticketTypeIdSchema = Joi.object<ticketTypeId>({
  ticketTypeId: Joi.number().min(1).required(),
});

export const ticketIdParamsSchema = Joi.object<ticketIdString>({
  ticketId: Joi.string()
    .pattern(/^[1-9]+$/)
    .required(),
});

type ticketTypeId = {
  ticketTypeId: number;
};

type ticketIdString = {
  ticketId: string;
};
