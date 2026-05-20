import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from './errorHandler.js';

export function signToken(user) {
  return jwt.sign({ userId: user._id.toString() }, env.jwtSecret, { expiresIn: '7d' });
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Not authorized', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) throw new AppError('User not found', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(err);
  }
}

export function requireOrganizer(req, res, next) {
  if (req.user.role !== 'organizer') {
    return next(new AppError('Organizer access required', 403));
  }
  next();
}

export function requireAttendee(req, res, next) {
  if (req.user.role !== 'attendee') {
    return next(new AppError('Attendee access required', 403));
  }
  next();
}
