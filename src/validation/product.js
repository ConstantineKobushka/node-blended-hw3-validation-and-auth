import Joi from 'joi';

import { typeList } from '../constants/product.js';

export const productAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),

  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number.',
    'number.min': 'Price cannot be negative.',
    'any.required': 'Price is required.',
  }),

  category: Joi.string()
    .valid(...typeList)
    .default('other')
    .messages({
      'string.base': 'Category must be a string.',
      'any.only': `Accepted values: ${typeList.join(', ')}`,
    }),

  description: Joi.string().allow(''),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.empty': 'Name cannot be empty.',
  }),

  price: Joi.number().min(0).messages({
    'number.base': 'Price must be a number.',
    'number.min': 'Price cannot be negative.',
  }),

  category: Joi.string()
    .valid(...typeList)
    .messages({
      'string.base': 'Category must be a string.',
      'any.only': `Accepted values: ${typeList.join(', ')}`,
    }),

  description: Joi.string().allow(''),
}).min(1);
