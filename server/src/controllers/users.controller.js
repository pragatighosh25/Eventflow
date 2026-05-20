import { AppError } from '../middleware/errorHandler.js';

export async function updateProfile(req, res, next) {
  try {
    const { name, age, location, dietary, phone, interests, focus } = req.body;
    const user = req.user;

    if (name?.trim()) user.name = name.trim();
    if (age !== undefined) user.profile.age = String(age);
    if (location !== undefined) user.profile.location = location;
    if (dietary !== undefined) user.profile.dietary = dietary;
    if (phone !== undefined) user.profile.phone = phone;
    if (interests !== undefined) user.profile.interests = String(interests);
    if (focus !== undefined && ['', 'tech', 'non-tech', 'both'].includes(focus)) {
      user.profile.focus = focus;
    }

    await user.save();

    res.json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}
