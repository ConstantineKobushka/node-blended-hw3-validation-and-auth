import { Schema, model } from 'mongoose';

import { saveErrorHandler, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/user.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post('save', saveErrorHandler);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', saveErrorHandler);

const UserCollection = model('user', userSchema);

export default UserCollection;
