import mongoose from 'mongoose';

const customFieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: { type: [String], default: undefined },
  },
  { _id: false },
);

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registeredAt: { type: Date, default: Date.now },
    responses: { type: Map, of: String, default: {} },
  },
  { _id: true },
);

const eventSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['active', 'finished'], default: 'active' },
    image: { type: String, default: '' },
    customFields: { type: [customFieldSchema], default: [] },
    registrations: { type: [registrationSchema], default: [] },
  },
  { timestamps: true },
);

export const Event = mongoose.model('Event', eventSchema);
