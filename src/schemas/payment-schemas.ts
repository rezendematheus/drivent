import Joi from 'joi';
import dayjs from 'dayjs';

export const paymentBodySchema = Joi.object({
  ticketId: Joi.number().min(1).required(),
  cardData: Joi.object({
    issuer: Joi.string().min(3).required(),
    number: Joi.number().integer().custom(joiSimpleCreditCardNumberValidation).required(),
    name: Joi.string().min(3).required(),
    expirationDate: Joi.custom(creditCardDateValidate).required(),
    cvv: Joi.number().integer().min(1).max(999).required(),
  }).required(),
});

function joiSimpleCreditCardNumberValidation(value: number, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;
  const stringNumber = value.toString();
  if (stringNumber.length < 13 || stringNumber.length > 16) {
    return helpers.error('any.invalid');
  }
  return value;
}

function creditCardDateValidate(value: Date, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;
  const parts = value.toString().split('/');
  if (!(Number(parts[0]) > 0 && Number(parts[0]) < 12 && Number(parts[1]) >= dayjs().year() - 1)) {
    return helpers.error('any.invalid');
  }
  return value;
}
