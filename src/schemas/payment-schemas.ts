import Joi from 'joi';

export const paymentBodySchema = Joi.object({
  ticketId: Joi.number().min(1).required(),
  cardData: Joi.object({
    issuer: Joi.string().valid('VISA', 'MASTERCARD').required(),
    number: Joi.number().integer().custom(joiSimpleCreditCardNumberValidation).required(),
    name: Joi.string().min(3).required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().integer().min(1).max(999).required(),
  }).required(),
});

function joiCreditCardNumberValidation(value: number, helpers: Joi.CustomHelpers<string>) {
  //matches Visa, MasterCard, American Express, Diners Club, Discover, and JCB
  if (!value) return value;
  const stringNumber = value.toString();
  if (
    !stringNumber.match(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
    )
  ) {
    return helpers.error('any.invalid');
  }
  return value;
}

function joiSimpleCreditCardNumberValidation(value: number, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;
  const stringNumber = value.toString();
  if (!(stringNumber.length < 13 || stringNumber.length > 16)) {
    return helpers.error('any.invalid');
  }
  return value;
}
