import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';

const DEFAULT_CUSTOM_FIELDS = [
  { id: 'phone', label: 'Phone number', type: 'tel', required: true },
  {
    id: 'dietary',
    label: 'Dietary preference',
    type: 'select',
    required: true,
    options: ['Vegetarian', 'Non-vegetarian', 'Vegan'],
  },
];

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Event.deleteMany({});

  const organizer = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'demo123',
    role: 'organizer',
    profile: {
      age: '28',
      location: 'Mumbai, India',
      dietary: 'Vegetarian',
      phone: '+91 98765 43210',
    },
  });

  const attendee = await User.create({
    name: 'Alex Kumar',
    email: 'alex@example.com',
    password: 'demo123',
    role: 'attendee',
    profile: {
      age: '24',
      location: 'Bangalore, India',
      dietary: 'Non-vegetarian',
      phone: '+91 91234 56780',
    },
  });

  const now = Date.now();
  const day = 86400000;

  const events = [
    {
      organizer: organizer._id,
      title: 'React Summit 2026',
      description:
        'A full-day conference for React developers. Talks, workshops, and networking with industry leaders.',
      location: 'Convention Center, Mumbai',
      startDate: new Date(now + 14 * day),
      endDate: new Date(now + 14 * day + 8 * 3600000),
      capacity: 200,
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1540575467067-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      customFields: [
        { id: 'company', label: 'Company / College', type: 'text', required: true },
        { id: 'experience', label: 'Years of experience with React', type: 'number', required: false },
        ...DEFAULT_CUSTOM_FIELDS,
      ],
      registrations: [
        {
          user: attendee._id,
          registeredAt: new Date(now - 2 * day),
          responses: {
            name: 'Alex Kumar',
            email: 'alex@example.com',
            age: '24',
            location: 'Bangalore, India',
            dietary: 'Non-vegetarian',
            phone: '+91 91234 56780',
            company: 'TechStart',
            experience: '2',
          },
        },
      ],
    },
    {
      organizer: organizer._id,
      title: 'Startup Pitch Night',
      description: 'Watch early-stage founders pitch to investors. Open networking after the session.',
      location: 'WeWork, Bandra',
      startDate: new Date(now - 1 * day),
      endDate: new Date(now + 1 * day),
      capacity: 80,
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      customFields: [
        { id: 'linkedin', label: 'LinkedIn profile URL', type: 'text', required: true },
        ...DEFAULT_CUSTOM_FIELDS,
      ],
      registrations: [],
    },
    {
      organizer: organizer._id,
      title: 'Design Systems Workshop',
      description: 'Hands-on workshop building scalable design systems with Figma and React.',
      location: 'Online (Zoom)',
      startDate: new Date(now - 30 * day),
      endDate: new Date(now - 29 * day),
      capacity: 50,
      status: 'finished',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      customFields: DEFAULT_CUSTOM_FIELDS,
      registrations: [],
    },
    {
  organizer: organizer._id,
  title: 'Sufi Nights 2026',
  description:
    'An enchanting evening of soulful Sufi music, live performances, poetry, and cultural vibes under the stars.',
  location: 'Open Air Theatre, Delhi',
  startDate: new Date(now + 7 * day),
  endDate: new Date(now + 7 * day + 4 * 3600000),
  capacity: 300,
  status: 'active',
  image:
    'https://res.cloudinary.com/dbywo9ot5/image/upload/v1779266463/Sufi5_ivfnck.webp',
  customFields: [
    {
      id: 'groupSize',
      label: 'How many people are attending with you?',
      type: 'number',
      required: true,
    },
    ...DEFAULT_CUSTOM_FIELDS,
  ],
  registrations: [],
},

{
  organizer: organizer._id,
  title: 'HackForge 2026',
  description:
    'A 24-hour hackathon where developers, designers, and innovators build impactful tech solutions and compete for exciting prizes.',
  location: 'IIIT Ranchi',
  startDate: new Date(now + 21 * day),
  endDate: new Date(now + 22 * day),
  capacity: 500,
  status: 'active',
  image:
    'https://res.cloudinary.com/dbywo9ot5/image/upload/v1779120824/Hackathon_nfkarl.jpg',
  customFields: [
    {
      id: 'teamName',
      label: 'Team Name',
      type: 'text',
      required: true,
    },
    {
      id: 'github',
      label: 'GitHub Profile',
      type: 'text',
      required: true,
    },
    ...DEFAULT_CUSTOM_FIELDS,
  ],
  registrations: [],
},
  ];

  await Event.insertMany(events);

  console.log('Seed complete');
  console.log('  Organizer: priya@example.com / demo123');
  console.log('  Attendee:  alex@example.com / demo123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
