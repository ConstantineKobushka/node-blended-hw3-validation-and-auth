import { Schema, model } from 'mongoose';

import { saveErrorHandler, setUpdateSettings } from './hooks.js';
import { typeList } from '../../constants/product.js';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: typeList,
      default: 'other',
      required: true,
    },

    description: {
      type: String,
      default: '',
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const sortByList = ['name', 'price', 'category'];

productSchema.post('save', saveErrorHandler);
productSchema.pre('findOneAndUpdate', setUpdateSettings);
productSchema.post('findOneAndUpdate', saveErrorHandler);

const ProductCollection = model('product', productSchema);

export default ProductCollection;
