import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const profileSchema = new mongoose.Schema(
  {
    age: { type: String, default: '' },
    location: { type: String, default: '' },
    dietary: { type: String, default: 'Vegetarian' },
    phone: { type: String, default: '' },
    /** Comma-separated interests for AI recommendations */
    interests: { type: String, default: '' },
    /** Helps AI: tech | non-tech | both */
    focus: { type: String, enum: ['', 'tech', 'non-tech', 'both'], default: '' },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['organizer', 'attendee'], required: true },
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    profile: this.profile,
  };
};

export const User = mongoose.model('User', userSchema);
