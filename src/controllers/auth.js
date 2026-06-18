import createError from 'http-errors';
import bcrypt from 'bcrypt';

import * as authService from '../services/auth.js';
import SessionCollection from '../db/models/Session.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const { email } = req.body;

  const user = await authService.findUserByEmail(email);
  if (user) {
    throw createError(409, 'User already exist');
  }

  const newUser = await authService.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { name: newUser.name, email: newUser.email },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.findUserByEmail(email);
  if (!user) {
    throw createError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const session = await authService.login(user._id);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await authService.refreshToken({ refreshToken, sessionId });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authService.logout(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
