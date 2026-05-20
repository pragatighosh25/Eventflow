import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !role) {
      throw new AppError('Name, email, password, and role are required');
    }

    if (!['organizer', 'attendee'].includes(role)) {
      throw new AppError('Role must be organizer or attendee');
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new AppError('An account with this email already exists', 409);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role,
      profile: { age: '', location: '', dietary: 'Vegetarian', phone: '' },
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      throw new AppError('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
}
