import Joi from 'joi'

const paramSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token must not be empty',
    'any.required': 'Token is required',
  }),
})

export default paramSchema
