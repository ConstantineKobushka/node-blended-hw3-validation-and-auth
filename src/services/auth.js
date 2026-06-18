import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createError from 'http-errors';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/user.js';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const findUserByEmail = async email =>
  await UserCollection.findOne({ email });

export const register = async userData => {
  const { password } = userData;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await UserCollection.create({
    ...userData,
    password: hashPassword,
  });

  return user;
};

export const login = async userId => {
  await SessionCollection.deleteOne({ userId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId,
    ...sessionData,
  });
};

export const refreshToken = async payload => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if (!oldSession) {
    throw createError(401, 'Session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const logout = async sessionId => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = filter => UserCollection.findOne(filter);

export const getSession = filter => SessionCollection.findOne(filter);
