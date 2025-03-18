import Joi from 'joi';

const JoiObjectId = require('joi-objectid')(Joi);

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('user', 'admin').default('user').messages({
    'any.only': "Role must be either 'user' or 'admin'",
  }),
  planId: Joi.string().required().messages({
    'any.required': 'Plan id is required',
  }),
  isActive: Joi.boolean().default(true),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const sessionDeleteSchema = Joi.object({
  id: JoiObjectId().required().messages({
    'any.required': 'The id field is required.',
    'string.pattern.base': 'The id must be a valid MongoDB ObjectId.',
  }),
});
