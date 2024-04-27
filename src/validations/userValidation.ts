import Joi from 'joi'

const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .alphanum()
    .pattern(/^[a-zA-Z0-9]+$/)
    .required(),
})

export default userSchema
